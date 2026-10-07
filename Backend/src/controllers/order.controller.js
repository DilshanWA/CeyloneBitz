import { createOrderSchema } from "../validators/order.validator.js";
import { updateOrderStatusSchema } from "../validators/order-status.validator.js";
import { 
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} from "../services/order.service.js";
import { generateWhatsAppMessage } from "../services/whatsapp.service.js";
import prisma from "../config/database.js";

export async function createOrderController(req, res, next) {
    try{
        const data = createOrderSchema.parse(req.body);
        const order = await createOrder(data);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    }catch (error) {
        next(error);
    }
}

export async function getOrderController(req, res, next) {
    try{
        const orders = await getOrders();
        res.json({
            success: true,
            data: orders,
        });
    }catch (error) {
        next(error);
    }
}

export async function getOrderByIdController(req, res, next) {
    try{
        const id = Number(req.params.id);
        if(!Number.isInteger(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid order ID",
            })
        }
        const order = await getOrderById(id);
        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }
        res.json({
            success: true,
            data: order,
        });
    }catch (error) {
        next(error);
    }
}


export async function updateOrderStatusController(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const { orderStatus } =
      updateOrderStatusSchema.parse(req.body);

    const order = await updateOrderStatus(
      id,
      orderStatus
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

export async function getWhatsAppOrderController(
  req,
  res,
  next
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const message =
      generateWhatsAppMessage(order);

    const whatsappNumber =
      process.env.WHATSAPP_NUMBER;

    if (!whatsappNumber) {
      return res.status(500).json({
        success: false,
        message: "WhatsApp number is not configured",
      });
    }

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=` +
      encodeURIComponent(message);

    res.json({
      success: true,
      data: {
        message,
        whatsappUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}