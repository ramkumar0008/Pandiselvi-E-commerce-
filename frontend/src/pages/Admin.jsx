import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function Admin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalOrderValue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          `${API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          const data = response.data.stats || response.data;

          setStats({
            totalUsers: data.totalUsers ?? 0,
            totalProducts: data.totalProducts ?? 0,
            totalOrders: data.totalOrders ?? 0,
            pendingOrders: data.pendingOrders ?? 0,
            totalOrderValue: data.totalOrderValue ?? 0,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard statistics. Check your admin API."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "#dbeafe",
      link: "/admin/users",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "#dcfce7",
      link: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "🛍️",
      color: "#f3e8ff",
      link: "/admin/orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "#fef3c7",
      link: "/admin/orders",
    },
  ];

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <span style={styles.brandIcon}>🛍️</span>
            <div>
              <h2 style={styles.brandName}>PandiSelvi</h2>
              <p style={styles.brandSubtitle}>ADMIN PANEL</p>
            </div>
          </div>

          <p style={styles.menuHeading}>MAIN MENU</p>

          <Link to="/admin" style={styles.activeMenu}>
            <span>📊</span> Dashboard
          </Link>

          <Link to="/admin/products" style={styles.menuItem}>
            <span>📦</span> Products
          </Link>

          <Link to="/admin/orders" style={styles.menuItem}>
            <span>🛒</span> Orders
          </Link>

          <Link to="/admin/users" style={styles.menuItem}>
            <span>👥</span> Customers
          </Link>

          <div style={styles.sidebarBottom}>
            <Link to="/" style={styles.menuItem}>
              <span>🏠</span> View Store
            </Link>
          </div>
        </aside>

        <main style={styles.main}>
          <header style={styles.header}>
            <div>
              <p style={styles.breadcrumb}>ADMIN / DASHBOARD</p>
              <h1 style={styles.pageTitle}>Admin Dashboard</h1>
              <p style={styles.welcome}>
                Welcome back, Pandiselvi 👋
              </p>
            </div>

            <Link to="/" style={styles.storeButton}>
              ↗ View Store
            </Link>
          </header>

          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Store Overview</h2>
                <p style={styles.sectionSubtitle}>
                  Here's what's happening with your store.
                </p>
              </div>

              <span style={styles.liveBadge}>
                ● Dashboard
              </span>
            </div>

            <div style={styles.statsGrid}>
              {cards.map((card) => (
                <Link
                  to={card.link}
                  key={card.title}
                  style={styles.cardLink}
                >
                  <div style={styles.statCard}>
                    <div style={styles.cardTop}>
                      <span style={styles.cardTitle}>
                        {card.title}
                      </span>

                      <span
                        style={{
                          ...styles.cardIcon,
                          background: card.color,
                        }}
                      >
                        {card.icon}
                      </span>
                    </div>

                    <div style={styles.cardBottom}>
                      <h3 style={styles.cardValue}>
                        {loading ? "..." : card.value}
                      </h3>
                      <span style={styles.cardArrow}>↗</span>
                    </div>

                    <p style={styles.cardHint}>
                      View details →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section style={styles.revenueCard}>
            <div style={styles.revenueInfo}>
              <div style={styles.revenueIcon}>₹</div>
              <div>
                <p style={styles.revenueLabel}>
                  TOTAL ORDER VALUE
                </p>
                <h2 style={styles.revenueValue}>
                  {loading
                    ? "Loading..."
                    : `₹${Number(
                        stats.totalOrderValue
                      ).toLocaleString("en-IN")}`}
                </h2>
                <p style={styles.revenueDescription}>
                  Combined value of orders recorded in your store
                </p>
              </div>
            </div>

            <div style={styles.revenueDecoration}>₹</div>
          </section>

          <section style={styles.quickSection}>
            <h2 style={styles.sectionTitle}>Quick Actions</h2>
            <p style={styles.sectionSubtitle}>
              Manage your store from one place.
            </p>

            <div style={styles.quickGrid}>
              <Link to="/admin/products" style={styles.quickCard}>
                <span style={styles.quickIcon}>➕</span>
                <div>
                  <h3 style={styles.quickTitle}>Manage Products</h3>
                  <p style={styles.quickText}>
                    Add, edit, or remove products.
                  </p>
                </div>
                <span style={styles.quickArrow}>→</span>
              </Link>

              <Link to="/admin/orders" style={styles.quickCard}>
                <span style={styles.quickIcon}>📋</span>
                <div>
                  <h3 style={styles.quickTitle}>Manage Orders</h3>
                  <p style={styles.quickText}>
                    Review customer orders and statuses.
                  </p>
                </div>
                <span style={styles.quickArrow}>→</span>
              </Link>

              <Link to="/admin/users" style={styles.quickCard}>
                <span style={styles.quickIcon}>👤</span>
                <div>
                  <h3 style={styles.quickTitle}>View Customers</h3>
                  <p style={styles.quickText}>
                    Review registered customers.
                  </p>
                </div>
                <span style={styles.quickArrow}>→</span>
              </Link>
            </div>
          </section>

          <footer style={styles.footer}>
            © {new Date().getFullYear()} PandiSelvi E-Commerce.
            All rights reserved.
          </footer>
        </main>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily: "Poppins, Arial, sans-serif",
  },
  sidebar: {
    width: "235px",
    flexShrink: 0,
    background: "#111827",
    color: "white",
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 8px 30px",
    borderBottom: "1px solid #374151",
  },
  brandIcon: {
    fontSize: "30px",
    background: "#374151",
    borderRadius: "12px",
    padding: "9px",
  },
  brandName: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 800,
  },
  brandSubtitle: {
    margin: "5px 0 0",
    fontSize: "10px",
    letterSpacing: "2px",
    color: "#9ca3af",
  },
  menuHeading: {
    margin: "30px 10px 12px",
    color: "#9ca3af",
    fontSize: "11px",
    letterSpacing: "1.5px",
  },
  activeMenu: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "13px 14px",
    borderRadius: "10px",
    background: "#374151",
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    marginBottom: "8px",
  },
  menuItem: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "13px 14px",
    borderRadius: "10px",
    color: "#d1d5db",
    textDecoration: "none",
    marginBottom: "8px",
    fontSize: "14px",
  },
  sidebarBottom: {
    marginTop: "auto",
    paddingTop: "25px",
    borderTop: "1px solid #374151",
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: "35px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "36px",
  },
  breadcrumb: {
    fontSize: "11px",
    letterSpacing: "1.5px",
    color: "#6b7280",
    margin: "0 0 10px",
  },
  pageTitle: {
    fontSize: "30px",
    fontWeight: 800,
    margin: "0 0 8px",
    color: "#111827",
  },
  welcome: {
    color: "#6b7280",
    margin: 0,
    fontSize: "14px",
  },
  storeButton: {
    textDecoration: "none",
    color: "white",
    background: "#111827",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "13px",
  },
  section: {
    marginBottom: "28px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 7px",
    fontSize: "20px",
    fontWeight: 750,
    color: "#111827",
  },
  sectionSubtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },
  liveBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "18px",
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    minWidth: 0,
  },
  statCard: {
    background: "white",
    padding: "23px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 5px 18px rgba(15,23,42,0.035)",
    minHeight: "145px",
    boxSizing: "border-box",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  cardTitle: {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 600,
  },
  cardIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  },
  cardBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "18px",
  },
  cardValue: {
    margin: 0,
    fontSize: "29px",
    fontWeight: 800,
    color: "#111827",
  },
  cardArrow: {
    color: "#9ca3af",
    fontSize: "18px",
  },
  cardHint: {
    margin: "8px 0 0",
    color: "#9ca3af",
    fontSize: "11px",
  },
  revenueCard: {
    background: "linear-gradient(120deg, #111827, #26344d)",
    color: "white",
    borderRadius: "18px",
    padding: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    overflow: "hidden",
    position: "relative",
    marginBottom: "35px",
  },
  revenueInfo: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    position: "relative",
    zIndex: 1,
  },
  revenueIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: 700,
    flexShrink: 0,
  },
  revenueLabel: {
    color: "#cbd5e1",
    fontSize: "11px",
    letterSpacing: "1.5px",
    margin: "0 0 8px",
  },
  revenueValue: {
    fontSize: "34px",
    margin: 0,
    fontWeight: 800,
  },
  revenueDescription: {
    color: "#cbd5e1",
    fontSize: "12px",
    margin: "8px 0 0",
  },
  revenueDecoration: {
    fontSize: "130px",
    fontWeight: 800,
    color: "rgba(255,255,255,0.06)",
    lineHeight: 1,
  },
  quickSection: {
    marginBottom: "30px",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  },
  quickCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "19px",
    color: "inherit",
    textDecoration: "none",
    minWidth: 0,
  },
  quickIcon: {
    width: "43px",
    height: "43px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    borderRadius: "12px",
    fontSize: "20px",
    flexShrink: 0,
  },
  quickTitle: {
    fontSize: "13px",
    margin: "0 0 6px",
    fontWeight: 700,
  },
  quickText: {
    fontSize: "11px",
    color: "#6b7280",
    margin: 0,
    lineHeight: 1.5,
  },
  quickArrow: {
    marginLeft: "auto",
    color: "#9ca3af",
    fontSize: "20px",
  },
  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "22px",
    fontSize: "13px",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "22px",
    color: "#9ca3af",
    fontSize: "12px",
    textAlign: "center",
  },
};

export default Admin;
