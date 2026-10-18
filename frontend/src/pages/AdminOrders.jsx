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
      <Navbar />

      <main style={styles.page}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>PANDISELVI / ADMIN</p>
            <h1 style={styles.title}>Order Management</h1>
            <p style={styles.subtitle}>
              View customer orders, products, payments, and delivery details.
            </p>
          </div>

          <button
            type="button"
            style={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            ↻ Refresh Orders
          </button>
        </header>

        <section style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📦</span>
            <p style={styles.statLabel}>Total Orders</p>
            <h2 style={styles.statValue}>{orders.length}</h2>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>⏳</span>
            <p style={styles.statLabel}>Pending Orders</p>
            <h2 style={styles.statValue}>
              {
                orders.filter((order) =>
                  ["Placed", "Confirmed"].includes(order.status)
                ).length
              }
            </h2>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>🚚</span>
            <p style={styles.statLabel}>Delivered Orders</p>
            <h2 style={styles.statValue}>
              {orders.filter((order) => order.status === "Delivered").length}
            </h2>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>₹</span>
            <p style={styles.statLabel}>Order Value</p>
            <h2 style={styles.statValue}>{money(totalRevenue)}</h2>
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>All Customer Orders</h2>
              <p style={styles.subtitle}>
                Search by order ID, customer, email, or product.
              </p>
            </div>
          </div>

          <div style={styles.toolbar}>
            <input
              type="search"
              placeholder="Search orders..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={styles.search}
            />

            <select
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

          {loading ? (
            <div style={styles.message}>Loading customer orders...</div>
          ) : error ? (
            <div style={styles.error}>
              <p>{error}</p>
              <button
                style={styles.refreshButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={styles.message}>
              <div style={{ fontSize: 42 }}>📦</div>
              <h3>No orders found</h3>
              <p>
                {orders.length === 0
                  ? "Orders will appear after customers complete checkout."
                  : "Try another search or order status."}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Products</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Payment</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Order Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={styles.td}>
                        <strong>
                          #{String(order._id || "").slice(-8).toUpperCase()}
                        </strong>
                      </td>

                      <td style={styles.td}>
                        <strong>
                          {typeof order.user === "object"
                            ? order.user?.name || "Customer"
                            : "Customer"}
                        </strong>
                        <p style={styles.smallText}>
                          {typeof order.user === "object"
                            ? order.user?.email || "Email unavailable"
                            : "Customer details unavailable"}
                        </p>
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
                                      📦
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
                        {order.paymentMethod || "COD"}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={getStatusStyle(order.status || "Placed")}
                        >
                          {order.status || "Placed"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div style={styles.footerRow}>
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          )}
        </section>

        <footer style={styles.pageFooter}>
          © {new Date().getFullYear()} PandiSelvi E-Commerce · Admin Panel
        </footer>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "85vh",
    padding: "35px 4%",
    background: "#f5f7fb",
    color: "#111827",
    fontFamily: "Poppins, Arial, sans-serif",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 18,
    marginBottom: 28,
  },
  eyebrow: {
    color: "#6b7280",
    fontSize: 11,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    margin: "8px 0",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 13,
  },
  refreshButton: {
    background: "#111827",
    color: "white",
    padding: "11px 16px",
    border: 0,
    borderRadius: 9,
    cursor: "pointer",
    fontWeight: 600,
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 25,
  },
  statCard: {
    background: "white",
    padding: 20,
    border: "1px solid #e5e7eb",
    borderRadius: 13,
  },
  statIcon: { fontSize: 24 },
  statLabel: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 7,
  },
  statValue: { fontSize: 23, margin: 0, overflowWrap: "anywhere" },
  panel: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(15,23,42,0.04)",
  },
  panelHeader: { padding: 22, borderBottom: "1px solid #e5e7eb" },
  panelTitle: { fontSize: 18, margin: "0 0 8px" },
  toolbar: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    padding: 20,
  },
  search: {
    flex: "1 1 230px",
    minWidth: 0,
    padding: 12,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
  },
  select: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "white",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: 12,
  },
  th: {
    padding: "16px",
    background: "#f9fafb",
    color: "#6b7280",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    verticalAlign: "top",
  },
  productList: { display: "grid", gap: 12, minWidth: 230 },
  product: { display: "flex", alignItems: "center", gap: 10 },
  productImage: {
    width: 54,
    height: 54,
    objectFit: "contain",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    flexShrink: 0,
  },
  imagePlaceholder: {
    width: 54,
    height: 54,
    display: "grid",
    placeItems: "center",
    background: "#f3f4f6",
    borderRadius: 8,
    fontSize: 22,
    flexShrink: 0,
  },
  productDetails: { display: "grid", gap: 4 },
  productName: { fontSize: 12, whiteSpace: "normal" },
  smallText: {
    color: "#6b7280",
    fontSize: 11,
    margin: "4px 0 0",
  },
  itemSubtotal: { fontSize: 11 },
  missingItems: { color: "#b91c1c", fontSize: 11 },
  total: { whiteSpace: "nowrap" },
  placed: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  confirmed: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  shipped: {
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "6px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  delivered: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  cancelled: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 9px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  message: {
    padding: 35,
    textAlign: "center",
    color: "#6b7280",
  },
  error: {
    padding: 25,
    textAlign: "center",
    color: "#b91c1c",
  },
  footerRow: {
    padding: 16,
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: 12,
  },
  pageFooter: {
    textAlign: "center",
    padding: "25px 0",
    color: "#9ca3af",
    fontSize: 12,
  },
};

export default AdminOrders;
