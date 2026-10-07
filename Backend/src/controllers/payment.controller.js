import { 
  getPaymentByOrderId,
  handlePayHereNotification
} from "../services/payment.service.js";
import { generatePayHereHash } from "../services/payhere.service.js";
import prisma from "../config/database.js";
export async function getPaymentByOrderIdController(req, res, next) {
    try{
        const orderId = Number(req.params.orderId);

        if (!Number.isInteger(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            });
        }

        const payment = await getPaymentByOrderId(orderId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }
        res.json({
            success: true,
            data: payment,
        })
    }catch(error){
        next(error);
    }
}

export async function createPayHereCheckoutController(
  req,
  res,
  next
) {
  try {
    const orderId = Number(req.params.orderId);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (order.payment.method !== "PAYHERE") {
      return res.status(400).json({
        success: false,
        message: "This order is not a PayHere order",
      });
    }

    const merchantId =
      process.env.PAYHERE_MERCHANT_ID;

    const merchantSecret =
      process.env.PAYHERE_MERCHANT_SECRET;

    const currency = "LKR";

    const hash = generatePayHereHash({
      merchantId,
      merchantSecret,
      orderId: order.orderNumber,
      amount: order.total,
      currency,
    });

    const firstName =
      order.customerName.split(" ")[0];

    const lastName =
      order.customerName
        .split(" ")
        .slice(1)
        .join(" ") || firstName;

    res.json({
      success: true,
      data: {
        merchant_id: merchantId,
        order_id: order.orderNumber,
        amount: Number(order.total).toFixed(2),
        currency,
        hash,
        first_name: firstName,
        last_name: lastName,
        email:
          order.customerEmail ||
          "customer@example.com",
        phone: order.customerPhone,
        address: order.deliveryAddress,
        city: order.city,
        country: "Sri Lanka",
        items: order.items
          .map((item) => item.productName)
          .join(", "),
        return_url:
          `${process.env.CLIENT_URL}/payment/success`,
        cancel_url:
          `${process.env.CLIENT_URL}/payment/cancel`,
        notify_url:
          process.env.PAYHERE_NOTIFY_URL,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function payHereNotificationController(
  req,
  res,
  next
) {
  try {
    await handlePayHereNotification(req.body);

    res.status(200).send("OK");
  } catch (error) {
    next(error);
  }
}