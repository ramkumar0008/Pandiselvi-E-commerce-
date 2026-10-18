
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const requireAdmin = require("../middleware/requireAdmin");

// GET /api/admin/test
router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Admin routes are working!",
  });
});

// GET /api/admin/dashboard
router.get(
  "/dashboard",
  verifyFirebaseToken,
  requireAdmin,
  async (req, res) => {
    try {
      const [
        totalUsers,
        totalProducts,
        totalOrders,
        orderRevenue,
        pendingOrders,
      ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          {
            $match: {
              status: { $ne: "Cancelled" },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" },
            },
          },
        ]),
        Order.countDocuments({
          status: { $in: ["Placed", "Confirmed"] },
        }),
      ]);

      return res.json({
        success: true,
        message: "Admin dashboard loaded successfully",
        admin: {
          name: req.adminUser.name,
          email: req.adminUser.email,
        },
        stats: {
          totalUsers,
          totalProducts,
          totalOrders,
          pendingOrders,
          totalOrderValue: orderRevenue[0]?.total || 0,
        },
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to load admin dashboard",
      });
    }
  }
);

// GET /api/admin/users
router.get(
  "/users",
  verifyFirebaseToken,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-__v")
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        totalUsers: users.length,
        users,
      });
    } catch (error) {
      console.error("Fetch admin users error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch users",
      });
    }
  }
);

// GET /api/admin/orders
router.get(
  "/orders",
  verifyFirebaseToken,
  requireAdmin,
  async (req, res) => {
    try {
      // Fetch orders, newest first.
      // Populate only if the Order schema references these models.
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .lean();

      // Attach customer details using the Order.user reference.
      const userIds = [
        ...new Set(
          orders
            .map((order) => order.user)
            .filter(Boolean)
            .map((id) => String(id))
        ),
      ];

      const customers = userIds.length
        ? await User.find({ _id: { $in: userIds } })
            .select("name email")
            .lean()
        : [];

      const customerMap = new Map(
        customers.map((customer) => [
          String(customer._id),
          {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
          },
        ])
      );

      const result = orders.map((order) => ({
        ...order,
        user:
          order.user && customerMap.get(String(order.user))
            ? customerMap.get(String(order.user))
            : order.user,
      }));

      return res.status(200).json({
        success: true,
        totalOrders: result.length,
        orders: result,
      });
    } catch (error) {
      console.error("Fetch admin orders error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch orders",
      });
    }
  }
);

module.exports = router;
