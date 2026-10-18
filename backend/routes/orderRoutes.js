
const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");

const router = express.Router();

// POST /api/orders
// Place a new Cash on Delivery order
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUser.uid;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found. Please log in again.",
      });
    }

    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const requiredFields = [
      "fullName",
      "address",
      "city",
      "state",
      "pincode",
      "phone",
    ];

    if (
      !shippingAddress ||
      requiredFields.some(
        (field) => !String(shippingAddress[field] || "").trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all shipping address details.",
      });
    }

    if (
      paymentMethod &&
      paymentMethod !== "Cash on Delivery"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only Cash on Delivery is currently supported.",
      });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const productId = item.productId || item.product || item._id;
      const quantity = Number(item.quantity);

      if (
        !mongoose.isValidObjectId(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity in your cart.",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "A product in your cart was not found.",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image || "",
      });

      subtotal += product.price * quantity;
    }

    const deliveryCharge = subtotal >= 1000 ? 0 : 50;
    const totalAmount = subtotal + deliveryCharge;

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: "Cash on Delivery",
      subtotal,
      deliveryCharge,
      totalAmount,
      status: "Placed",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to place order. Please try again.",
    });
  }
});

// GET /api/orders/my-orders
// Get the logged-in user's order history
router.get("/my-orders", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load order history.",
    });
  }
});

module.exports = router;
