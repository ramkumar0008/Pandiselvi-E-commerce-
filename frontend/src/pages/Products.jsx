import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_URL}/products`);

        setProducts(response.data);
        setError("");
      } catch (error) {
        setError("Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "50px 5%",
          fontFamily: "Poppins, Arial, sans-serif",
        }}
      >
        {/* Page Heading */}
        <div style={{ marginBottom: "35px" }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: "5px",
            }}
          >
            Our Products
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "15px",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Find the perfect products for you
          </p>
        </div>

        {/* Search and Filter */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "35px",
          }}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "13px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              outline: "none",
              fontSize: "14px",
              fontWeight: 400,
              fontFamily: "Poppins, Arial, sans-serif",
              background: "white",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "13px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "10px",
              background: "white",
              fontSize: "14px",
              fontWeight: 500,
              minWidth: "180px",
              fontFamily: "Poppins, Arial, sans-serif",
              outline: "none",
            }}
          >
            <option value="">All Categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <p
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            Loading products...
          </p>
        )}

        {/* Error */}
        {error && (
          <p
            style={{
              textAlign: "center",
              color: "#dc2626",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            {error}
          </p>
        )}

        {/* No Products */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                fontSize: "15px",
                fontWeight: 500,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              No products found.
            </p>
          )}

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
            alignItems: "stretch",
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* IMAGE CONTAINER */}
              <div
                style={{
                  width: "100%",
                  height: "240px",
                  background: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px",
                  overflow: "hidden",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Product";
                  }}
                />
              </div>

              {/* PRODUCT INFORMATION */}
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                {/* Featured */}
                {product.featured && (
                  <span
                    style={{
                      display: "inline-block",
                      color: "#2563eb",
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "5px",
                    }}
                  >
                    ⭐ Featured
                  </span>
                )}

                {/* Category */}
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "12px",
                    fontWeight: 500,
                    margin: "0 0 5px",
                  }}
                >
                  {product.category}
                </p>

                {/* Product Name */}
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    margin: "0 0 8px",
                    lineHeight: 1.4,
                    letterSpacing: "-0.2px",
                  }}
                >
                  {product.name}
                </h2>

                {/* Description */}
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    margin: "0 0 12px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.description}
                </p>

                {/* Price */}
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    margin: "auto 0 3px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  ₹{product.price}
                </p>

                {/* Stock */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    fontWeight: 500,
                    margin: "0",
                  }}
                >
                  Stock: {product.stock}
                </p>

                {/* View Product */}
                <Link
                  to={`/products/${product._id}`}
                  style={{
                    marginTop: "15px",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "9px",
                      background: "#111827",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily:
                        "Poppins, Arial, sans-serif",
                    }}
                  >
                    View Product
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;