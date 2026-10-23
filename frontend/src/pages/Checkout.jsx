import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    setCart(savedCart);

    if (savedCart.length === 0) {
      navigate("/products");
    }
  }, [navigate]);

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const deliveryCharge = subtotal >= 999 ? 0 : 49;
  const total = subtotal + deliveryCharge;

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "pincode" || name === "phone"
          ? value.replace(/\D/g, "")
          : value,
    }));

    setError("");
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");

    const {
      fullName,
      address,
      city,
      state,
      pincode,
      phone,
    } = formData;

    if (
      !fullName.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim() ||
      !phone.trim()
    ) {
      setError("Please fill in all delivery details.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Please log in to place your order.");
        navigate("/login");
        return;
      }

      const token = await currentUser.getIdToken();

      const shippingAddress = {
        fullName: fullName.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        phone: phone.trim(),
      };

      const response = await axios.post(
        `${API_URL}/orders`,
        {
          items: cart,
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedOrder =
        response.data.order || response.data;

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(savedOrder)
      );

      localStorage.removeItem("cart");

      setCart([]);

      alert("Order placed successfully! 🎉");

      navigate("/account");
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="checkout-container">
          {/* Page heading */}

          <header className="checkout-header">
            <div className="checkout-heading-icon">
              <span>🛍️</span>
            </div>

            <div>
              <p className="checkout-eyebrow">
                SHOPZONE CHECKOUT
              </p>

              <h1>Complete Your Order</h1>

              <p className="checkout-subtitle">
                Add your delivery details and review your order.
              </p>
            </div>
          </header>

          <div className="checkout-progress">
            <div className="checkout-step checkout-step-active">
              <span>1</span>
              <p>Delivery details</p>
            </div>

            <div className="checkout-progress-line" />

            <div className="checkout-step">
              <span>2</span>
              <p>Order confirmation</p>
            </div>
          </div>

          <form
            className="checkout-layout"
            onSubmit={handleCheckout}
          >
            {/* Delivery form */}

            <section className="checkout-card">
              <div className="checkout-card-heading">
                <div className="checkout-section-icon">
                  <span>📍</span>
                </div>

                <div>
                  <h2>Delivery Address</h2>
                  <p>
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              {error && (
                <div
                  className="checkout-error"
                  role="alert"
                >
                  <span>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              <div className="checkout-fields">
                <div className="checkout-field checkout-field-full">
                  <label htmlFor="fullName">
                    Full Name <span>*</span>
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="checkout-field checkout-field-full">
                  <label htmlFor="phone">
                    Phone Number <span>*</span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                  />

                  <small>
                    Enter your 10-digit mobile number.
                  </small>
                </div>

                <div className="checkout-field checkout-field-full">
                  <label htmlFor="address">
                    Street Address <span>*</span>
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    placeholder="House number, street, area"
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                    rows={3}
                    maxLength={500}
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="city">
                    City <span>*</span>
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="state">
                    State <span>*</span>
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="checkout-field checkout-field-full">
                  <label htmlFor="pincode">
                    PIN Code <span>*</span>
                  </label>

                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    placeholder="6-digit PIN code"
                    value={formData.pincode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>

              <div className="checkout-address-note">
                <span>🔒</span>
                <p>
                  Your delivery information will be used to
                  process your order.
                </p>
              </div>
            </section>

            {/* Order summary */}

            <aside className="checkout-summary">
              <div className="checkout-summary-heading">
                <div>
                  <h2>Order Summary</h2>
                  <p>
                    {cart.reduce(
                      (sum, item) =>
                        sum + Number(item.quantity || 1),
                      0
                    )}{" "}
                    item(s) in your cart
                  </p>
                </div>

                <span className="checkout-bag-icon">
                  🛒
                </span>
              </div>

              <div className="checkout-products">
                {cart.map((item) => (
                  <div
                    className="checkout-product"
                    key={item._id}
                  >
                    <div className="checkout-product-image">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    <div className="checkout-product-info">
                      <h3>{item.name}</h3>

                      {item.category && (
                        <p>{item.category}</p>
                      )}

                      <span>
                        Qty: {Number(item.quantity || 1)}
                      </span>
                    </div>

                    <strong>
                      {formatPrice(
                        Number(item.price || 0) *
                          Number(item.quantity || 1)
                      )}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="checkout-price-details">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <div>
                  <span>Delivery</span>

                  <strong
                    className={
                      deliveryCharge === 0
                        ? "checkout-free-delivery"
                        : ""
                    }
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : formatPrice(deliveryCharge)}
                  </strong>
                </div>

                {subtotal < 999 && (
                  <p className="checkout-delivery-hint">
                    Add {formatPrice(999 - subtotal)} more
                    for free delivery.
                  </p>
                )}

                <div className="checkout-total">
                  <span>Total Amount</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
              </div>

              <div className="checkout-payment">
                <div className="checkout-payment-icon">
                  <span>💵</span>
                </div>

                <div>
                  <h3>Cash on Delivery</h3>
                  <p>Pay when your order arrives.</p>
                </div>

                <span className="checkout-payment-check">
                  ✓
                </span>
              </div>

              <button
                className="checkout-submit"
                type="submit"
                disabled={loading || cart.length === 0}
              >
                {loading ? (
                  <>
                    <span className="checkout-spinner" />
                    Placing Your Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span>→</span>
                  </>
                )}
              </button>

              <button
                className="checkout-back-button"
                type="button"
                onClick={() => navigate("/products")}
                disabled={loading}
              >
                ← Continue Shopping
              </button>

              <div className="checkout-security">
                <span>🔐</span>
                Secure checkout
                <span className="checkout-security-dot">•</span>
                <span>✓</span>
                COD available
              </div>
            </aside>
          </form>

          <footer className="checkout-footer">
            <span>🛍️</span>
            <p>Thank you for shopping with ShopZone.</p>
          </footer>
        </div>
      </main>
    </>
  );
}

export default Checkout;






