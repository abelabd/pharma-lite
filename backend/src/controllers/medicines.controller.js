const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DB_PATH = path.join(__dirname, "../data/medicines.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const getAll = (req, res) => {
  try {
    const medicines = readDB();
    res.json(medicines);
  } catch {
    res.status(500).json({ error: "Failed to read inventory" });
  }
};

const create = (req, res) => {
  try {
    const { name, category, quantity, unit, price, expiryDate, supplier } =
      req.body;

    const medicines = readDB();
    const newEntry = {
      id: uuidv4(),
      name,
      category,
      quantity: Number(quantity),
      unit,
      price: Number(price),
      expiryDate,
      supplier,
    };

    medicines.push(newEntry);
    writeDB(medicines);

    res.status(201).json(newEntry);
  } catch {
    res.status(500).json({ error: "Failed to add medicine" });
  }
};

const update = (req, res) => {
  try {
    const { id } = req.params;
    const medicines = readDB();
    const index = medicines.findIndex((m) => m.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    medicines[index] = {
      ...medicines[index],
      ...req.body,
      id,
      quantity: Number(req.body.quantity ?? medicines[index].quantity),
      price: Number(req.body.price ?? medicines[index].price),
    };

    writeDB(medicines);
    res.json(medicines[index]);
  } catch {
    res.status(500).json({ error: "Failed to update medicine" });
  }
};

const remove = (req, res) => {
  try {
    const { id } = req.params;
    const medicines = readDB();
    const filtered = medicines.filter((m) => m.id !== id);

    if (filtered.length === medicines.length) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    writeDB(filtered);
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete medicine" });
  }
};

module.exports = { getAll, create, update, remove };
