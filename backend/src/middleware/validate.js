const REQUIRED_FIELDS = ["name", "category", "quantity", "unit", "price", "expiryDate", "supplier"];

function validateMedicine(req, res, next) {
  const body = req.body;
  const missing = REQUIRED_FIELDS.filter((f) => body[f] === undefined || body[f] === "");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      missing,
    });
  }

  if (isNaN(Number(body.quantity)) || Number(body.quantity) < 0) {
    return res.status(400).json({ error: "Quantity must be a non-negative number" });
  }

  if (isNaN(Number(body.price)) || Number(body.price) < 0) {
    return res.status(400).json({ error: "Price must be a non-negative number" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(body.expiryDate)) {
    return res.status(400).json({ error: "expiryDate must be in YYYY-MM-DD format" });
  }

  next();
}

module.exports = { validateMedicine };
