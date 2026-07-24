import { createOrganizationService, getOrganizations } from "./organization.service.js";

export async function createOrganization(req, res, next) {
  try {
    const organization = await createOrganizationService(req.body);
    res.status(201).json(organization);
  } catch (error) {
    next(error);
  }
}

export async function listOrganizations(req, res, next) {
  try {
    const organizations = await getOrganizations();
    res.json(organizations);
  } catch (error) {
    next(error);
  }
}

