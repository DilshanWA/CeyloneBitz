import { getCategories } from "../services/category.service.js";

export async function getCategoriesController(req, res, next) {
  try {
    const categories = await getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}