import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart] = useState(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      return Array.isArray(savedCart) ? savedCart : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  // Keep delivery charges consistent with the backend.
  const deliveryCharge = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + deliveryCharge;

  const formatPrice = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const placeOrder = async () => {
    if (loading) return;

    const requiredFields = [
      "fullName",
      "address",
      "city",
      "state",
      "pincode",
      "phone",
    ];

    const missingField = requiredFields.some(
      (field) => !String(form[field]).trim()
    );

    if (missingField) {
      setError("Please fill in all shipping details.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Pincode must contain exactly 6 digits.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty. Please add products first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please log in before placing your order.");
        setLoading(false);
        return;
      }

      // Get a Firebase ID token for backend authentication.
      const token = await currentUser.getIdToken();

      // Normalize cart IDs for the backend.
      const items = cart.map((item) => ({
        productId:
          item.productId ||
          (typeof item.product === "string"
            ? item.product
            : item.product?._id) ||
          item._id,
        quantity: Number(item.quantity || 1),
      }));

      if (
        items.some(
          (item) =>
            !item.productId ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1
        )
      ) {
        throw new Error(
          "A cart item has invalid product details. Please refresh your cart."
        );
      }

      const response = await axios.post(
        `${API_URL}/orders`,
        {
          items,
          shippingAddress: {
            fullName: form.fullName.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
            phone: form.phone.trim(),
          },
          paymentMethod: "Cash on Delivery",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.success || !response.data.order) {
        throw new Error(
          response.data.message || "Unable to place your order."
        );
      }

      // Save the confirmed server order for the account page.
      localStorage.setItem(
        "lastOrder",
        JSON.stringify(response.data.order)
      );

      localStorage.removeItem("cart");

      alert("Order placed successfully!");

      navigate("/account");
    } catch (err) {
      console.error(
        "Checkout error:",
        err.response?.data || err.message
      );

      if (err.response?.status === 401) {
        setError(
          "Your login session is invalid or expired. Please log in again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to place your order. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            Your cart is empty
          </h2>

          <p style={{ color: "#6b7280", marginTop: "10px" }}>
            Add some products before checking out.
          </p>

          <button
            onClick={() => navigate("/products")}
            style={{
              marginTop: "20px",
              padding: "13px 25px",
              background: "#111827",
              color: "white",
              border: "none",
              borderRadius: "9px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Shop Products
          </button>
        </div>
      </>
    );
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    marginBottom: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    fontWeight: 400,
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "1100px",
          margin: "auto",
          padding: "50px 5%",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: "30px",
          }}
        >
          Checkout
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* Shipping Details */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                marginBottom: "20px",
              }}
            >
              Shipping Details
            </h2>

            {[
              ["fullName", "Full Name"],
              ["address", "Full Address"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "6-digit Pincode"],
              ["phone", "10-digit Phone Number"],
            ].map(([name, placeholder]) => (
              <input
                key={name}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                style={inputStyle}
                autoComplete={
                  name === "fullName"
                    ? "name"
                    : name === "address"
                    ? "street-address"
                    : name === "city"
                    ? "address-level2"
                    : name === "state"
                    ? "address-level1"
                    : name === "pincode"
                    ? "postal-code"
                    : name === "phone"
                    ? "tel"
                    : "off"
                }
                inputMode={
                  name === "phone" || name === "pincode"
                    ? "numeric"
                    : "text"
                }
                maxLength={
                  name === "phone"
                    ? 10
                    : name === "pincode"
                    ? 6
                    : undefined
                }
              />
            ))}

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginTop: "10px",
              }}
            >
              Payment Method
            </h3>

            <div
              style={{
                marginTop: "10px",
                padding: "14px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              💵 Cash on Delivery
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#6b7280",
                  fontSize: "12px",
                }}
              >
                Pay when your order is delivered.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  marginTop: "18px",
                  padding: "12px",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  borderRadius: "8px",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              height: "fit-content",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                marginTop: "20px",
                fontSize: "14px",
              }}
            >
              {cart.map((item, index) => (
                <div
                  key={item.productId || item._id || index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "15px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>
                      {item.name || item.title || "Product"}
                    </div>
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      Qty: {Number(item.quantity || 1)}
                    </div>
                  </div>

                  <strong>
                    ₹
                    {formatPrice(
                      Number(item.price || 0) *
                        Number(item.quantity || 1)
                    )}
                  </strong>
                </div>
              ))}

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                  margin: "18px 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Subtotal</span>
                <strong>₹{formatPrice(subtotal)}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <span>Delivery</span>
                <strong>
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${formatPrice(deliveryCharge)}`}
                </strong>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                  margin: "18px 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontWeight: 700 }}>Total</span>

                <strong
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                  }}
                >
                  ₹{formatPrice(total)}
                </strong>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "14px",
                background: loading ? "#6b7280" : "#111827",
                color: "white",
                border: "none",
                borderRadius: "9px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <p
              style={{
                textAlign: "center",
                color: "#6b7280",
                fontSize: "12px",
                marginTop: "12px",
              }}
            >
              Secure checkout · Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
