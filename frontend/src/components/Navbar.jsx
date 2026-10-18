import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Your Firebase admin UID
  const ADMIN_UID = "eC1ZpLQ8yUPNUTLDlN780QU52oy2";

  // Show Admin only for the admin account
  const isAdmin =
    user?.firebaseUid === ADMIN_UID ||
    user?.uid === ADMIN_UID;

  return (
    <nav
      style={{
        background: "#111827",
        color: "white",
        padding: "18px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
        fontFamily: "Poppins, Arial, sans-serif",
      }}
    >
      <Link to="/" style={{ color: "white" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.8px",
          }}
        >
          PandiSelvi
        </h2>
      </Link>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "15px",
          fontWeight: 500,
        }}
      >
        <Link to="/" style={{ color: "white" }}>
          Home
        </Link>

        <Link to="/products" style={{ color: "white" }}>
          Products
        </Link>

        <Link to="/cart" style={{ color: "white" }}>
          Cart
        </Link>

        <Link to="/account" style={{ color: "white" }}>
          Account
        </Link>

        {/* Admin link: visible only to the admin account */}
        {user && isAdmin && (
          <Link
            to="/admin"
            style={{ color: "white" }}
          >
            Admin
          </Link>
        )}

        {user ? (
          <span
            style={{
              color: "#d1d5db",
              fontWeight: 600,
            }}
          >
            Hi, {user.name}
          </span>
        ) : (
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
