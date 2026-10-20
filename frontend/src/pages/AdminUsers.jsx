import { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
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
          `${API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.users)
            ? data.users
            : [];

        if (!cancelled) {
          setUsers(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load customers. Check your backend API."
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

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();

    const matchesSearch =
      (user.name || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term);

    const matchesFilter =
      filter === "All" ||
      (filter === "Admin" && user.isAdmin === true) ||
      (filter === "Customer" && user.isAdmin !== true);

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <header style={styles.header}>
          <div>
            <p style={styles.eyebrow}>PANDISELVI / ADMIN</p>
            <h1 style={styles.title}>Customer Management</h1>
            <p style={styles.subtitle}>
              Manage and view registered customer accounts.
            </p>
          </div>

          <div style={styles.countCard}>
            <div style={styles.countIcon}>👥</div>
            <div>
              <span style={styles.countLabel}>Total Accounts</span>
              <strong style={styles.countValue}>{users.length}</strong>
            </div>
          </div>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>👤</span>
            <div>
              <p style={styles.statLabel}>All Accounts</p>
              <h2 style={styles.statValue}>{users.length}</h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>🛡️</span>
            <div>
              <p style={styles.statLabel}>Administrators</p>
              <h2 style={styles.statValue}>
                {users.filter((user) => user.isAdmin === true).length}
              </h2>
            </div>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statIcon}>🛍️</span>
            <div>
              <p style={styles.statLabel}>Customers</p>
              <h2 style={styles.statValue}>
                {users.filter((user) => user.isAdmin !== true).length}
              </h2>
            </div>
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <p style={styles.sectionEyebrow}>ACCOUNT DIRECTORY</p>
              <h2 style={styles.panelTitle}>Registered Accounts</h2>
              <p style={styles.subtitle}>
                Search and filter users in your database.
              </p>
            </div>

            <span style={styles.icon}>👥</span>
          </div>

          <div style={styles.toolbar}>
            <div style={styles.searchWrap}>
              <span style={styles.searchIcon}>⌕</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                style={styles.search}
                aria-label="Search name or email"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
              aria-label="Filter accounts by type"
            >
              <option value="All">All accounts</option>
              <option value="Admin">Admins</option>
              <option value="Customer">Customers</option>
            </select>
          </div>

          {loading ? (
            <div style={styles.messageBox}>
              <div style={styles.spinner} />
              <p style={styles.message}>Loading accounts...</p>
            </div>
          ) : error ? (
            <div style={styles.error}>
              <span style={styles.errorIcon}>!</span>
              <p style={styles.errorText}>{error}</p>
              <button
                style={styles.button}
                onClick={() => window.location.reload()}
              >
                ↻ Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={styles.messageBox}>
              <div style={styles.emptyIcon}>🔎</div>
              <h3 style={styles.emptyTitle}>No accounts found</h3>
              <p style={styles.message}>
                {users.length === 0
                  ? "No registered accounts found."
                  : "No accounts match your search."}
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Email Address</th>
                    <th style={styles.th}>Account Type</th>
                    <th style={styles.th}>Registered Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id || user.firebaseUid || user.email}>
                      <td style={styles.td}>
                        <div style={styles.customer}>
                          <span style={styles.avatar}>
                            {(user.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <div style={styles.customerInfo}>
                            <strong style={styles.customerName}>
                              {user.name || "Unnamed User"}
                            </strong>
                            <span style={styles.customerCaption}>
                              Registered account
                            </span>
                          </div>
                        </div>
                      </td>

                      <td style={styles.emailCell}>
                        {user.email || "—"}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={
                            user.isAdmin === true
                              ? styles.adminBadge
                              : styles.customerBadge
                          }
                        >
                          {user.isAdmin === true
                            ? "Admin"
                            : "Customer"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div style={styles.tableFooter}>
              <span>
                Showing <strong>{filteredUsers.length}</strong> of{" "}
                <strong>{users.length}</strong> accounts
              </span>
              <span style={styles.footerDot}>●</span>
              <span>Account directory</span>
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} PandiSelvi E-Commerce
          <span style={styles.footerDivider}> · </span>
          Admin Panel
        </footer>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "85vh",
    background: "#f4f6fb",
    padding: "clamp(20px, 4vw, 48px)",
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    color: "#172033",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "28px",
  },
  eyebrow: {
    color: "#6366f1",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
    margin: "0 0 10px",
  },
  title: {
    fontSize: "clamp(26px, 3vw, 36px)",
    fontWeight: 800,
    letterSpacing: "-1px",
    color: "#111827",
    margin: "0 0 10px",
    lineHeight: 1.2,
  },
  subtitle: {
    color: "#778196",
    fontSize: "14px",
    margin: 0,
    lineHeight: 1.7,
  },
  countCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    background: "linear-gradient(135deg, #4338ca, #6366f1)",
    color: "#ffffff",
    padding: "17px 22px",
    borderRadius: "15px",
    boxShadow: "0 8px 22px rgba(79, 70, 229, 0.18)",
  },
  countIcon: {
    width: "43px",
    height: "43px",
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    fontSize: "21px",
  },
  countLabel: {
    display: "block",
    fontSize: "11px",
    opacity: 0.85,
    marginBottom: "5px",
  },
  countValue: {
    display: "block",
    fontSize: "25px",
    lineHeight: 1.2,
    fontWeight: 800,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
    gap: "18px",
    marginBottom: "26px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: "15px",
    padding: "21px",
    boxShadow: "0 6px 20px rgba(31, 41, 55, 0.035)",
  },
  statIcon: {
    width: "47px",
    height: "47px",
    flexShrink: 0,
    borderRadius: "13px",
    background: "#eef2ff",
    display: "grid",
    placeItems: "center",
    fontSize: "21px",
  },
  statLabel: {
    color: "#778196",
    fontSize: "12px",
    fontWeight: 650,
    margin: "0 0 7px",
  },
  statValue: {
    color: "#172033",
    fontSize: "25px",
    fontWeight: 800,
    margin: 0,
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e7eaf2",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(31, 41, 55, 0.045)",
    minWidth: 0,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "clamp(18px, 3vw, 28px)",
    borderBottom: "1px solid #edf0f6",
  },
  sectionEyebrow: {
    color: "#818cf8",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "1.6px",
    margin: "0 0 8px",
  },
  panelTitle: {
    fontSize: "21px",
    fontWeight: 750,
    color: "#111827",
    margin: "0 0 8px",
  },
  icon: {
    width: "48px",
    height: "48px",
    flexShrink: 0,
    borderRadius: "14px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "grid",
    placeItems: "center",
    fontSize: "23px",
  },
  toolbar: {
    display: "flex",
    gap: "13px",
    flexWrap: "wrap",
    padding: "22px",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: "1 1 260px",
    minWidth: 0,
    padding: "0 14px",
    border: "1px solid #dce1eb",
    borderRadius: "10px",
    background: "#fbfcff",
    boxSizing: "border-box",
  },
  searchIcon: {
    fontSize: "25px",
    lineHeight: 1,
    color: "#8791a3",
  },
  search: {
    flex: 1,
    minWidth: 0,
    padding: "13px 0",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#172033",
    background: "transparent",
  },
  select: {
    padding: "13px 15px",
    border: "1px solid #dce1eb",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#374151",
    fontSize: "14px",
    outlineColor: "#6366f1",
    minWidth: "155px",
    boxSizing: "border-box",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    textAlign: "left",
    fontSize: "13px",
    background: "#ffffff",
  },
  th: {
    padding: "17px 20px",
    background: "#f7f8fc",
    color: "#596579",
    borderTop: "1px solid #edf0f6",
    borderBottom: "1px solid #e7eaf2",
    whiteSpace: "nowrap",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "17px 20px",
    borderBottom: "1px solid #f0f2f7",
    color: "#374151",
    verticalAlign: "middle",
  },
  customer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "190px",
  },
  customerInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  customerName: {
    color: "#172033",
    fontSize: "13px",
    fontWeight: 750,
  },
  customerCaption: {
    color: "#98a1b2",
    fontSize: "11px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    borderRadius: "12px",
    background: "#eef2ff",
    color: "#4338ca",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    fontSize: "15px",
  },
  emailCell: {
    padding: "17px 20px",
    borderBottom: "1px solid #f0f2f7",
    color: "#596579",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  adminBadge: {
    display: "inline-block",
    background: "#ede9fe",
    color: "#6d28d9",
    border: "1px solid #ddd6fe",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 750,
  },
  customerBadge: {
    display: "inline-block",
    background: "#ecfdf5",
    color: "#047857",
    border: "1px solid #a7f3d0",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 750,
  },
  messageBox: {
    padding: "42px 20px",
    textAlign: "center",
  },
  message: {
    margin: "10px 0 0",
    color: "#778196",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  error: {
    padding: "35px 20px",
    textAlign: "center",
    color: "#be123c",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  errorIcon: {
    display: "grid",
    placeItems: "center",
    width: "35px",
    height: "35px",
    margin: "0 auto 12px",
    borderRadius: "50%",
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    fontWeight: 800,
  },
  errorText: {
    margin: "0 0 12px",
  },
  button: {
    padding: "11px 18px",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    color: "#ffffff",
    border: 0,
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: 700,
  },
  spinner: {
    width: "30px",
    height: "30px",
    margin: "0 auto",
    border: "3px solid #e0e7ff",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
  },
  emptyIcon: {
    fontSize: "35px",
    marginBottom: "10px",
  },
  emptyTitle: {
    color: "#172033",
    fontSize: "17px",
    margin: "0",
  },
  tableFooter: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    padding: "17px 22px",
    borderTop: "1px solid #edf0f6",
    background: "#fbfcff",
    color: "#778196",
    fontSize: "12px",
  },
  footerDot: {
    color: "#c7d2fe",
    fontSize: "8px",
  },
  footer: {
    textAlign: "center",
    padding: "28px 0 10px",
    color: "#98a1b2",
    fontSize: "12px",
  },
  footerDivider: {
    color: "#c7d2fe",
  },
};

export default AdminUsers;
