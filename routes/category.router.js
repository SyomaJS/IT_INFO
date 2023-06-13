const { Router } = require("express");
const router = Router();

const categoryController = require("../controllers/category.controller");

router.post("/", categoryController.addCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
