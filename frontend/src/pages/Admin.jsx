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
      color: "#e0f2fe",
      accent: "#0284c7",
      link: "/admin/users",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "#dcfce7",
      accent: "#16a34a",
      link: "/admin/products",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "🛍️",
      color: "#ede9fe",
      accent: "#7c3aed",
      link: "/admin/orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: "⏳",
      color: "#fef3c7",
      accent: "#d97706",
      link: "/admin/orders",
    },
  ];

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      background: "#f4f7fb",
      color: "#172033",
      fontFamily: "Poppins, Inter, Arial, sans-serif",
    },
    sidebar: {
      width: "245px",
      flex: "0 0 245px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      padding: "27px 17px 20px",
      color: "#fff",
      background: "#111c35",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "0 7px 27px",
      borderBottom: "1px solid rgba(255,255,255,0.12)",
    },
    brandIcon: {
      display: "grid",
      width: "47px",
      height: "47px",
      flexShrink: 0,
      placeItems: "center",
      borderRadius: "14px",
      background: "linear-gradient(135deg,#14b8a6,#0f766e)",
      fontSize: "23px",
    },
    brandName: {
      margin: 0,
      fontSize: "18px",
      fontWeight: 800,
      letterSpacing: "-0.4px",
    },
    brandSubtitle: {
      margin: "6px 0 0",
      color: "#9ba9c0",
      fontSize: "9px",
      fontWeight: 700,
      letterSpacing: "1.3px",
    },
    menuHeading: {
      margin: "29px 10px 13px",
      color: "#8290a8",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "1.6px",
    },
    menu: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
    },
    menuLink: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minHeight: "46px",
      boxSizing: "border-box",
      padding: "12px 13px",
      borderRadius: "11px",
      color: "#c4ccda",
      fontSize: "13px",
      fontWeight: 600,
      textDecoration: "none",
    },
    activeMenu: {
      background: "linear-gradient(110deg,#0d9488,#0f766e)",
      color: "#fff",
      boxShadow: "0 7px 18px rgba(13,148,136,0.19)",
    },
    sidebarBottom: {
      marginTop: "auto",
      paddingTop: "19px",
      borderTop: "1px solid rgba(255,255,255,0.12)",
    },
    main: {
      flex: 1,
      minWidth: 0,
      boxSizing: "border-box",
      padding: "35px clamp(20px,3.2vw,48px) 24px",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "20px",
      marginBottom: "36px",
    },
    breadcrumb: {
      display: "flex",
      gap: "9px",
      margin: "0 0 11px",
      color: "#0d9488",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "1.4px",
    },
    pageTitle: {
      margin: 0,
      color: "#172033",
      fontSize: "clamp(25px,2.3vw,32px)",
      fontWeight: 800,
      letterSpacing: "-1px",
      lineHeight: 1.25,
    },
    welcome: {
      margin: "10px 0 0",
      color: "#748096",
      fontSize: "13px",
      lineHeight: 1.7,
    },
    storeButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "9px",
      padding: "12px 17px",
      border: "1px solid #172033",
      borderRadius: "10px",
      color: "#fff",
      background: "#172033",
      fontSize: "12px",
      fontWeight: 700,
      textDecoration: "none",
    },
    section: {
      marginBottom: "30px",
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "14px",
      marginBottom: "19px",
    },
    sectionTitle: {
      margin: "0 0 7px",
      color: "#172033",
      fontSize: "19px",
      fontWeight: 800,
      letterSpacing: "-0.4px",
    },
    sectionSubtitle: {
      margin: 0,
      color: "#8590a2",
      fontSize: "12px",
      lineHeight: 1.6,
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      border: "1px solid #bcebdc",
      borderRadius: "30px",
      color: "#087f5b",
      background: "#ecfdf5",
      fontSize: "10px",
      fontWeight: 800,
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))",
      gap: "17px",
    },
    cardLink: {
      minWidth: 0,
      color: "inherit",
      textDecoration: "none",
    },
    statCard: {
      minHeight: "157px",
      boxSizing: "border-box",
      padding: "20px",
      border: "1px solid #e8edf4",
      borderRadius: "16px",
      background: "#fff",
      boxShadow: "0 5px 20px rgba(28,39,60,0.025)",
    },
    cardTop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
    },
    cardTitle: {
      color: "#778398",
      fontSize: "11px",
      fontWeight: 700,
      lineHeight: 1.5,
    },
    cardIcon: {
      display: "grid",
      width: "42px",
      height: "42px",
      flexShrink: 0,
      placeItems: "center",
      borderRadius: "13px",
      fontSize: "20px",
    },
    cardBottom: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
      marginTop: "19px",
    },
    cardValue: {
      overflowWrap: "anywhere",
      margin: 0,
      fontSize: "clamp(24px,2.2vw,31px)",
      fontWeight: 800,
      letterSpacing: "-0.7px",
    },
    cardArrow: {
      color: "#a5afbf",
      fontSize: "18px",
    },
    cardHint: {
      margin: "8px 0 0",
      color: "#9aa4b5",
      fontSize: "10px",
      fontWeight: 600,
    },
    revenueCard: {
      position: "relative",
      display: "flex",
      minHeight: "165px",
      boxSizing: "border-box",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "20px",
      overflow: "hidden",
      marginBottom: "36px",
      padding: "27px 30px",
      borderRadius: "18px",
      color: "#fff",
      background: "linear-gradient(115deg,#111c35 0%,#183451 65%,#0f766e 140%)",
      boxShadow: "0 12px 30px rgba(17,28,53,0.12)",
    },
    revenueInfo: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      gap: "19px",
      minWidth: 0,
    },
    revenueIcon: {
      display: "grid",
      width: "59px",
      height: "59px",
      flexShrink: 0,
      placeItems: "center",
      border: "1px solid rgba(255,255,255,0.16)",
      borderRadius: "17px",
      color: "#8df3dc",
      background: "rgba(255,255,255,0.1)",
      fontSize: "31px",
      fontWeight: 800,
    },
    revenueLabel: {
      margin: "0 0 9px",
      color: "#a7c4d7",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "1.7px",
    },
    revenueValue: {
      overflowWrap: "anywhere",
      margin: 0,
      color: "#fff",
      fontSize: "clamp(27px,3vw,37px)",
      fontWeight: 800,
      letterSpacing: "-1px",
    },
    revenueDescription: {
      margin: "9px 0 0",
      color: "#c3d2e0",
      fontSize: "11px",
      lineHeight: 1.6,
    },
    revenueDecoration: {
      color: "rgba(255,255,255,0.08)",
      fontSize: "110px",
      fontWeight: 800,
      lineHeight: 1,
      flexShrink: 0,
    },
    quickGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))",
      gap: "15px",
      marginTop: "19px",
    },
    quickCard: {
      display: "flex",
      minWidth: 0,
      alignItems: "center",
      gap: "12px",
      boxSizing: "border-box",
      padding: "18px 15px",
      border: "1px solid #e8edf4",
      borderRadius: "14px",
      color: "inherit",
      background: "#fff",
      textDecoration: "none",
    },
    quickIcon: {
      display: "grid",
      width: "43px",
      height: "43px",
      flexShrink: 0,
      placeItems: "center",
      borderRadius: "12px",
      fontSize: "19px",
    },
    quickCopy: {
      display: "flex",
      minWidth: 0,
      flex: 1,
      flexDirection: "column",
      gap: "6px",
    },
    quickTitle: {
      color: "#253149",
      fontSize: "12px",
      fontWeight: 800,
      lineHeight: 1.4,
    },
    quickText: {
      color: "#8994a7",
      fontSize: "10px",
      lineHeight: 1.5,
    },
    quickArrow: {
      flexShrink: 0,
      color: "#9aa4b5",
      fontSize: "20px",
    },
    error: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      marginBottom: "23px",
      padding: "14px 16px",
      border: "1px solid #fecaca",
      borderRadius: "11px",
      color: "#b91c1c",
      background: "#fef2f2",
      fontSize: "12px",
      lineHeight: 1.6,
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "8px",
      paddingTop: "21px",
      borderTop: "1px solid #e6eaf1",
      color: "#929daf",
      fontSize: "10px",
      lineHeight: 1.6,
    },
  };

  return (
    <>
      <Navbar />

      <style>{`
        .admin-menu-link,
        .admin-store-button,
        .admin-stat-link,
        .admin-quick-card {
          transition: all 0.2s ease;
        }

        .admin-menu-link:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        .admin-store-button:hover {
          background: #0d9488 !important;
          border-color: #0d9488 !important;
          transform: translateY(-2px);
        }

        .admin-stat-link:hover > div {
          transform: translateY(-4px);
          border-color: #b8e7e0 !important;
          box-shadow: 0 12px 28px rgba(28,39,60,0.08) !important;
        }

        .admin-quick-card:hover {
          transform: translateY(-3px);
          border-color: #b8e7e0 !important;
          box-shadow: 0 10px 24px rgba(28,39,60,0.06);
        }

        .admin-stat-link > div {
          transition: all 0.2s ease;
        }

        @media (max-width: 1150px) {
          .admin-sidebar {
            width: 220px !important;
            flex-basis: 220px !important;
          }

          .admin-main {
            padding: 28px 23px 22px !important;
          }
        }

        @media (max-width: 700px) {
          .admin-page-layout {
            flex-direction: column !important;
          }

          .admin-sidebar {
            width: 100% !important;
            flex: none !important;
            padding: 16px !important;
          }

          .admin-brand {
            padding: 0 2px 15px !important;
          }

          .admin-menu-heading {
            margin: 18px 2px 10px !important;
          }

          .admin-navigation {
            display: grid !important;
            grid-template-columns: repeat(2,minmax(0,1fr));
            gap: 7px !important;
          }

          .admin-navigation .admin-menu-link {
            min-height: 42px;
            gap: 8px;
            padding: 10px;
            font-size: 12px;
          }

          .admin-sidebar-bottom {
            margin-top: 12px !important;
            padding-top: 12px !important;
          }

          .admin-main {
            width: 100%;
            padding: 25px 16px 20px !important;
          }

          .admin-header {
            align-items: flex-start !important;
            flex-direction: column;
            gap: 17px !important;
            margin-bottom: 27px !important;
          }

          .admin-store-button {
            width: 100%;
            box-sizing: border-box;
          }

          .admin-stats-grid {
            grid-template-columns: repeat(2,minmax(0,1fr)) !important;
            gap: 11px !important;
          }

          .admin-stat-card {
            min-height: 145px !important;
            padding: 14px !important;
            border-radius: 13px !important;
          }

          .admin-stat-icon {
            width: 34px !important;
            height: 34px !important;
            border-radius: 10px !important;
            font-size: 17px !important;
          }

          .admin-stat-title {
            font-size: 10px !important;
          }

          .admin-stat-bottom {
            margin-top: 17px !important;
          }

          .admin-stat-value {
            font-size: clamp(21px,6vw,28px) !important;
          }

          .admin-revenue-card {
            min-height: 150px !important;
            margin-bottom: 29px !important;
            padding: 21px 17px !important;
            border-radius: 15px !important;
          }

          .admin-revenue-info {
            gap: 12px !important;
          }

          .admin-revenue-icon {
            width: 43px !important;
            height: 43px !important;
            border-radius: 12px !important;
            font-size: 24px !important;
          }

          .admin-revenue-label {
            font-size: 9px !important;
            letter-spacing: 1px !important;
          }

          .admin-revenue-value {
            font-size: clamp(23px,6vw,32px) !important;
          }

          .admin-revenue-description {
            font-size: 10px !important;
          }

          .admin-revenue-decoration {
            position: absolute;
            right: -12px;
            bottom: -15px;
            font-size: 85px !important;
          }

          .admin-quick-grid {
            grid-template-columns: 1fr !important;
            gap: 11px !important;
          }

          .admin-quick-card {
            padding: 15px 12px !important;
          }

          .admin-footer {
            flex-direction: column;
            text-align: center;
            gap: 4px !important;
          }
        }

        @media (max-width: 360px) {
          .admin-main {
            padding-right: 11px !important;
            padding-left: 11px !important;
          }

          .admin-stats-grid {
            gap: 8px !important;
          }

          .admin-stat-card {
            padding: 11px !important;
          }

          .admin-stat-title {
            font-size: 9px !important;
          }

          .admin-stat-icon {
            width: 30px !important;
            height: 30px !important;
            font-size: 15px !important;
          }

          .admin-stat-value {
            font-size: 21px !important;
          }

          .admin-revenue-card {
            padding: 17px 12px !important;
          }
        }
      `}</style>

      <div className="admin-page-layout" style={styles.page}>
        <aside className="admin-sidebar" style={styles.sidebar}>
          <div className="admin-brand" style={styles.brand}>
            <span style={styles.brandIcon}>🛍️</span>
            <div>
              <h2 style={styles.brandName}>PandiSelvi</h2>
              <p style={styles.brandSubtitle}>YOUR EVERYDAY STORE</p>
            </div>
          </div>

          <p style={styles.menuHeading}>MAIN MENU</p>

          <nav className="admin-navigation" style={styles.menu}>
            <Link
              to="/admin"
              className="admin-menu-link"
              style={{ ...styles.menuLink, ...styles.activeMenu }}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/products"
              className="admin-menu-link"
              style={styles.menuLink}
            >
              <span>📦</span>
              <span>Products</span>
            </Link>

            <Link
              to="/admin/orders"
              className="admin-menu-link"
              style={styles.menuLink}
            >
              <span>🛒</span>
              <span>Orders</span>
            </Link>

            <Link
              to="/admin/users"
              className="admin-menu-link"
              style={styles.menuLink}
            >
              <span>👥</span>
              <span>Customers</span>
            </Link>
          </nav>

          <div className="admin-sidebar-bottom" style={styles.sidebarBottom}>
            <Link
              to="/"
              className="admin-menu-link"
              style={styles.menuLink}
            >
              <span>🏠</span>
              <span>View Store</span>
              <span style={{ marginLeft: "auto" }}>↗</span>
            </Link>
          </div>
        </aside>

        <main className="admin-main" style={styles.main}>
          <header className="admin-header" style={styles.header}>
            <div>
              <p style={styles.breadcrumb}>
                <span>ADMIN</span>
                <span style={{ color: "#a0aabb" }}>/</span>
                <span>DASHBOARD</span>
              </p>

              <h1 style={styles.pageTitle}>Admin Dashboard</h1>

              <p style={styles.welcome}>
                Welcome back, Pandiselvi 👋
                <span> Here's your store at a glance.</span>
              </p>
            </div>

            <Link
              to="/"
              className="admin-store-button"
              style={styles.storeButton}
            >
              ↗ View Store
            </Link>
          </header>

          {error && (
            <div style={styles.error} role="alert">
              <span>⚠️</span>
              <span>{error}</span>
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

              <span style={styles.badge}>
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                />
                Dashboard
              </span>
            </div>

            <div
              className="admin-stats-grid"
              style={styles.statsGrid}
            >
              {cards.map((card) => (
                <Link
                  to={card.link}
                  key={card.title}
                  className="admin-stat-link"
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
                      <h3
                        style={{
                          ...styles.cardValue,
                          color: card.accent,
                        }}
                      >
                        {loading
                          ? "..."
                          : Number(card.value).toLocaleString("en-IN")}
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

          <section
            className="admin-revenue-card"
            style={styles.revenueCard}
          >
            <div
              className="admin-revenue-info"
              style={styles.revenueInfo}
            >
              <div style={styles.revenueIcon}>₹</div>

              <div style={{ minWidth: 0 }}>
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

            <div
              className="admin-revenue-decoration"
              style={styles.revenueDecoration}
            >
              ₹
            </div>
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <p style={styles.sectionSubtitle}>
                  Manage your store from one place.
                </p>
              </div>
            </div>

            <div
              className="admin-quick-grid"
              style={styles.quickGrid}
            >
              <Link
                to="/admin/products"
                className="admin-quick-card"
                style={styles.quickCard}
              >
                <span
                  style={{
                    ...styles.quickIcon,
                    background: "#ccfbf1",
                  }}
                >
                  ➕
                </span>

                <span style={styles.quickCopy}>
                  <strong style={styles.quickTitle}>
                    Manage Products
                  </strong>
                  <small style={styles.quickText}>
                    Add, edit, or remove products.
                  </small>
                </span>

                <span style={styles.quickArrow}>→</span>
              </Link>

              <Link
                to="/admin/orders"
                className="admin-quick-card"
                style={styles.quickCard}
              >
                <span
                  style={{
                    ...styles.quickIcon,
                    background: "#ede9fe",
                  }}
                >
                  📋
                </span>

                <span style={styles.quickCopy}>
                  <strong style={styles.quickTitle}>
                    Manage Orders
                  </strong>
                  <small style={styles.quickText}>
                    Review customer orders and statuses.
                  </small>
                </span>

                <span style={styles.quickArrow}>→</span>
              </Link>

              <Link
                to="/admin/users"
                className="admin-quick-card"
                style={styles.quickCard}
              >
                <span
                  style={{
                    ...styles.quickIcon,
                    background: "#e0f2fe",
                  }}
                >
                  👤
                </span>

                <span style={styles.quickCopy}>
                  <strong style={styles.quickTitle}>
                    View Customers
                  </strong>
                  <small style={styles.quickText}>
                    Review registered customers.
                  </small>
                </span>

                <span style={styles.quickArrow}>→</span>
              </Link>
            </div>
          </section>

          <footer style={styles.footer}>
            <span>
              © {new Date().getFullYear()} PandiSelvi E-Commerce.
            </span>
            <span>All rights reserved.</span>
          </footer>
        </main>
      </div>
    </>
  );
}

export default Admin;
