const { Router } = require("express");
const router = Router();

router.use("/api/dictionary", require("./dict.router"));
router.use("/api/category", require("./category.router"));
router.use("/api/description", require("./description.router"));
router.use("/api/synonym", require("./synonym.router"));

module.exports = router;
