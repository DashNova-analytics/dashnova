export function uploadValidator(req, res, next) {
  if (!req.file) {
    return res.status(400).json({ error: "Uploaded file is required" });
  }
  next();
}

