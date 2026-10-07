import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2)
    .max(100),

  customerPhone: z
    .string()
    .trim()
    .min(7)
    .max(20),

  customerEmail: z
    .string()
    .email()
    .optional(),

  deliveryAddress: z
    .string()
    .trim()
    .min(5)
    .max(300),

  city: z
    .string()
    .trim()
    .min(2)
    .max(100),

  postalCode: z
    .string()
    .trim()
    .max(20)
    .optional(),

  deliveryNotes: z
    .string()
    .trim()
    .max(500)
    .optional(),
  paymentMethod: z.enum(["PAYHERE", "WHATSAPP"]),

  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});