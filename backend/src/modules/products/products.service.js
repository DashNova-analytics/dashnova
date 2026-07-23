import { createProduct, listProducts } from "./products.repository.js";

export function createProductService(data) {
  return createProduct(data);
}

export function getProducts() {
  return listProducts();
}

