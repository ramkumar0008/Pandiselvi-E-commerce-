import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import Navbar from "../components/Navbar";
import { auth } from "../firebase";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pandiselvi-e-commerce.onrender.com/api";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!firebaseUser) {
          localStorage.removeItem("user");

          if (active) {
            setUser(null);
            setLoading(false);
            navigate("/login", { replace: true });
          }
          return;
        }

        try {
          if (active) {
            setLoading(true);
            setError("");
          }

          // Get a fresh Firebase ID token.
          const token = await firebaseUser.getIdToken(true);

          // Call the protected backend profile endpoint.
          const response = await axios.get(
            `${API_URL}/auth/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!active) return;

          if (response.data.success) {
            setUser(response.data.user);

            localStorage.setItem(
              "user",
              JSON.stringify(response.data.user)
            );
          } else {
            setError("Unable to load your profile.");
          }

          const savedOrder = JSON.parse(
            localStorage.getItem("lastOrder") || "null"
          );

          setOrder(savedOrder);
        } catch (err) {
          console.error(
            "Account loading error:",
            err.response?.data || err.message
          );

          if (active) {
            setError(
              err.response?.data?.message ||
                "Unable to load your account. Please log in again if needed."
            );
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      setError("Unable to log out. Please try again.");
    }
  };

  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: "1050px",
          margin: "auto",
          padding: "50px 5%",
          minHeight: "75vh",
          background: "#f8fafc",
        }}
      >
        <h1
          style={{
            fontSize: "38px",
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: "30px",
            color: "#111827",
          }}
        >
          My Account
        </h1>

        {loading ? (
          <p>Loading your account...</p>
        ) : (
          <>
            {error && (
              <div
                role="alert"
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  padding: "14px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                {error}
              </div>
            )}

            <section style={cardStyle}>
              <h2 style={headingStyle}>Profile</h2>

              {user ? (
                <>
                  <p style={{ marginTop: "15px", fontWeight: 500 }}>
                    Name: {user.name || "Not provided"}
                  </p>

                  <p
                    style={{
                      marginTop: "5px",
                      fontSize: "14px",
                      color: "#6b7280",
                      overflowWrap: "anywhere",
                    }}
                  >
                    Email: {user.email}
                  </p>

                  <button onClick={logout} style={logoutStyle}>
                    Logout
                  </button>
                </>
              ) : (
                <p style={{ color: "#6b7280", marginTop: "10px" }}>
                  Your profile could not be loaded.
                </p>
              )}
            </section>

            <button
              onClick={() => navigate("/products")}
              style={shoppingStyle}
            >
              Continue Shopping
            </button>

            <section style={cardStyle}>
              <h2 style={headingStyle}>Order History</h2>

              {!order ? (
                <p
                  style={{
                    color: "#6b7280",
                    marginTop: "15px",
                    fontSize: "14px",
                  }}
                >
                  No orders found.
                </p>
              ) : (
                <div style={{ marginTop: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600 }}>
                        Order ID: {order.id || order._id || "N/A"}
                      </p>

                      <p style={{ fontSize: "13px", color: "#6b7280" }}>
                        Date:{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString("en-IN")
                          : "N/A"}
                      </p>
                    </div>

                    <span
                      style={{
                        alignSelf: "flex-start",
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>

                  <p style={{ marginTop: "15px", fontSize: "14px" }}>
                    Payment: {order.paymentMethod || "N/A"}
                  </p>

                  {(Array.isArray(order.items) ? order.items : []).map(
                    (item, index) => (
                      <div
                        key={item._id || item.productId || index}
                        style={{
                          display: "flex",
                          gap: "15px",
                          alignItems: "center",
                          marginTop: "20px",
                          paddingBottom: "15px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <img
                          src={
                            item.image ||
                            "https://placehold.co/70x70?text=Product"
                          }
                          alt={item.name || "Product"}
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "contain",
                            background: "#f8fafc",
                            borderRadius: "8px",
                          }}
                        />

                        <div>
                          <h3 style={{ fontSize: "15px", fontWeight: 700 }}>
                            {item.name || "Product"}
                          </h3>

                          <p style={{ fontSize: "13px", color: "#6b7280" }}>
                            Quantity: {item.quantity || 1}
                          </p>

                          <p style={{ fontSize: "14px", fontWeight: 600 }}>
                            ₹{money(item.price)}
                          </p>
                        </div>
                      </div>
                    )
                  )}

                  <div
                    style={{
                      maxWidth: "350px",
                      marginLeft: "auto",
                      marginTop: "20px",
                    }}
                  >
                    <div style={summaryRow}>
                      <span>Subtotal</span>
                      <strong>₹{money(order.subtotal)}</strong>
                    </div>

                    <div style={summaryRow}>
                      <span>Delivery</span>
                      <strong>
                        {Number(order.deliveryCharge) === 0
                          ? "FREE"
                          : `₹${money(order.deliveryCharge)}`}
                      </strong>
                    </div>

                    <div
                      style={{
                        ...summaryRow,
                        marginTop: "15px",
                        fontSize: "18px",
                      }}
                    >
                      <span>Total</span>
                      <strong>
                        ₹
                        {money(
                          order.totalAmount ??
                            Number(order.subtotal || 0) +
                              Number(order.deliveryCharge || 0)
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  marginBottom: "25px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
};

const headingStyle = {
  fontSize: "22px",
  fontWeight: 800,
};

const logoutStyle = {
  marginTop: "20px",
  padding: "11px 20px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

const shoppingStyle = {
  padding: "12px 22px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "25px",
  cursor: "pointer",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  marginTop: "8px",
};

export default Account;
