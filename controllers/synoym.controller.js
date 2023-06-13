const { isValidObjectId } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Synonym = require("../models/synonym");

exports.addnewSynonym = async (req, res) => {
  try {
    const { dest_id, dict_id } = req.body;
    if (
      !dict_id ||
      (!dict_id && !isValidObjectId(dest_id) && !isValidObjectId(dict_id))
    ) {
      return res.status(400).json({ message: "Wrong input id or dict_id" });
    }

    const result = await new Synonym({
      dict_id,
      dest_id,
    });

    await result.save();
    res.status(200).json({ message: "Successfully created", id: result._id });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getSynonymById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid synonym id" });
    }

    const synonym = await Synonym.findById(id)
      .populate("dict_id", "-_id")
      .populate("dest_id", "-_id");
    if (!synonym) {
      return res.status(404).send({ message: "Synonym not found" });
    }

    res.status(200).json({ synonym });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllSynonyms = async (req, res) => {
  try {
    const synonyms = await Synonym.find({})
      .populate({
        path: "dest_id",
        populate: { path: "category_id", select: "-_id" },
      })
      .populate("dict_id", "-_id");
    if (!synonyms.length) {
      return res.status(404).json({ error: "Synonym not found" });
    }

    res.status(200).json({ synonyms });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateSynonym = async (req, res) => {
  try {
    const { id } = req.params;
    const { dict_id, dest_id } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid synonym id" });
    }

    const existingSynonym = await Synonym.findById(id);
    if (!existingSynonym) {
      return res.status(404).send({ message: "Synonym not found" });
    }

    existingSynonym.dict_id = dict_id;
    existingSynonym.dest_id = dest_id;

    const updatedSynonym = await existingSynonym.save();
    res.status(200).json({ synonym: updatedSynonym });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteSynonym = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid synonym id" });
    }

    const synonym = await Synonym.findById(id);
    if (!synonym) {
      return res.status(404).send({ message: "Synonym not found" });
    }

    await synonym.remove();
    res.status(200).send({ message: "Synonym deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
