const { isValidObjectId } = require("mongoose");
const Description = require("../models/description");
const { errorHandler } = require("../helpers/error_handler");

exports.addDescription = async (req, res) => {
  try {
    const { category_id, description } = req.body;
    if (category_id) {
      if (!isValidObjectId(category_id)) {
        return res.status(400).send({ message: "Invalid description id" });
      }
    }

    const result = await new Description({
      category_id: category_id,
      description: description,
    });

    await result.save();

    res.status(200).send({ message: "Successfully created description " });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllDescriptions = async (req, res) => {
  try {
    const result = await Description.find({}).populate("category_id", "-_id");
    if (!result.length) {
      return res.status(404).send({ message: "No description available" });
    }

    res.status(200).json({ description: result });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid description id" });
    }

    const description = await Description.findById(id).populate("category_id");

    if (!description) {
      return res.status(404).send({ message: "Description not found" });
    }

    res.status(200).json({ description });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.createDescription = async (req, res) => {
  try {
    const { description, category_id } = req.body;

    const newDescription = new Description({
      description,
      category_id,
    });

    await newDescription.save();
    res.status(200).send({ message: "Description created successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category_id } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid description id" });
    }

    const existingDescription = await Description.findById(id);
    if (!existingDescription) {
      return res.status(404).send({ message: "Description not found" });
    }

    existingDescription.description = description;
    existingDescription.category_id = category_id;

    const updatedDescription = await existingDescription.save();
    res.status(200).json({ description: updatedDescription });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteDescription = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid description id" });
    }

    const description = await Description.findById(id);
    if (!description) {
      return res.status(404).send({ message: "Description not found" });
    }

    await description.remove();
    res.status(200).send({ message: "Description deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
