export function validate(schema) {
  return (req, res, next) => {
    const result = schema(req.body);
    if (!result.valid) {
      return res.status(400).json({ error: result.message });
    }
    next();
  };
}

