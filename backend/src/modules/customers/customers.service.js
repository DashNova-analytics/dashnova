import { createCustomer, listCustomers } from "./customers.repository.js";

export function createCustomerService(data) {
  return createCustomer(data);
}

export function getCustomers() {
  return listCustomers();
}

