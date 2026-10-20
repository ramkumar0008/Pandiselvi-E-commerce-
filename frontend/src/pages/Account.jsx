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

          // Existing authentication logic preserved.
          const token = await firebaseUser.getIdToken(true);

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

  // Existing logout functionality preserved.
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

  // Existing currency formatting preserved.
  const money = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        {/* Page Header */}
        <section style={styles.pageHeader}>
          <div style={styles.headerContent}>
            <span style={styles.eyebrow}>
              PANDISELVI SHOPPING
            </span>

            <h1 style={styles.pageTitle}>My Account</h1>

            <p style={styles.pageDescription}>
              Manage your profile and keep track of your latest order.
            </p>
          </div>

          <div style={styles.headerIcon}>👤</div>
        </section>

        <div style={styles.content}>
          {loading ? (
            <div style={styles.loadingCard}>
              <div style={styles.spinner} />
              <h3 style={styles.loadingTitle}>
                Loading your account
              </h3>
              <p style={styles.mutedText}>
                Please wait while we retrieve your information.
              </p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  style={styles.errorBox}
                >
                  <span style={styles.errorIcon}>!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Profile Section */}
              <section style={styles.profileCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.sectionIcon}>👤</div>
                  <div>
                    <h2 style={styles.cardHeading}>My Profile</h2>
                    <p style={styles.cardSubtitle}>
                      Your account information
                    </p>
                  </div>
                </div>

                {user ? (
                  <>
                    <div style={styles.profileBody}>
                      <div style={styles.avatar}>
                        {(user.name || user.email || "U")
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div style={styles.profileDetails}>
                        <span style={styles.fieldLabel}>
                          FULL NAME
                        </span>

                        <p style={styles.profileName}>
                          {user.name || "Not provided"}
                        </p>

                        <span style={styles.fieldLabel}>
                          EMAIL ADDRESS
                        </span>

                        <p style={styles.profileEmail}>
                          {user.email}
                        </p>
                      </div>

                      <span style={styles.verifiedBadge}>
                        ✓ Account
                      </span>
                    </div>

                    <div style={styles.profileActions}>
                      <button
                        type="button"
                        onClick={logout}
                        style={styles.logoutButton}
                      >
                        <span>↪</span> Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <p style={styles.mutedText}>
                    Your profile could not be loaded.
                  </p>
                )}
              </section>

              {/* Continue Shopping */}
              <button
                type="button"
                onClick={() => navigate("/products")}
                style={styles.shoppingButton}
              >
                <span>←</span> Continue Shopping
              </button>

              {/* Order History */}
              <section style={styles.orderCard}>
                <div style={styles.cardHeader}>
                  <div style={styles.sectionIcon}>📦</div>
                  <div>
                    <h2 style={styles.cardHeading}>
                      Order History
                    </h2>
                    <p style={styles.cardSubtitle}>
                      Details of your saved order
                    </p>
                  </div>
                </div>

                {!order ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🛍️</div>

                    <h3 style={styles.emptyTitle}>
                      No orders found
                    </h3>

                    <p style={styles.mutedText}>
                      Your order details will appear here when available.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/products")}
                      style={styles.emptyButton}
                    >
                      Browse Products →
                    </button>
                  </div>
                ) : (
                  <div style={styles.orderBody}>
                    {/* Order Information */}
                    <div style={styles.orderInfo}>
                      <div style={styles.orderInfoDetails}>
                        <span style={styles.fieldLabel}>
                          ORDER ID
                        </span>

                        <p style={styles.orderId}>
                          {order.id || order._id || "N/A"}
                        </p>

                        <p style={styles.orderDate}>
                          Date:{" "}
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleString("en-IN")
                            : "N/A"}
                        </p>
                      </div>

                      <span style={styles.statusBadge}>
                        <span style={styles.statusDot} />
                        {order.status || "Processing"}
                      </span>
                    </div>

                    {/* Payment Method */}
                    <div style={styles.paymentInfo}>
                      <span style={styles.paymentIcon}>💳</span>

                      <div>
                        <span style={styles.fieldLabel}>
                          PAYMENT METHOD
                        </span>

                        <p style={styles.paymentValue}>
                          {order.paymentMethod || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={styles.itemsSection}>
                      <h3 style={styles.itemsHeading}>
                        Ordered Products
                      </h3>

                      {(Array.isArray(order.items)
                        ? order.items
                        : []
                      ).map((item, index) => (
                        <div
                          key={
                            item._id ||
                            item.productId ||
                            index
                          }
                          style={styles.productRow}
                        >
                          <div style={styles.productImageBox}>
                            <img
                              src={
                                item.image ||
                                "https://placehold.co/70x70?text=Product"
                              }
                              alt={item.name || "Product"}
                              style={styles.productImage}
                            />
                          </div>

                          <div style={styles.productDetails}>
                            <h4 style={styles.productName}>
                              {item.name || "Product"}
                            </h4>

                            <p style={styles.productQuantity}>
                              Quantity: {item.quantity || 1}
                            </p>

                            <p style={styles.productPrice}>
                              ₹{money(item.price)}
                            </p>
                          </div>

                          <div style={styles.itemTag}>
                            Item {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div style={styles.summaryCard}>
                      <h3 style={styles.summaryHeading}>
                        Order Summary
                      </h3>

                      <div style={styles.summaryRow}>
                        <span>Subtotal</span>
                        <strong>
                          ₹{money(order.subtotal)}
                        </strong>
                      </div>

                      <div style={styles.summaryRow}>
                        <span>Delivery</span>
                        <strong style={styles.deliveryValue}>
                          {Number(order.deliveryCharge) === 0
                            ? "FREE"
                            : `₹${money(order.deliveryCharge)}`}
                        </strong>
                      </div>

                      <div style={styles.summaryDivider} />

                      <div style={styles.totalRow}>
                        <span>Total Amount</span>

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
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          © {new Date().getFullYear()} PandiSelvi E-Commerce.
          All rights reserved.
        </p>
        <span>Made with ❤️ for your shopping needs</span>
      </footer>
    </>
  );
}

const styles = {
  page: {
    minHeight: "80vh",
    background: "#f5f7ff",
    color: "#111827",
    fontFamily:
      "'Inter', 'Segoe UI', Arial, sans-serif",
    paddingBottom: "55px",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    padding: "45px max(5%, calc((100% - 1050px) / 2))",
    background:
      "linear-gradient(120deg, #eef2ff 0%, #ffffff 65%, #e0e7ff 100%)",
    borderBottom: "1px solid #e0e7ff",
  },

  headerContent: {
    flex: "1 1 280px",
  },

  eyebrow: {
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.8px",
  },

  pageTitle: {
    fontSize: "clamp(32px, 5vw, 44px)",
    fontWeight: 850,
    letterSpacing: "-1.5px",
    margin: "10px 0",
    lineHeight: 1.2,
  },

  pageDescription: {
    fontSize: "15px",
    lineHeight: 1.8,
    color: "#64748b",
    margin: 0,
  },

  headerIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "76px",
    height: "76px",
    borderRadius: "24px",
    background: "#ffffff",
    boxShadow: "0 10px 30px rgba(79,70,229,0.10)",
    fontSize: "35px",
  },

  content: {
    width: "90%",
    maxWidth: "1050px",
    margin: "35px auto 0",
  },

  loadingCard: {
    padding: "60px 20px",
    background: "#ffffff",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
  },

  spinner: {
    width: "34px",
    height: "34px",
    margin: "0 auto 20px",
    border: "4px solid #e0e7ff",
    borderTop: "4px solid #4f46e5",
    borderRadius: "50%",
  },

  loadingTitle: {
    fontSize: "18px",
    margin: "0 0 8px",
    fontWeight: 800,
  },

  mutedText: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.8,
    overflowWrap: "anywhere",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    padding: "16px 18px",
    borderRadius: "12px",
    marginBottom: "24px",
    fontSize: "14px",
    lineHeight: 1.6,
    overflowWrap: "anywhere",
  },

  errorIcon: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#ffe4e6",
    fontWeight: 900,
  },

  profileCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    border: "1px solid #e8eaf5",
    boxShadow: "0 8px 30px rgba(15,23,42,0.035)",
    marginBottom: "22px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    paddingBottom: "22px",
    borderBottom: "1px solid #edf0f7",
  },

  sectionIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    flexShrink: 0,
    borderRadius: "14px",
    background: "#eef2ff",
    fontSize: "22px",
  },

  cardHeading: {
    fontSize: "20px",
    fontWeight: 850,
    letterSpacing: "-0.4px",
    margin: "0 0 5px",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.6,
  },

  profileBody: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
    flexWrap: "wrap",
    padding: "28px 0",
  },

  avatar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "82px",
    height: "82px",
    flexShrink: 0,
    borderRadius: "25px",
    background: "linear-gradient(135deg, #4f46e5, #818cf8)",
    color: "#ffffff",
    fontSize: "34px",
    fontWeight: 850,
    boxShadow: "0 8px 20px rgba(79,70,229,0.18)",
  },

  profileDetails: {
    flex: "1 1 220px",
    minWidth: 0,
  },

  fieldLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.2px",
    marginBottom: "7px",
  },

  profileName: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#111827",
    margin: "0 0 18px",
    overflowWrap: "anywhere",
  },

  profileEmail: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#475569",
    margin: 0,
    overflowWrap: "anywhere",
  },

  verifiedBadge: {
    alignSelf: "flex-start",
    padding: "8px 12px",
    background: "#eef2ff",
    color: "#4338ca",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 800,
  },

  profileActions: {
    borderTop: "1px solid #edf0f7",
    paddingTop: "20px",
  },

  logoutButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    padding: "11px 18px",
    background: "#fff1f2",
    color: "#be123c",
    border: "1px solid #ffe4e6",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },

  shoppingButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 20px",
    background: "#4f46e5",
    color: "#ffffff",
    border: "none",
    borderRadius: "11px",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: "25px",
    boxShadow: "0 7px 18px rgba(79,70,229,0.17)",
  },

  orderCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    border: "1px solid #e8eaf5",
    boxShadow: "0 8px 30px rgba(15,23,42,0.035)",
  },

  orderBody: {
    paddingTop: "25px",
  },

  emptyState: {
    textAlign: "center",
    padding: "45px 10px 25px",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "15px",
  },

  emptyTitle: {
    fontSize: "20px",
    fontWeight: 850,
    margin: "0 0 8px",
  },

  emptyButton: {
    marginTop: "15px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "10px",
    background: "#4f46e5",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },

  orderInfo: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "18px",
    padding: "20px",
    background: "#f8faff",
    border: "1px solid #e8eaf5",
    borderRadius: "14px",
  },

  orderInfoDetails: {
    minWidth: 0,
    flex: "1 1 230px",
  },

  orderId: {
    color: "#312e81",
    fontSize: "15px",
    fontWeight: 800,
    margin: "0 0 8px",
    overflowWrap: "anywhere",
  },

  orderDate: {
    color: "#64748b",
    fontSize: "12px",
    lineHeight: 1.7,
    margin: 0,
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    alignSelf: "flex-start",
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 800,
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#16a34a",
  },

  paymentInfo: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "20px 0",
    borderBottom: "1px solid #edf0f7",
  },

  paymentIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    background: "#eef2ff",
    borderRadius: "12px",
    fontSize: "20px",
  },

  paymentValue: {
    color: "#111827",
    fontSize: "14px",
    fontWeight: 700,
    margin: 0,
  },

  itemsSection: {
    paddingTop: "25px",
  },

  itemsHeading: {
    fontSize: "16px",
    fontWeight: 850,
    margin: "0 0 8px",
  },

  productRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    padding: "20px 0",
    borderBottom: "1px solid #edf0f7",
  },

  productImageBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "82px",
    height: "82px",
    flexShrink: 0,
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "5px",
    boxSizing: "border-box",
  },

  productDetails: {
    flex: "1 1 150px",
    minWidth: 0,
  },

  productName: {
    color: "#111827",
    fontSize: "15px",
    fontWeight: 800,
    lineHeight: 1.5,
    margin: "0 0 7px",
    overflowWrap: "anywhere",
  },

  productQuantity: {
    color: "#64748b",
    fontSize: "12px",
    margin: "0 0 8px",
  },

  productPrice: {
    color: "#4338ca",
    fontSize: "15px",
    fontWeight: 850,
    margin: 0,
  },

  itemTag: {
    alignSelf: "flex-start",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "6px 9px",
    borderRadius: "7px",
    fontSize: "10px",
    fontWeight: 700,
  },

  summaryCard: {
    maxWidth: "420px",
    marginLeft: "auto",
    marginTop: "25px",
    padding: "22px",
    background: "#f8faff",
    border: "1px solid #e8eaf5",
    borderRadius: "15px",
  },

  summaryHeading: {
    color: "#111827",
    fontSize: "16px",
    fontWeight: 850,
    margin: "0 0 20px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginTop: "13px",
    fontSize: "13px",
    color: "#64748b",
  },

  deliveryValue: {
    color: "#15803d",
  },

  summaryDivider: {
    height: "1px",
    background: "#e2e8f0",
    margin: "20px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    fontSize: "15px",
    fontWeight: 800,
    color: "#111827",
  },

  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "10px",
    padding: "22px 5%",
    background: "#030712",
    color: "#9ca3af",
    fontSize: "12px",
    lineHeight: 1.7,
  },
};

export default Account;
