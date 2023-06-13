const { isValidObjectId } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Dictionary = require("../models/dictionary");
const { response } = require("express");
function isCharLette(char) {
  return char.toLowerCase() !== char.toUpperCase();
}

exports.createNewDict = async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) {
      return res.status(404).send({ message: "Not Found a value term" });
    }
    const dict = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });
    if (dict) {
      return res.status(400).send({ message: "Dictionary already exists" });
    }

    const newTerm = new Dictionary({
      term: term,
      letter: term[0],
    });

    await newTerm.save();
    res.status(200).send({ message: "Success!" });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllDict = async (req, res) => {
  try {
    const dict = await Dictionary.find({});
    if (!dict.length) {
      return res.status(404).send({ message: "No dictionary found " });
    }

    res.status(200).json({ Dictionaries: dict });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getDictById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(404).send({ message: "Invalid  dictionary id " });
    }

    const dict = await Dictionary.find({ _id: req.params.id });
    if (!dict) {
      return res.status(404).send({ message: "No dictionary found " });
    }

    res.status(200).json({ Dictionary: dict });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getDictByLetter = async (req, res) => {
  try {
    if (!isCharLetter(req.params.letter)) {
      return res.status(400).send({ message: "Invalid letter " });
    }

    const result = await Dictionary.findOne({
      letter: req.params.letter.toUpperCase(),
    });

    if (!result) {
      return res.status(404).send({ message: "No dictionary found " });
    }
    res.status(200).send({ dictionary: result });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getDictByTerm = async (req, res) => {
  try {
    const term = req.params.term;
    const result = await Dictionary.findOne({
      term: { $regex: term, $options: "i" },
    });

    if (!result) {
      return res.status(404).send({ message: "No dictionary found " });
    }
    res.status(200).send({ dictionary: result });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateDict = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400).send({ message: "Invalid Object ID" });
    }
    const { term } = req.body;
    const result = await Dictionary.updateOne(
      { _id: req.params.id },
      { term: term, letter: term[0] }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "Already updated" });
    } else if (result.matchedCount === 0) {
      return res.status(404).send({ message: " No matches found" });
    }
    res.status(200).send({ message: "Updated Succesfully " });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteDict = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).send({ message: "Invalid Object ID" });
    }
    const result = await Dictionary.deleteOne({ _id: req.params.id });
    console.log(result);
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Not Found" });
    }

    res.status(200).send({ message: "Successfully deleted" });
  } catch (error) {
    errorHandler(res, error);
  }
};
