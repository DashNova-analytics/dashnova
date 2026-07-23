import { createProductService, getProducts } from "./products.service.js";

export async function createProduct(req, res, next) {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function listProducts(req, res, next) {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

