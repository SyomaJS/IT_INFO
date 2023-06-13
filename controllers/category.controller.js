const { isValidObjectId } = require("mongoose");
const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/category");

exports.addCategory = async (req, res) => {
  try {
    const { category_name, parent_category_id } = req.body;
    if (!parent_category_id) {
      if (isValidObjectId(parent_category_id)) {
        return res.status(400).send({ message: "Invalid category id..." });
      }
    }

    const category = await Category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (category) {
      return res.status(400).send({ message: "Category already exists" });
    }

    const result = await new Category({
      category_name,
      parent_category_id,
    });

    if (!result) {
      return res
        .status(400)
        .send({ message: "Wrong category name or parent category id" });
    }

    await result.save();
    res.status(200).send({ message: "Created successfully" });
  } catch (err) {
    errorHandler(res, err);
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid category id" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    res.status(200).json({ category });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ categories });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, parent_category_id } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid category id" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    category.category_name = category_name;
    category.parent_category_id = parent_category_id;

    const updatedCategory = await category.save();
    res.status(200).json({ category: updatedCategory });
  } catch (error) {
    errorHandler(res, error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Invalid category id" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }

    await category.remove();
    res.status(200).send({ message: "Category deleted successfully" });
  } catch (error) {
    errorHandler(res, error);
  }
};
