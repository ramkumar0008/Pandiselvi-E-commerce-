import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Number(quantity) }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryCharge = subtotal >= 999 ? 0 : 49;

  const total = subtotal + deliveryCharge;

  const totalItems = cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "1150px",
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
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "60px 20px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "50px" }}>🛒</div>

            <h2
              style={{
                fontSize: "24px",
                fontWeight: 700,
                marginTop: "10px",
              }}
            >
              Your cart is empty
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Add some products to continue shopping.
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
              }}
            >
              Shop Products
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr) 330px",
              gap: "25px",
            }}
          >
            <div>
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "15px",
                    marginBottom: "15px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "110px",
                      height: "110px",
                      objectFit: "contain",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      padding: "8px",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {item.category}
                    </p>

                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        marginTop: "5px",
                      }}
                    >
                      ₹{item.price}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCart(
                        item._id,
                        e.target.value
                      )
                    }
                    style={{
                      width: "75px",
                      padding: "10px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  />

                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: 700,
                    }}
                  >
                    ₹
                    {Number(item.price) *
                      Number(item.quantity)}
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    style={{
                      border: "none",
                      background: "#fee2e2",
                      color: "#dc2626",
                      padding: "9px 12px",
                      borderRadius: "7px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                height: "fit-content",
              }}
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  marginBottom: "20px",
                }}
              >
                Order Summary
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Items: {totalItems}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                  fontSize: "14px",
                }}
              >
                <span>Subtotal</span>
                <strong>₹{subtotal}</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "12px",
                  fontSize: "14px",
                }}
              >
                <span>Delivery</span>
                <strong>
                  {deliveryCharge === 0
                    ? "FREE"
                    : `₹${deliveryCharge}`}
                </strong>
              </div>

              <hr
                style={{
                  margin: "20px 0",
                  border: "none",
                  borderTop: "1px solid #e5e7eb",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  Total
                </span>

                <strong
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                  }}
                >
                  ₹{total}
                </strong>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  marginTop: "22px",
                  padding: "13px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#111827",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;