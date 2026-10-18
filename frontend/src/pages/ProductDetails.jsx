import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [API_URL, id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(
      (item) => item._id === product._id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
    navigate("/cart");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p
          style={{
            textAlign: "center",
            marginTop: "60px",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          Loading product...
        </p>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <p
          style={{
            textAlign: "center",
            marginTop: "60px",
            color: "#dc2626",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {error}
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          padding: "60px 5%",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: "450px",
              background: "#f8fafc",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "25px",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x400?text=Product";
              }}
            />
          </div>

          <div>
            <p
              style={{
                color: "#2563eb",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {product.category}
            </p>

            <h1
              style={{
                fontSize: "42px",
                fontWeight: 800,
                letterSpacing: "-1px",
                margin: "8px 0",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
                lineHeight: 1.8,
                fontWeight: 400,
                margin: "18px 0",
              }}
            >
              {product.description}
            </p>

            <h2
              style={{
                fontSize: "32px",
                fontWeight: 800,
              }}
            >
              ₹{product.price}
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: 500,
                marginTop: "8px",
              }}
            >
              Available Stock: {product.stock}
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
                marginTop: "25px",
              }}
            >
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
                style={{
                  width: "90px",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              />

              <button
                onClick={addToCart}
                style={{
                  padding: "13px 25px",
                  background: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: "9px",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Add to Cart
              </button>
            </div>

            <button
              onClick={() => navigate("/products")}
              style={{
                marginTop: "20px",
                background: "transparent",
                border: "none",
                fontSize: "14px",
                fontWeight: 600,
                color: "#2563eb",
              }}
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;