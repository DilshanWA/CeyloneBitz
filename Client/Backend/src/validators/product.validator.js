import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().trim().min(2).max(150),
  slug: z.string().trim().min(2).max(150),
  description: z.string().trim().max(1000).optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  stockQuantity: z.number().int().min(0),
  isAvailable: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();