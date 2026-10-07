import prisma from "../config/database.js";
import md5 from "crypto-js/md5.js";

export async function getPaymentByOrderId(orderId) {
    return prisma.payment.findUnique({
        where:{
            orderId
        },
    });
}

export async function updatePaymentStatus(orderId, status, transactionId = null) {
return prisma.payment.update({
    where:{
        orderId
    },
    data:{
        status,
        transactionId,
        paidAt: status === "PAID" ? new Date() : null
    }
  })
}

export function verifyPayHereNotification({
  merchantId,
  orderId,
  amount,
  currency,
  statusCode,
  md5sig,
}) {
  if (merchantId !== process.env.PAYHERE_MERCHANT_ID) {
    return false;
  }
  if (currency !== "LKR") {
    return false;
  }
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

  const hashedSecret = md5(merchantSecret)
    .toString()
    .toUpperCase();

  const localMd5sig = md5(
    merchantId +
      orderId +
      amount +
      currency +
      statusCode +
      hashedSecret
  )
    .toString()
    .toUpperCase();

  return localMd5sig === md5sig;
}

export async function handlePayHereNotification(data) {
  const {
    merchant_id,
    order_id,
    payment_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = data;

  const valid = verifyPayHereNotification({
    merchantId: merchant_id,
    orderId: order_id,
    amount: payhere_amount,
    currency: payhere_currency,
    statusCode: status_code,
    md5sig,
  });

  if (!valid) {
    throw new Error("Invalid PayHere notification signature");
  }

  const order = await prisma.order.findUnique({
    where: {
      orderNumber: order_id,
    },
    include: {
      payment: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (!order.payment) {
    throw new Error("Payment record not found");
  }

  if (order.payment.method !== "PAYHERE") {
    throw new Error("Invalid payment method");
  }
  if (
  order.payment.status === "PAID" &&
  status_code === "2"
  ) {
    return {
      success: true,
      paymentStatus: "PAID",
      message: "Payment already processed",
    };
  }

  const receivedAmount = Number(payhere_amount);
  const orderAmount = Number(order.total);

  if (receivedAmount !== orderAmount) {
    throw new Error("Payment amount mismatch");
  }

  let paymentStatus = "PENDING";

  if (status_code === "2") {
    paymentStatus = "PAID";
  } else if (status_code === "0") {
    paymentStatus = "PENDING";
  } else if (
    status_code === "-1" ||
    status_code === "-2"
  ) {
    paymentStatus = "FAILED";
  } else if (status_code === "-3") {
    paymentStatus = "REFUNDED";
  }

  await prisma.payment.update({
    where: {
      orderId: order.id,
    },
    data: {
      status: paymentStatus,
      transactionId: payment_id || null,
      paidAt:
        paymentStatus === "PAID"
          ? new Date()
          : null,
      provider: "PayHere",
    },
  });

  // Only move the order forward after
  // a verified successful payment.
  if (
    paymentStatus === "PAID" &&
    order.orderStatus === "PENDING"
  ) {
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        orderStatus: "CONFIRMED",
      },
    });
  }

  return {
    success: true,
    paymentStatus,
  };
}