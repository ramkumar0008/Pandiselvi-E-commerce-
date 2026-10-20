import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (!cancelled) {
          setError("Please log in with your admin account.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = await user.getIdToken();

        const response = await axios.get(
          `${API_URL}/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setOrders(
            Array.isArray(response.data.orders)
              ? response.data.orders
              : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load orders. Please check the backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const filteredOrders = orders.filter((order) => {
    const customerName =
      typeof order.user === "object"
        ? order.user?.name || ""
        : "";

    const customerEmail =
      typeof order.user === "object"
        ? order.user?.email || ""
        : "";

    const orderId = String(order._id || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch =
      orderId.includes(query) ||
      customerName.toLowerCase().includes(query) ||
      customerEmail.toLowerCase().includes(query) ||
      (order.items || []).some((item) =>
        String(
          item.name ||
          item.productName ||
          item.product?.name ||
          ""
        )
          .toLowerCase()
          .includes(query)
      );

    const matchesFilter =
      filter === "All" ||
      (order.status || "Placed") === filter;

    return matchesSearch && matchesFilter;
  });

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return styles.delivered;
      case "Shipped":
        return styles.shipped;
      case "Confirmed":
        return styles.confirmed;
      case "Cancelled":
        return styles.cancelled;
      default:
        return styles.placed;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .admin-orders-page,
        .admin-orders-page * {
          box-sizing: border-box;
        }

        .admin-orders-page button,
        .admin-orders-page input,
        .admin-orders-page select {
          font: inherit;
        }

        .admin-orders-page .admin-refresh-button {
          transition: background 0.2s ease, transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .admin-orders-page .admin-refresh-button:hover {
          background: #4338ca !important;
          box-shadow: 0 6px 16px rgba(79, 70, 229, 0.22);
        }

        .admin-orders-page .admin-refresh-button:active {
          transform: scale(0.98);
        }

        .admin-orders-page .admin-search:focus {
          outline: none;
        }

        .admin-orders-page .admin-search-wrapper:focus-within {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.09);
        }

        .admin-orders-page .admin-filter:focus {
          outline: none;
          border-color: #818cf8 !important;
        }

        .admin-orders-page .admin-table tbody tr {
          transition: background 0.18s ease;
        }

        .admin-orders-page .admin-table tbody tr:hover {
          background: #fafbff;
        }

        .admin-orders-page .admin-table tbody tr:last-child td {
          border-bottom: none;
        }

        @keyframes adminOrdersSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .admin-orders-page .admin-spinner {
          animation: adminOrdersSpin 0.8s linear infinite;
        }

        @media (max-width: 640px) {
          .admin-orders-page {
            padding: 24px 14px !important;
          }

          .admin-orders-page .admin-panel-header {
            padding: 20px 17px !important;
          }

          .admin-orders-page .admin-toolbar {
            padding: 16px !important;
          }

          .admin-orders-page .admin-footer-row {
            padding: 15px 17px !important;
          }

          .admin-orders-page .admin-filter-wrapper {
            width: 100%;
          }

          .admin-orders-page .admin-filter {
            flex: 1;
            min-width: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-orders-page *,
          .admin-orders-page *::before,
          .admin-orders-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Navbar />

      <main className="admin-orders-page" style={styles.page}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              <span style={styles.brandDot} />
              PANDISELVI
              <span style={styles.eyebrowDivider}>/</span>
              ADMINISTRATION
            </p>

            <h1 style={styles.title}>Order Management</h1>

            <p style={styles.subtitle}>
              Manage customer purchases, monitor deliveries, and keep
              track of your store's order activity.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            style={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            <span style={styles.refreshIcon}>↻</span>
            Refresh Orders
          </button>
        </header>

        <section style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.statIconBox}>▣</div>
              <span style={styles.statCaption}>ALL ORDERS</span>
            </div>

            <p style={styles.statLabel}>Total Orders</p>
            <h2 style={styles.statValue}>{orders.length}</h2>

            <p style={styles.statDescription}>
              All customer purchases
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.pendingIconBox}>◷</div>
              <span style={styles.statCaption}>IN PROGRESS</span>
            </div>

            <p style={styles.statLabel}>Pending Orders</p>

            <h2 style={styles.statValue}>
              {
                orders.filter((order) =>
                  ["Placed", "Confirmed"].includes(order.status)
                ).length
              }
            </h2>

            <p style={styles.statDescription}>
              Awaiting completion
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.deliveredIconBox}>✓</div>
              <span style={styles.statCaption}>COMPLETED</span>
            </div>

            <p style={styles.statLabel}>Delivered Orders</p>

            <h2 style={styles.statValue}>
              {
                orders.filter(
                  (order) => order.status === "Delivered"
                ).length
              }
            </h2>

            <p style={styles.statDescription}>
              Successfully delivered
            </p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <div style={styles.revenueIconBox}>₹</div>
              <span style={styles.statCaption}>ORDER VALUE</span>
            </div>

            <p style={styles.statLabel}>Total Revenue</p>

            <h2 style={styles.revenueValue}>
              {money(totalRevenue)}
            </h2>

            <p style={styles.statDescription}>
              Excluding cancelled orders
            </p>
          </div>
        </section>

        <section style={styles.panel}>
          <div
            className="admin-panel-header"
            style={styles.panelHeader}
          >
            <div>
              <h2 style={styles.panelTitle}>Customer Orders</h2>

              <p style={styles.panelSubtitle}>
                Customer information, product details, payments, and
                order status.
              </p>
            </div>

            <div style={styles.orderCount}>
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "ORDER" : "ORDERS"}
            </div>
          </div>

          <div
            className="admin-toolbar"
            style={styles.toolbar}
          >
            <div
              className="admin-search-wrapper"
              style={styles.searchWrapper}
            >
              <span style={styles.searchIcon}>⌕</span>

              <input
                type="search"
                className="admin-search"
                placeholder="Search order ID, customer, email, or product..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={styles.search}
              />
            </div>

            <div
              className="admin-filter-wrapper"
              style={styles.filterWrapper}
            >
              <label style={styles.filterLabel} htmlFor="order-status-filter">
                Status
              </label>

              <select
                id="order-status-filter"
                className="admin-filter"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                style={styles.select}
              >
                <option value="All">All Statuses</option>
                <option value="Placed">Placed</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={styles.message}>
              <div
                className="admin-spinner"
                style={styles.loadingSpinner}
              />

              <h3 style={styles.messageTitle}>
                Loading customer orders
              </h3>

              <p style={styles.messageText}>
                Please wait while we retrieve your order information.
              </p>
            </div>
          ) : error ? (
            <div style={styles.error}>
              <div style={styles.errorIcon}>!</div>

              <h3 style={styles.messageTitle}>
                Unable to load orders
              </h3>

              <p style={styles.errorText}>{error}</p>

              <button
                type="button"
                className="admin-refresh-button"
                style={styles.refreshButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={styles.message}>
              <div style={styles.emptyIcon}>▣</div>

              <h3 style={styles.messageTitle}>No orders found</h3>

              <p style={styles.messageText}>
                {orders.length === 0
                  ? "Orders will appear here after customers complete checkout."
                  : "No orders match your current search or status filter."}
              </p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table
                className="admin-table"
                style={styles.table}
              >
                <thead>
                  <tr>
                    <th style={styles.th}>ORDER ID</th>
                    <th style={styles.th}>CUSTOMER</th>
                    <th style={styles.th}>PRODUCT DETAILS</th>
                    <th style={styles.th}>TOTAL AMOUNT</th>
                    <th style={styles.th}>PAYMENT</th>
                    <th style={styles.th}>STATUS</th>
                    <th style={styles.th}>ORDER DATE</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={styles.td}>
                        <span style={styles.orderId}>
                          #{String(order._id || "").slice(-8).toUpperCase()}
                        </span>

                        <p style={styles.tableHint}>
                          Order reference
                        </p>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.customer}>
                          <div style={styles.avatar}>
                            {(
                              typeof order.user === "object"
                                ? order.user?.name || "C"
                                : "C"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div style={styles.customerDetails}>
                            <strong style={styles.customerName}>
                              {typeof order.user === "object"
                                ? order.user?.name || "Customer"
                                : "Customer"}
                            </strong>

                            <p style={styles.smallText}>
                              {typeof order.user === "object"
                                ? order.user?.email || "Email unavailable"
                                : "Customer details unavailable"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        {Array.isArray(order.items) &&
                        order.items.length > 0 ? (
                          <div style={styles.productList}>
                            {order.items.map((item, index) => {
                              const product =
                                item.product &&
                                typeof item.product === "object"
                                  ? item.product
                                  : null;

                              const name =
                                item.name ||
                                item.productName ||
                                product?.name ||
                                product?.title ||
                                "Product name unavailable";

                              const image =
                                item.image ||
                                item.imageUrl ||
                                product?.image ||
                                product?.imageUrl ||
                                "";

                              const quantity = Number(item.quantity || 1);

                              const price = Number(
                                item.price ?? product?.price ?? 0
                              );

                              return (
                                <div
                                  key={`${order._id}-${index}`}
                                  style={styles.product}
                                >
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={name}
                                      style={styles.productImage}
                                    />
                                  ) : (
                                    <div style={styles.imagePlaceholder}>
                                      ▣
                                    </div>
                                  )}

                                  <div style={styles.productDetails}>
                                    <strong style={styles.productName}>
                                      {name}
                                    </strong>

                                    <span style={styles.smallText}>
                                      Qty: {quantity} × {money(price)}
                                    </span>

                                    <strong style={styles.itemSubtotal}>
                                      {money(quantity * price)}
                                    </strong>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span style={styles.missingItems}>
                            No item details saved
                          </span>
                        )}
                      </td>

                      <td style={styles.td}>
                        <strong style={styles.total}>
                          {money(order.totalAmount)}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.paymentBadge}>
                          {order.paymentMethod || "COD"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={getStatusStyle(order.status || "Placed")}
                        >
                          <span style={styles.statusDot}>●</span>
                          {order.status || "Placed"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.dateText}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div
              className="admin-footer-row"
              style={styles.footerRow}
            >
              <span>
                Showing{" "}
                <strong style={styles.footerNumber}>
                  {filteredOrders.length}
                </strong>{" "}
                of{" "}
                <strong style={styles.footerNumber}>
                  {orders.length}
                </strong>{" "}
                orders
              </span>

              <span style={styles.footerNote}>
                PandiSelvi Order Management
              </span>
            </div>
          )}
        </section>

        <footer style={styles.pageFooter}>
          <span>
            © {new Date().getFullYear()} PandiSelvi E-Commerce
          </span>

          <span style={styles.footerSeparator}>•</span>

          <span>Admin Dashboard</span>
        </footer>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "85vh",
    padding: "36px clamp(16px, 4%, 64px)",
    background: "#f5f7fc",
    color: "#172033",
    fontFamily:
      "'DM Sans', 'Segoe UI', Arial, sans-serif",
    fontSize: 14,
    letterSpacing: "-0.01em",
    lineHeight: 1.55,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 22,
    marginBottom: 30,
  },

  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#718096",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.16em",
    margin: "0 0 13px",
  },

  brandDot: {
    display: "inline-block",
    width: 7,
    height: 7,
    background: "#6366f1",
    borderRadius: "50%",
  },

  eyebrowDivider: {
    color: "#cbd5e1",
  },

  title: {
    fontFamily: "'Manrope', 'DM Sans', sans-serif",
    fontSize: "clamp(26px, 3vw, 35px)",
    fontWeight: 800,
    letterSpacing: "-0.055em",
    margin: "0 0 10px",
    lineHeight: 1.25,
    color: "#151d31",
  },

  subtitle: {
    color: "#778399",
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.8,
    margin: 0,
    maxWidth: 620,
  },

  refreshButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    background: "#4f46e5",
    color: "#ffffff",
    padding: "12px 18px",
    border: "1px solid #4f46e5",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.005em",
    boxShadow: "0 4px 12px rgba(79,70,229,0.14)",
    whiteSpace: "nowrap",
  },

  refreshIcon: {
    fontSize: 19,
    lineHeight: 1,
  },

  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: 18,
    marginBottom: 28,
  },

  statCard: {
    background: "#ffffff",
    padding: "22px 23px",
    border: "1px solid #e8ecf4",
    borderRadius: 15,
    boxShadow: "0 3px 12px rgba(15,23,42,0.025)",
    minWidth: 0,
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },

  statIconBox: {
    display: "grid",
    placeItems: "center",
    width: 43,
    height: 43,
    borderRadius: 12,
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: 24,
    fontWeight: 700,
  },

  pendingIconBox: {
    display: "grid",
    placeItems: "center",
    width: 43,
    height: 43,
    borderRadius: 12,
    background: "#fff7ed",
    color: "#ea580c",
    fontSize: 26,
    fontWeight: 700,
  },

  deliveredIconBox: {
    display: "grid",
    placeItems: "center",
    width: 43,
    height: 43,
    borderRadius: 12,
    background: "#ecfdf5",
    color: "#059669",
    fontSize: 24,
    fontWeight: 800,
  },

  revenueIconBox: {
    display: "grid",
    placeItems: "center",
    width: 43,
    height: 43,
    borderRadius: 12,
    background: "#f5f3ff",
    color: "#7c3aed",
    fontSize: 23,
    fontWeight: 800,
  },

  statCaption: {
    color: "#9aa5b7",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.12em",
  },

  statLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 600,
    margin: "0 0 8px",
  },

  statValue: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: 31,
    fontWeight: 800,
    letterSpacing: "-0.055em",
    margin: 0,
    lineHeight: 1.3,
    color: "#182238",
    overflowWrap: "anywhere",
    fontVariantNumeric: "tabular-nums",
  },

  revenueValue: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: "clamp(20px, 2vw, 27px)",
    fontWeight: 800,
    letterSpacing: "-0.045em",
    margin: 0,
    lineHeight: 1.5,
    color: "#182238",
    overflowWrap: "anywhere",
    fontVariantNumeric: "tabular-nums",
  },

  statDescription: {
    fontSize: 11,
    color: "#97a2b4",
    fontWeight: 400,
    margin: "8px 0 0",
    lineHeight: 1.6,
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 5px 24px rgba(15,23,42,0.035)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    padding: "24px 25px",
    borderBottom: "1px solid #edf0f5",
  },

  panelTitle: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: 19,
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: "#182238",
    margin: "0 0 7px",
  },

  panelSubtitle: {
    fontSize: 12,
    fontWeight: 400,
    color: "#8591a5",
    margin: 0,
    lineHeight: 1.8,
  },

  orderCount: {
    padding: "8px 12px",
    background: "#eef2ff",
    color: "#4f46e5",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
    padding: "20px 24px",
    background: "#ffffff",
  },

  searchWrapper: {
    display: "flex",
    alignItems: "center",
    flex: "1 1 300px",
    minWidth: 0,
    gap: 10,
    padding: "0 13px",
    border: "1px solid #e0e5ee",
    borderRadius: 10,
    background: "#ffffff",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  searchIcon: {
    color: "#94a3b8",
    fontSize: 25,
    lineHeight: 1,
  },

  search: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    padding: "13px 0",
    border: 0,
    outline: "none",
    background: "transparent",
    color: "#334155",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
  },

  filterWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  filterLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    whiteSpace: "nowrap",
  },

  select: {
    padding: "12px 14px",
    border: "1px solid #e0e5ee",
    borderRadius: 10,
    background: "#ffffff",
    color: "#334155",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    outline: "none",
    cursor: "pointer",
    maxWidth: "100%",
  },

  tableContainer: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },

  table: {
    width: "100%",
    minWidth: 1050,
    borderCollapse: "separate",
    borderSpacing: 0,
    textAlign: "left",
    fontSize: 12,
  },

  th: {
    padding: "16px 18px",
    background: "#f8f9fc",
    color: "#8792a6",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.09em",
    whiteSpace: "nowrap",
    borderTop: "1px solid #edf0f5",
    borderBottom: "1px solid #e8ecf3",
  },

  td: {
    padding: "19px 18px",
    borderBottom: "1px solid #edf0f5",
    verticalAlign: "top",
    color: "#475569",
  },

  orderId: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 800,
    color: "#4f46e5",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  },

  tableHint: {
    fontSize: 10,
    color: "#a0aabd",
    fontWeight: 400,
    margin: "6px 0 0",
    whiteSpace: "nowrap",
  },

  customer: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    minWidth: 180,
  },

  avatar: {
    display: "grid",
    placeItems: "center",
    width: 37,
    height: 37,
    flexShrink: 0,
    borderRadius: 12,
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: 14,
    fontWeight: 800,
  },

  customerDetails: {
    display: "grid",
    gap: 3,
    minWidth: 0,
  },

  customerName: {
    color: "#273449",
    fontSize: 12,
    fontWeight: 700,
    overflowWrap: "anywhere",
  },

  productList: {
    display: "grid",
    gap: 14,
    minWidth: 220,
  },

  product: {
    display: "flex",
    alignItems: "center",
    gap: 11,
  },

  productImage: {
    width: 55,
    height: 55,
    objectFit: "contain",
    background: "#ffffff",
    border: "1px solid #e8ebf2",
    borderRadius: 11,
    padding: 4,
    flexShrink: 0,
  },

  imagePlaceholder: {
    width: 55,
    height: 55,
    display: "grid",
    placeItems: "center",
    background: "#f1f5f9",
    border: "1px solid #e8ebf2",
    borderRadius: 11,
    fontSize: 23,
    flexShrink: 0,
    color: "#94a3b8",
  },

  productDetails: {
    display: "grid",
    gap: 5,
    minWidth: 0,
  },

  productName: {
    color: "#334155",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.6,
    whiteSpace: "normal",
    overflowWrap: "anywhere",
  },

  smallText: {
    color: "#8b97aa",
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 1.7,
    margin: 0,
    overflowWrap: "anywhere",
  },

  itemSubtotal: {
    color: "#334155",
    fontSize: 11,
    fontWeight: 800,
    fontVariantNumeric: "tabular-nums",
  },

  missingItems: {
    color: "#b45309",
    background: "#fffbeb",
    borderRadius: 7,
    padding: "7px 9px",
    display: "inline-block",
    fontSize: 10,
    whiteSpace: "nowrap",
  },

  total: {
    display: "inline-block",
    color: "#182238",
    fontSize: 13,
    fontWeight: 800,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
    paddingTop: 3,
  },

  paymentBadge: {
    display: "inline-block",
    background: "#f1f5f9",
    color: "#475569",
    padding: "7px 10px",
    borderRadius: 7,
    fontSize: 10,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  statusDot: {
    fontSize: 8,
    marginRight: 6,
  },

  placed: {
    display: "inline-flex",
    alignItems: "center",
    background: "#fff7ed",
    color: "#c2410c",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  confirmed: {
    display: "inline-flex",
    alignItems: "center",
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  shipped: {
    display: "inline-flex",
    alignItems: "center",
    background: "#f5f3ff",
    color: "#6d28d9",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  delivered: {
    display: "inline-flex",
    alignItems: "center",
    background: "#ecfdf5",
    color: "#047857",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  cancelled: {
    display: "inline-flex",
    alignItems: "center",
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 10,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  dateText: {
    display: "inline-block",
    paddingTop: 5,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  },

  message: {
    padding: "65px 20px",
    textAlign: "center",
    color: "#64748b",
  },

  loadingSpinner: {
    width: 34,
    height: 34,
    border: "3px solid #e0e7ff",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    margin: "0 auto 18px",
  },

  emptyIcon: {
    display: "grid",
    placeItems: "center",
    width: 64,
    height: 64,
    margin: "0 auto 17px",
    borderRadius: 20,
    background: "#f1f5f9",
    color: "#94a3b8",
    fontSize: 32,
  },

  messageTitle: {
    fontFamily: "'Manrope', sans-serif",
    color: "#334155",
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: "-0.025em",
    margin: "0 0 8px",
  },

  messageText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 1.9,
    margin: 0,
  },

  error: {
    padding: "45px 20px",
    textAlign: "center",
    color: "#b91c1c",
  },

  errorIcon: {
    display: "grid",
    placeItems: "center",
    width: 45,
    height: 45,
    margin: "0 auto 15px",
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: 24,
    fontWeight: 800,
  },

  errorText: {
    fontSize: 12,
    lineHeight: 1.8,
    margin: "0 0 18px",
  },

  footerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    padding: "17px 24px",
    borderTop: "1px solid #edf0f5",
    background: "#fcfcfe",
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 500,
  },

  footerNumber: {
    color: "#475569",
    fontWeight: 800,
  },

  footerNote: {
    color: "#a0aabd",
    fontSize: 10,
    fontWeight: 600,
  },

  pageFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 9,
    textAlign: "center",
    padding: "27px 0 8px",
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: 500,
  },

  footerSeparator: {
    color: "#cbd5e1",
  },
};

export default AdminOrders;
