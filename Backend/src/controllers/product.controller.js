import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
} from "../services/product.service.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

export async function getProductsController(req, res, next) {
  try {
    const { category, search } = req.query;

    const products = await getProducts({
      category,
      search,
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductByIdController(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProductController(req, res, next) {
  try{
    const data = createProductSchema.parse(req.body);
    const product = await createProduct(data);
    
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductController(req, res, next) {
  try{
    const id = Number(req.params.id);

    if(!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const data = updateProductSchema.parse(req.body);
    const product = await updateProduct(id, data);

    res.json({
      success: true,
      data: product,
    });
  }catch (error) {
    next(error);
  }
}


export async function deactivateProductController(req, res, next) {
  try{
    const id = Number(req.params.id);

    if(!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await deactivateProduct(id);

    res.json({
      success: true,
      data: product,
    });
  }catch (error) {
    next(error);
  }
}