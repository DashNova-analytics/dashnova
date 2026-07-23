import { createCustomerService, getCustomers } from "./customers.service.js";

export async function createCustomer(req, res, next) {
  try {
    const customer = await createCustomerService(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
}

export async function listCustomers(req, res, next) {
  try {
    const customers = await getCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
}

