const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product");

dotenv.config();

const products = [
    // 1
    {
        name: "Wireless Headphones",
        description:
            "Premium wireless headphones with clear sound, deep bass and comfortable ear cushions.",
        price: 2499,
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        category: "Electronics",
        stock: 25,
        featured: true,
    },

    // 2
    {
        name: "Smart Watch",
        description:
            "Modern smartwatch with fitness tracking, notifications and stylish design.",
        price: 3499,
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        category: "Electronics",
        stock: 18,
        featured: true,
    },

    // 3
    {
        name: "Running Shoes",
        description:
            "Lightweight running shoes designed for everyday comfort and active lifestyles.",
        price: 1999,
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "Fashion",
        stock: 30,
        featured: true,
    },

    // 4
    {
        name: "Leather Backpack",
        description:
            "Premium casual backpack suitable for college, office and travel.",
        price: 1599,
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
        category: "Bags",
        stock: 15,
        featured: false,
    },

    // 5
    {
        name: "Classic Sunglasses",
        description:
            "Stylish sunglasses with a modern frame suitable for everyday use.",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        category: "Fashion",
        stock: 40,
        featured: true,
    },

    // 6
    {
        name: "Coffee Maker",
        description:
            "Compact coffee maker for preparing delicious coffee at home or office.",
        price: 2999,
        image:
            "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
        category: "Home",
        stock: 12,
        featured: false,
    },

    // 7
    {
        name: "Mechanical Keyboard",
        description:
            "RGB mechanical keyboard with responsive keys, perfect for gaming and coding.",
        price: 2799,
        image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
        category: "Electronics",
        stock: 20,
        featured: true,
    },

    // 8
    {
        name: "Travel Water Bottle",
        description:
            "Reusable stainless steel water bottle that keeps drinks cool for hours.",
        price: 799,
        image:
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
        category: "Lifestyle",
        stock: 50,
        featured: false,
    },

    // 9
    {
        name: "Laptop",
        description:
            "Powerful laptop suitable for coding, office work, entertainment and everyday use.",
        price: 54999,
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        category: "Electronics",
        stock: 10,
        featured: true,
    },

    // 10
    {
        name: "Smartphone",
        description:
            "Modern smartphone with a high-quality display, powerful processor and excellent camera.",
        price: 24999,
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        category: "Electronics",
        stock: 20,
        featured: true,
    },

    // 11
    {
        name: "Casual T-Shirt",
        description:
            "Comfortable cotton casual T-shirt suitable for everyday wear.",
        price: 699,
        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        category: "Fashion",
        stock: 45,
        featured: false,
    },

    // 12
    {
        name: "Denim Jacket",
        description:
            "Classic denim jacket with a stylish design for casual outings.",
        price: 1899,
        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        category: "Fashion",
        stock: 22,
        featured: true,
    },

    // 13
    {
        name: "Sports Backpack",
        description:
            "Spacious and durable backpack designed for sports, travel and daily activities.",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3",
        category: "Bags",
        stock: 28,
        featured: false,
    },

    // 14
    {
        name: "Table Lamp",
        description:
            "Modern LED table lamp perfect for study rooms, bedrooms and office desks.",
        price: 899,
        image:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
        category: "Home",
        stock: 35,
        featured: false,
    },

    // 15
    {
        name: "Bluetooth Speaker",
        description:
            "Portable Bluetooth speaker with powerful sound and long-lasting battery.",
        price: 1799,
        image:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
        category: "Electronics",
        stock: 25,
        featured: true,
    },

    //16

    {
        name: "Bluetooth Speaker",
        description:
            "Portable Bluetooth speaker with powerful sound and long-lasting battery.",
        price: 1799,
        image:
            "https://images.unsplash.com/photo-1568395216634-ab1b1e848751?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Lifestyle",
        stock: 15,
        featured: true,
    },
    {
        name: "Bat",
        description:
            "Portable Bluetooth speaker with powerful sound and long-lasting battery.",
        price: 2199,
        image:
            "https://images.unsplash.com/photo-1630851278830-c0c9b12933ee?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Sports",
        stock: 15,
        featured: true,
    },
    {
        name: "Football",
        description:
            "Portable Bluetooth speaker with powerful sound and long-lasting battery.",
        price: 1099,
        image:
            "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Sports",
        stock: 15,
        featured: true,
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Product.deleteMany({});

        await Product.insertMany(products);

        console.log("15 products added successfully");

        await mongoose.connection.close();

        console.log("Database connection closed");

        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

seedProducts();