const { Router } = require("express");
const router = Router();

const descriptionController = require("../controllers/description.controller");

router.post("/", descriptionController.addDescription);
router.get("/:id", descriptionController.getDescriptionById);
router.get("/", descriptionController.getAllDescriptions);
router.put("/:id", descriptionController.updateDescription);
router.delete("/:id", descriptionController.deleteDescription);

module.exports = router;
