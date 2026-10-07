import prisma from "../config/database.js";
import { calculateOrderPricing } from "./pricing.service.js";
import { canChangeOrderStatus } from "../utils/orderStatus.js";

function generateOrderNumber() {
  const timestamp = Date.now();

  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(data) {
  return prisma.$transaction(async (tx) => {

    const itemMap = new Map();
    for (const item of data.items) {
      const existing = itemMap.get(item.productId);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        itemMap.set(item.productId, {
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }
    const normalizedItems = Array.from(itemMap.values());
    const productIds = normalizedItems.map(
      (item) => item.productId
    );

    const products = await tx.product.findMany({
      where: {
        id: {
          in: productIds,
        },
        isAvailable: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products are unavailable");
    }

    const productMap = new Map(
      products.map((product) => [product.id, product])
    );

    let subtotal = 0;

    const orderItems = [];

    for (const item of normalizedItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(
          `Product ${item.productId} not found`
        );
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(
          `Not enough stock for ${product.name}`
        );
      }

      const unitPrice = Number(product.price);

      const itemSubtotal =
        unitPrice * item.quantity;

      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    const { deliveryFee, tax, total } =
    calculateOrderPricing(subtotal);

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),

        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,

        deliveryAddress: data.deliveryAddress,
        city: data.city,
        postalCode: data.postalCode,
        deliveryNotes: data.deliveryNotes,

        subtotal,
        deliveryFee,
        tax,
        total,

        orderStatus: "PENDING",

        items: {
          create: orderItems,
        },

        payment: {
          create: {
            method: data.paymentMethod,
            status:
              data.paymentMethod === "WHATSAPP"
                ? "NOT_REQUIRED"
                : "PENDING",
            amount: total,
            provider:
              data.paymentMethod === "PAYHERE"
                ? "PayHere"
                : "WhatsApp",
          },
        },
      },

      include: {
        items: true,
        payment: true,
      },
    });

    for (const item of normalizedItems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    return order;
  });
}

export async function getOrders(){
  return prisma.order.findMany({
    include:{
      items:true,
      payment:true
    },
    orderBy:{
      createdAt:"desc"
    }
  });
}

export async function getOrderById(id) {
  return prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
      payment: true,
    },
  });
}

export async function updateOrderStatus(id, orderStatus) {
  const order = await prisma.order.findUnique({
    where: { id },
  });
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderStatus === orderStatus) {
    return order;
  }
  if (!canChangeOrderStatus(order.orderStatus, orderStatus)) {
    throw new Error(
      `Cannot change order status from ${order.orderStatus} to ${orderStatus}`
    );
  }

  return prisma.order.update({
    where: { id },
    data: { orderStatus },
    include: {
      items: true,
      payment: true,
    },
  });
}