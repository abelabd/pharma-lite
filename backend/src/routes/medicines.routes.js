const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicines.controller");
const { validateMedicine } = require("../middleware/validate");

router.get("/", controller.getAll);
router.post("/", validateMedicine, controller.create);
router.put("/:id", validateMedicine, controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
