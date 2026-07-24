export function organizationValidator(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Organization name is required" });
  }
  next();
}

