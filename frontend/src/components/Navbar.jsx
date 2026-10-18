import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const ADMIN_UID = "eC1ZpLQ8yUPNUTLDlN780QU52oy2";

  // Read the saved user whenever the route changes.
  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    } catch {
      setUser(null);
    }
    setMenuOpen(false);
  }, [location.pathname]);

  const isAdmin =
    user?.firebaseUid === ADMIN_UID ||
    user?.uid === ADMIN_UID;

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#fbbf24" : "#f9fafb",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    padding: "10px 12px",
    borderRadius: "8px",
    transition: "background 0.2s ease",
    whiteSpace: "nowrap",
  });

  return (
    <>
      <nav style={styles.navbar}>
        <Link to="/" style={styles.brand}>
          <span style={styles.logo}>P</span>
          <span>PandiSelvi</span>
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={styles.menuButton}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div
          style={{
            ...styles.links,
            ...(menuOpen ? styles.mobileLinksOpen : {}),
          }}
          className="pandiselvi-navbar-links"
        >
          <Link to="/" style={linkStyle("/")}>Home</Link>
          <Link to="/products" style={linkStyle("/products")}>Products</Link>
          <Link to="/cart" style={linkStyle("/cart")}>Cart</Link>
          <Link to="/account" style={linkStyle("/account")}>Account</Link>

          {user && isAdmin && (
            <Link to="/admin" style={linkStyle("/admin")}>Admin</Link>
          )}

          {user ? (
            <span style={styles.greeting}>
              Hi, {user.name || user.email || "User"}
            </span>
          ) : (
            <Link to="/login" style={styles.loginButton}>Login</Link>
          )}
        </div>
      </nav>

      <style>{`
        .pandiselvi-navbar-links a {
          text-decoration: none;
        }

        .pandiselvi-navbar-links a:hover {
          background: #374151;
        }

        @media (max-width: 760px) {
          .pandiselvi-navbar-links {
            display: none !important;
          }

          .pandiselvi-navbar-links.mobile-open {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    boxSizing: "border-box",
    background: "#111827",
    color: "#fff",
    padding: "14px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    fontFamily: "Arial, sans-serif",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#fff",
    textDecoration: "none",
    fontSize: "25px",
    fontWeight: 800,
    letterSpacing: "-0.7px",
  },
  logo: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    background: "#fbbf24",
    color: "#111827",
    fontSize: "22px",
  },
  links: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "8px",
    flexWrap: "wrap",
  },
  mobileLinksOpen: {
    display: "flex",
  },
  menuButton: {
    display: "none",
    padding: "8px 12px",
    border: "1px solid #4b5563",
    borderRadius: "8px",
    background: "#1f2937",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
  },
  greeting: {
    color: "#d1d5db",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px",
  },
  loginButton: {
    color: "#111827",
    background: "#fbbf24",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
};

export default Navbar;