import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();

  // Keep the same admin UID used in your Navbar.
  const ADMIN_UID = "eC1ZpLQ8yUPNUTLDlN780QU52oy2";

  // Read the saved user whenever the route changes.
  useEffect(() => {
    try {
      setUser(
        JSON.parse(localStorage.getItem("user") || "null")
      );
    } catch {
      setUser(null);
    }

    setMenuOpen(false);
  }, [location.pathname]);

  const isAdmin =
    user?.firebaseUid === ADMIN_UID ||
    user?.uid === ADMIN_UID;

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="home-page">
      {/* Responsive Navbar */}
      <header className="home-navbar">
        <Link to="/" className="home-logo" onClick={closeMenu}>
          🛍️ <span>PandiSelvi</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="home-navigation"
        >
          <span>{menuOpen ? "✕" : "☰"}</span>
        </button>

        <nav
          id="home-navigation"
          className={`home-nav-links ${
            menuOpen ? "menu-open" : ""
          }`}
        >
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/products" onClick={closeMenu}>
            Products
          </Link>

          <Link to="/cart" onClick={closeMenu}>
            Cart
          </Link>

          <Link to="/account" onClick={closeMenu}>
            My Account
          </Link>

          {/* Admin option appears only for the admin user */}
          {user && isAdmin && (
            <Link
              to="/admin"
              onClick={closeMenu}
              className="home-admin-link"
            >
              🛡️ Admin
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            ✨ YOUR EVERYDAY SHOPPING DESTINATION
          </span>

          <h1 className="hero-title">
            Shop Smarter.
            <br />
            <span>Live Better.</span>
          </h1>

          <p className="hero-description">
            Discover quality products, explore your favourite
            collections, and enjoy a better shopping experience
            with PandiSelvi E-Commerce.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-button">
              Shop Now <span>→</span>
            </Link>

            <Link to="/account" className="secondary-button">
              My Account
            </Link>
          </div>

          <div className="hero-trust">
            <span>✓ Quality Products</span>
            <span>✓ Easy Shopping</span>
            <span>✓ Customer Support</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-circle">
            <div className="shopping-emoji">🛍️</div>

            <div className="floating-card">
              <span className="floating-icon">✨</span>
              <div>
                <strong>Find Your Style</strong>
                <p>Something for everyone</p>
              </div>
            </div>

            <div className="floating-badge">
              Happy Shopping!
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="benefit-item">
          <span>🚚</span>
          <div>
            <strong>Convenient Shopping</strong>
            <p>Shop from anywhere</p>
          </div>
        </div>

        <div className="benefit-item">
          <span>🔐</span>
          <div>
            <strong>Secure Account</strong>
            <p>Your account matters</p>
          </div>
        </div>

        <div className="benefit-item">
          <span>💬</span>
          <div>
            <strong>Customer Care</strong>
            <p>We're here to help</p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            ["500+", "Products"],
            ["10K+", "Happy Customers"],
            ["4.8 ⭐", "Customer Rating"],
            ["24/7", "Customer Support"],
          ].map(([number, label]) => (
            <div className="stat-card" key={label}>
              <h2>{number}</h2>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-heading">
          <span className="section-eyebrow">
            FIND YOUR FAVOURITES
          </span>
          <h2>Shop by Category</h2>
          <p>
            Explore collections selected for your everyday needs.
          </p>
        </div>

        <div className="category-grid">
          {[
            ["💻", "Electronics"],
            ["👕", "Fashion"],
            ["🎒", "Bags"],
            ["🏠", "Home & Living"],
          ].map(([icon, title]) => (
            <Link
              to="/products"
              className="category-card"
              key={title}
            >
              <div className="category-icon">{icon}</div>
              <h3>{title}</h3>
              <span>Explore collection →</span>
            </Link>
          ))}
        </div>

        <div className="center-action">
          <Link to="/products" className="dark-button">
            View All Products →
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="features-section">
        <div className="section">
          <div className="section-heading">
            <span className="section-eyebrow">
              THE PANDISELVI EXPERIENCE
            </span>
            <h2>Why Choose Us?</h2>
            <p>
              Simple, convenient shopping designed around you.
            </p>
          </div>

          <div className="feature-grid">
            {[
              [
                "🚚",
                "Convenient Delivery",
                "Enjoy a simple ordering experience and convenient delivery options.",
              ],
              [
                "🔒",
                "Secure Experience",
                "Access your account through our authentication system.",
              ],
              [
                "⭐",
                "Quality Selection",
                "Explore products across categories for your everyday needs.",
              ],
              [
                "💬",
                "Customer Support",
                "Get assistance whenever you need help with your shopping.",
              ],
            ].map(([icon, title, text]) => (
              <article className="feature-card" key={title}>
                <div className="feature-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-decoration">🛍️</div>
        <span className="cta-eyebrow">
          YOUR NEXT FAVOURITE IS HERE
        </span>
        <h2>Ready to Start Shopping?</h2>
        <p>
          Explore our collections and find something you love.
        </p>

        <Link to="/products" className="cta-button">
          Explore Products →
        </Link>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              🛍️ PandiSelvi
            </Link>
            <p>
              Making everyday shopping simple, convenient,
              and enjoyable.
            </p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/account">My Account</Link>

            {user && isAdmin && (
              <Link to="/admin">Admin Dashboard</Link>
            )}
          </div>

          <div className="footer-column">
            <h3>Shop Categories</h3>
            <Link to="/products">Electronics</Link>
            <Link to="/products">Fashion</Link>
            <Link to="/products">Bags</Link>
            <Link to="/products">Home & Living</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} PandiSelvi E-Commerce.
            All rights reserved.
          </p>
          <span>
            Made with ❤️ for your shopping needs
          </span>
        </div>
      </footer>
    </main>
  );
}

export default Home;