const express = require("express");
const Product = require("../models/Product");

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// GET: All products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
});

// GET: Single product (public)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
});

// POST: Add product (admin only)
router.post("/", verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT: Update product (admin only)
router.put("/:id", verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE: Delete product (admin only)
router.delete("/:id", verifyFirebaseToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to delete product. Check the product ID.",
    });
  }
});

module.exports = router;