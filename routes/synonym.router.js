const { Router } = require("express");
const router = Router();

const synonymController = require("../controllers/synoym.controller");

router.post("/", synonymController.addnewSynonym);
router.get("/", synonymController.getAllSynonyms);
router.get("/:id", synonymController.getSynonymById);
router.put("/:id", synonymController.updateSynonym);
router.delete("/:id", synonymController.deleteSynonym);

module.exports = router;
