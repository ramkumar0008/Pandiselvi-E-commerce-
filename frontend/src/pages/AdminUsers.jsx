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

          <div style={styles.count}>
            <strong>{users.length}</strong>
            <span> Total Accounts</span>
          </div>
        </header>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Registered Accounts</h2>
              <p style={styles.subtitle}>
                Search and filter users in your database.
              </p>
            </div>
            <span style={styles.icon}>👥</span>
          </div>

          <div style={styles.toolbar}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              style={styles.search}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All accounts</option>
              <option value="Admin">Admins</option>
              <option value="Customer">Customers</option>
            </select>
          </div>

          {loading ? (
            <p style={styles.message}>Loading accounts...</p>
          ) : error ? (
            <div style={styles.error}>
              <p>{error}</p>
              <button
                style={styles.button}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <p style={styles.message}>
              {users.length === 0
                ? "No registered accounts found."
                : "No accounts match your search."}
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
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
                          <strong>
                            {user.name || "Unnamed User"}
                          </strong>
                        </div>
                      </td>

                      <td style={styles.td}>
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
              Showing {filteredUsers.length} of {users.length} accounts
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} PandiSelvi E-Commerce
        </footer>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "85vh",
    background: "#f5f7fb",
    padding: "35px 5%",
    fontFamily: "Poppins, Arial, sans-serif",
    color: "#111827",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
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
  count: {
    background: "#111827",
    color: "white",
    padding: "13px 18px",
    borderRadius: 10,
    fontSize: 13,
  },
  panel: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 15,
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(15,23,42,0.04)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: 24,
    borderBottom: "1px solid #e5e7eb",
  },
  panelTitle: {
    fontSize: 18,
    margin: "0 0 7px",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#dbeafe",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
  },
  toolbar: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    padding: 20,
  },
  search: {
    flex: "1 1 240px",
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
    fontSize: 14,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: 13,
  },
  th: {
    padding: "16px 20px",
    background: "#f9fafb",
    color: "#6b7280",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "16px 20px",
    borderTop: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  customer: {
    display: "flex",
    alignItems: "center",
    gap: 11,
  },
  avatar: {
    width: 36,
    height: 36,
    flexShrink: 0,
    borderRadius: "50%",
    background: "#e5e7eb",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
  },
  adminBadge: {
    background: "#ede9fe",
    color: "#5b21b6",
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
  },
  customerBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
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
  button: {
    padding: "10px 16px",
    background: "#111827",
    color: "white",
    border: 0,
    borderRadius: 8,
    cursor: "pointer",
  },
  tableFooter: {
    padding: 16,
    borderTop: "1px solid #e5e7eb",
    color: "#6b7280",
    fontSize: 12,
  },
  footer: {
    textAlign: "center",
    padding: "25px 0",
    color: "#9ca3af",
    fontSize: 12,
  },
};

export default AdminUsers;
