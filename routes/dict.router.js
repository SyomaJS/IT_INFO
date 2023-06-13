const { Router } = require("express");
const router = Router();

const dictController = require("../controllers/dict.controller");

router.post("/", dictController.createNewDict);
router.get("/", dictController.getAllDict);
router.get("/:id", dictController.getDictById);
router.get("/letter/:letter", dictController.getDictByLetter);
router.get("/term/:term", dictController.getDictByTerm);
router.put("/:id", dictController.updateDict);
router.delete("/:id", dictController.deleteDict);

module.exports = router;
