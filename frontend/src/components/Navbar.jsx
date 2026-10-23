import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const ADMIN_UID = "eC1ZpLQ8yUPNUTLDlN780QU52oy2";

  // Preserve existing saved-user and route-change behavior.
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
    ...styles.navLink,
    color: location.pathname === path ? "#5eead4" : "#e2e8f0",
    background:
      location.pathname === path
        ? "rgba(45, 212, 191, 0.12)"
        : "transparent",
    boxShadow:
      location.pathname === path
        ? "inset 0 -2px 0 #2dd4bf"
        : "none",
  });

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="pandiselvi-header">
      <nav className="pandiselvi-navbar">
        <Link to="/" style={styles.brand} onClick={closeMenu}>
          <span style={styles.logo}>P</span>

          <span className="pandiselvi-brand-text">
            Pandi<span style={{ color: "#5eead4" }}>Selvi</span>
            <small className="pandiselvi-brand-subtitle">
              YOUR EVERYDAY STORE
            </small>
          </span>
        </Link>

        <button
          type="button"
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="pandiselvi-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="pandiselvi-menu-button"
        >
          {menuOpen ? (
            <span className="pandiselvi-close-icon">✕</span>
          ) : (
            <span className="pandiselvi-hamburger">
              <span />
              <span />
              <span />
            </span>
          )}
        </button>

        <div
          id="pandiselvi-navigation"
          className={`pandiselvi-navbar-links ${
            menuOpen ? "mobile-open" : ""
          }`}
        >
          <Link to="/" style={linkStyle("/")} onClick={closeMenu}>
            Home
          </Link>

          <Link
            to="/products"
            style={linkStyle("/products")}
            onClick={closeMenu}
          >
            Products
          </Link>

          <Link
            to="/cart"
            style={linkStyle("/cart")}
            onClick={closeMenu}
          >
            <span className="pandiselvi-nav-icon">🛒</span>
            Cart
          </Link>

          <Link
            to="/account"
            style={linkStyle("/account")}
            onClick={closeMenu}
          >
            Account
          </Link>

          {user && isAdmin && (
            <Link
              to="/admin"
              style={linkStyle("/admin")}
              onClick={closeMenu}
            >
              Admin
            </Link>
          )}

          {user ? (
            <span style={styles.greeting}>
              <span className="pandiselvi-user-icon">●</span>
              Hi, {user.name || user.email || "User"}
            </span>
          ) : (
            <Link
              to="/login"
              style={styles.loginButton}
              onClick={closeMenu}
            >
              Login <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </nav>

      <style>{`
        .pandiselvi-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: #0b1220;
        }

        .pandiselvi-navbar {
          box-sizing: border-box;
          width: 100%;
          min-height: 78px;
          padding: 13px 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          background: linear-gradient(110deg, #0b1220 0%, #13243b 100%);
          color: #f8fafc;
          border-bottom: 1px solid rgba(94, 234, 212, 0.16);
          box-shadow: 0 8px 28px rgba(2, 8, 23, 0.22);
          font-family: Inter, "Segoe UI", Arial, sans-serif;
        }

        .pandiselvi-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          font-size: clamp(20px, 3vw, 24px);
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .pandiselvi-brand-subtitle {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 650;
          letter-spacing: 2px;
        }

        .pandiselvi-navbar-links {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 7px;
          flex-wrap: wrap;
        }

        .pandiselvi-navbar-links a {
          text-decoration: none;
          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .pandiselvi-navbar-links a:hover {
          background: rgba(148, 163, 184, 0.15) !important;
          color: #5eead4 !important;
          transform: translateY(-1px);
        }

        .pandiselvi-navbar-links a[style*="rgb(94, 234, 212)"]:hover {
          box-shadow: inset 0 -2px 0 #2dd4bf;
        }

        .pandiselvi-nav-icon {
          margin-right: 5px;
          font-size: 14px;
        }

        .pandiselvi-user-icon {
          margin-right: 7px;
          color: #2dd4bf;
          font-size: 10px;
        }

        .pandiselvi-menu-button {
          display: none;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          border: 1px solid #334155;
          border-radius: 12px;
          background: #17263a;
          color: #f8fafc;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .pandiselvi-menu-button:hover {
          background: #24364c;
          border-color: #5eead4;
        }

        .pandiselvi-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 22px;
        }

        .pandiselvi-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 2px;
          background: #5eead4;
        }

        .pandiselvi-close-icon {
          color: #5eead4;
          font-size: 23px;
          line-height: 1;
        }

        @media (max-width: 760px) {
          .pandiselvi-navbar {
            padding: 12px 5%;
          }

          .pandiselvi-menu-button {
            display: inline-flex;
          }

          .pandiselvi-navbar-links {
            display: none;
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 7px;
            padding: 13px 0 5px;
            border-top: 1px solid #334155;
            margin-top: 3px;
          }

          .pandiselvi-navbar-links.mobile-open {
            display: flex;
            animation: pandiselvi-menu-in 0.2s ease-out;
          }

          .pandiselvi-navbar-links a {
            box-sizing: border-box;
            width: 100%;
            padding: 13px 14px !important;
            border-radius: 10px;
          }

          .pandiselvi-navbar-links > span {
            padding: 12px 14px !important;
            overflow-wrap: anywhere;
          }
        }

        @keyframes pandiselvi-menu-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 380px) {
          .pandiselvi-navbar {
            padding-left: 4%;
            padding-right: 4%;
          }

          .pandiselvi-brand-subtitle {
            font-size: 8px;
            letter-spacing: 1.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pandiselvi-navbar-links a,
          .pandiselvi-menu-button {
            transition: none;
          }

          .pandiselvi-navbar-links.mobile-open {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}

const styles = {
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    color: "#f8fafc",
    textDecoration: "none",
    whiteSpace: "nowrap",
  },

  logo: {
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "13px",
    background: "linear-gradient(135deg, #5eead4, #14b8a6)",
    color: "#0b1220",
    fontSize: "24px",
    fontWeight: 950,
    boxShadow: "0 4px 15px rgba(45, 212, 191, 0.18)",
  },

  navLink: {
    display: "inline-flex",
    alignItems: "center",
    padding: "11px 13px",
    borderRadius: "9px",
    fontSize: "14px",
    fontWeight: 650,
    whiteSpace: "nowrap",
  },

  greeting: {
    color: "#cbd5e1",
    fontSize: "13px",
    fontWeight: 600,
    padding: "9px 10px",
    overflowWrap: "anywhere",
  },

  loginButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    color: "#0b1220",
    background: "linear-gradient(135deg, #5eead4, #2dd4bf)",
    padding: "11px 19px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 800,
    textDecoration: "none",
    whiteSpace: "nowrap",
    boxShadow: "0 4px 14px rgba(45, 212, 191, 0.13)",
  },
};

export default Navbar;
