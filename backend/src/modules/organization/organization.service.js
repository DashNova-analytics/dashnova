import { createOrganization, listOrganizations } from "./organization.repository.js";

export function createOrganizationService(data) {
  return createOrganization(data);
}

export function getOrganizations() {
  return listOrganizations();
}

