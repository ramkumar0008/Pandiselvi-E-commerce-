import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function CategoryCard({ title, icon }) {
  return (
    <Link to="/products" style={styles.link}>
      <div style={styles.categoryCard}>
        <div style={styles.categoryIcon}>{icon}</div>
        <h3 style={styles.cardTitle}>{title}</h3>
        <span style={styles.exploreText}>
          Explore collection →
        </span>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardText}>{text}</p>
    </div>
  );
}

function Home() {
  return (
    <main style={styles.page}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.eyebrow}>
            ✨ YOUR EVERYDAY SHOPPING DESTINATION
          </span>

          <h1 style={styles.heroTitle}>
            Shop Smarter.
            <br />
            <span style={styles.heroHighlight}>
              Live Better.
            </span>
          </h1>

          <p style={styles.heroDescription}>
            Discover quality products, explore your favourite
            collections, and enjoy a better shopping experience
            with PandiSelvi E-Commerce.
          </p>

          <div style={styles.heroActions}>
            <Link to="/products" style={styles.primaryButton}>
              Shop Now <span>→</span>
            </Link>

            <Link to="/account" style={styles.secondaryButton}>
              My Account
            </Link>
          </div>

          <div style={styles.heroTrust}>
            <span>✓ Quality Products</span>
            <span>✓ Easy Shopping</span>
            <span>✓ Customer Support</span>
          </div>
        </div>

        <div style={styles.heroVisual}>
          <div style={styles.heroCircle}>
            <div style={styles.shoppingEmoji}>🛍️</div>
            <div style={styles.floatingCard}>
              <span style={{ fontSize: "25px" }}>✨</span>
              <div>
                <strong>Find Your Style</strong>
                <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                  Something for everyone
                </p>
              </div>
            </div>
            <div style={styles.floatingBadge}>
              Happy Shopping!
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section style={styles.benefits}>
        <div style={styles.benefitItem}>
          <span style={styles.benefitIcon}>🚚</span>
          <div>
            <strong>Convenient Shopping</strong>
            <p>Shop from anywhere</p>
          </div>
        </div>

        <div style={styles.benefitItem}>
          <span style={styles.benefitIcon}>🔐</span>
          <div>
            <strong>Secure Account</strong>
            <p>Your account matters</p>
          </div>
        </div>

        <div style={styles.benefitItem}>
          <span style={styles.benefitIcon}>💬</span>
          <div>
            <strong>Customer Care</strong>
            <p>We're here to help</p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {[
            ["500+", "Products"],
            ["10K+", "Happy Customers"],
            ["4.8 ⭐", "Customer Rating"],
            ["24/7", "Customer Support"],
          ].map(([number, label]) => (
            <div key={label} style={styles.statCard}>
              <h2 style={styles.statNumber}>{number}</h2>
              <p style={styles.statLabel}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <div style={styles.sectionHeading}>
          <span style={styles.sectionEyebrow}>FIND YOUR FAVOURITES</span>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <p style={styles.sectionDescription}>
            Explore collections selected for your everyday needs.
          </p>
        </div>

        <div style={styles.categoryGrid}>
          <CategoryCard title="Electronics" icon="💻" />
          <CategoryCard title="Fashion" icon="👕" />
          <CategoryCard title="Bags" icon="🎒" />
          <CategoryCard title="Home & Living" icon="🏠" />
        </div>

        <div style={styles.centerAction}>
          <Link to="/products" style={styles.darkButton}>
            View All Products →
          </Link>
        </div>
      </section>

      {/* Why choose us */}
      <section style={styles.featuresSection}>
        <div style={styles.section}>
          <div style={styles.sectionHeading}>
            <span style={styles.sectionEyebrow}>THE PANDISELVI EXPERIENCE</span>
            <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
            <p style={styles.sectionDescription}>
              Simple, convenient shopping designed around you.
            </p>
          </div>

          <div style={styles.featureGrid}>
            <FeatureCard
              icon="🚚"
              title="Convenient Delivery"
              text="Enjoy a simple ordering experience and convenient delivery options."
            />
            <FeatureCard
              icon="🔒"
              title="Secure Experience"
              text="Access your account through our authentication system."
            />
            <FeatureCard
              icon="⭐"
              title="Quality Selection"
              text="Explore products across categories for your everyday needs."
            />
            <FeatureCard
              icon="💬"
              title="Customer Support"
              text="Get assistance whenever you need help with your shopping."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaDecoration}>🛍️</div>
        <span style={styles.ctaEyebrow}>YOUR NEXT FAVOURITE IS HERE</span>
        <h2 style={styles.ctaTitle}>
          Ready to Start Shopping?
        </h2>
        <p style={styles.ctaDescription}>
          Explore our collections and find something you love.
        </p>

        <Link to="/products" style={styles.ctaButton}>
          Explore Products <span>→</span>
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerMain}>
          <div style={styles.footerBrand}>
            <Link to="/" style={styles.footerLogo}>
              🛍️ PandiSelvi
            </Link>
            <p style={styles.footerDescription}>
              Making everyday shopping simple, convenient,
              and enjoyable.
            </p>
          </div>

          <div style={styles.footerColumn}>
            <h3 style={styles.footerHeading}>Quick Links</h3>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/products" style={styles.footerLink}>Products</Link>
            <Link to="/cart" style={styles.footerLink}>Shopping Cart</Link>
            <Link to="/account" style={styles.footerLink}>My Account</Link>
          </div>

          <div style={styles.footerColumn}>
            <h3 style={styles.footerHeading}>Shop Categories</h3>
            <Link to="/products" style={styles.footerLink}>Electronics</Link>
            <Link to="/products" style={styles.footerLink}>Fashion</Link>
            <Link to="/products" style={styles.footerLink}>Bags</Link>
            <Link to="/products" style={styles.footerLink}>Home & Living</Link>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p>
            © {new Date().getFullYear()} PandiSelvi E-Commerce.
            All rights reserved.
          </p>
          <span>Made with ❤️ for your shopping needs</span>
        </div>
      </footer>
    </main>
  );
}

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#ffffff",
    color: "#111827",
    fontFamily: "Arial, sans-serif",
    overflowX: "hidden",
  },

  link: {
    textDecoration: "none",
    color: "#111827",
  },

  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "50px",
    padding: "75px 7%",
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    flexWrap: "wrap",
  },

  heroContent: {
    flex: "1 1 420px",
    maxWidth: "650px",
  },

  eyebrow: {
    display: "inline-block",
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.5px",
    lineHeight: 1.8,
  },

  heroTitle: {
    fontSize: "clamp(42px, 6vw, 72px)",
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: "-2px",
    margin: "20px 0",
  },

  heroHighlight: {
    color: "#4f46e5",
  },

  heroDescription: {
    maxWidth: "560px",
    color: "#64748b",
    fontSize: "17px",
    lineHeight: 1.9,
    marginBottom: "28px",
  },

  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "14px",
  },

  primaryButton: {
    display: "inline-flex",
    gap: "14px",
    alignItems: "center",
    justifyContent: "center",
    background: "#4f46e5",
    color: "#ffffff",
    textDecoration: "none",
    padding: "15px 25px",
    borderRadius: "10px",
    fontWeight: 700,
    boxShadow: "0 8px 20px rgba(79,70,229,0.2)",
  },

  secondaryButton: {
    display: "inline-block",
    padding: "14px 22px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    color: "#111827",
    textDecoration: "none",
    fontWeight: 700,
    background: "#ffffff",
  },

  heroTrust: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "30px",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 600,
  },

  heroVisual: {
    flex: "1 1 300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "340px",
  },

  heroCircle: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "min(330px, 75vw)",
    height: "min(330px, 75vw)",
    maxWidth: "330px",
    maxHeight: "330px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c7d2fe, #e0e7ff)",
    border: "15px solid rgba(255,255,255,0.7)",
    boxShadow: "0 25px 70px rgba(79,70,229,0.12)",
  },

  shoppingEmoji: {
    fontSize: "clamp(90px, 15vw, 145px)",
  },

  floatingCard: {
    position: "absolute",
    bottom: "35px",
    left: "-35px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    background: "#ffffff",
    borderRadius: "14px",
    boxShadow: "0 12px 35px rgba(15,23,42,0.12)",
    fontSize: "13px",
  },

  floatingBadge: {
    position: "absolute",
    top: "35px",
    right: "-20px",
    background: "#111827",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  benefits: {
    display: "flex",
    justifyContent: "space-evenly",
    gap: "25px",
    flexWrap: "wrap",
    padding: "28px 5%",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
  },

  benefitItem: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    minWidth: "190px",
  },

  benefitIcon: {
    fontSize: "27px",
  },

  statsSection: {
    padding: "45px 6%",
    background: "#f8fafc",
  },

  statsGrid: {
    maxWidth: "1100px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "18px",
  },

  statCard: {
    textAlign: "center",
    padding: "20px 12px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
  },

  statNumber: {
    fontSize: "30px",
    fontWeight: 900,
    color: "#4f46e5",
    margin: "0 0 8px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },

  section: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "75px 6%",
  },

  sectionHeading: {
    textAlign: "center",
    marginBottom: "40px",
  },

  sectionEyebrow: {
    color: "#4f46e5",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
  },

  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 38px)",
    fontWeight: 900,
    letterSpacing: "-1px",
    margin: "12px 0",
  },

  sectionDescription: {
    color: "#64748b",
    fontSize: "15px",
    lineHeight: 1.8,
  },

  categoryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "20px",
  },

  categoryCard: {
    padding: "30px 18px",
    textAlign: "center",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    boxShadow: "0 5px 20px rgba(15,23,42,0.03)",
  },

  categoryIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "76px",
    height: "76px",
    margin: "0 auto 18px",
    borderRadius: "20px",
    background: "#eef2ff",
    fontSize: "38px",
  },

  cardTitle: {
    fontSize: "17px",
    fontWeight: 800,
    margin: "0 0 10px",
  },

  exploreText: {
    fontSize: "12px",
    color: "#4f46e5",
    fontWeight: 700,
  },

  centerAction: {
    textAlign: "center",
    marginTop: "35px",
  },

  darkButton: {
    display: "inline-block",
    background: "#111827",
    color: "#ffffff",
    padding: "14px 24px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
  },

  featuresSection: {
    background: "#f8fafc",
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  featureCard: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 5px 20px rgba(15,23,42,0.025)",
  },

  featureIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60px",
    height: "60px",
    background: "#eef2ff",
    borderRadius: "16px",
    fontSize: "29px",
    marginBottom: "20px",
  },

  cardText: {
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.8,
    margin: 0,
  },

  ctaSection: {
    position: "relative",
    overflow: "hidden",
    padding: "75px 6%",
    textAlign: "center",
    color: "#ffffff",
    background: "linear-gradient(135deg, #111827, #312e81)",
  },

  ctaDecoration: {
    fontSize: "42px",
    marginBottom: "15px",
  },

  ctaEyebrow: {
    color: "#c7d2fe",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "1.5px",
  },

  ctaTitle: {
    fontSize: "clamp(27px, 4vw, 40px)",
    fontWeight: 900,
    margin: "16px 0",
  },

  ctaDescription: {
    color: "#d1d5db",
    fontSize: "15px",
    lineHeight: 1.8,
    marginBottom: "28px",
  },

  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 25px",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "10px",
    fontWeight: 800,
    textDecoration: "none",
  },

  footer: {
    background: "#030712",
    color: "#d1d5db",
    padding: "55px 6% 20px",
  },

  footerMain: {
    maxWidth: "1200px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "35px",
    paddingBottom: "35px",
  },

  footerBrand: {
    maxWidth: "300px",
  },

  footerLogo: {
    display: "inline-block",
    color: "#ffffff",
    fontSize: "23px",
    fontWeight: 900,
    textDecoration: "none",
  },

  footerDescription: {
    color: "#9ca3af",
    fontSize: "13px",
    lineHeight: 1.9,
    marginTop: "15px",
  },

  footerColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "13px",
  },

  footerHeading: {
    color: "#ffffff",
    fontSize: "14px",
    margin: "0 0 5px",
  },

  footerLink: {
    color: "#9ca3af",
    textDecoration: "none",
    fontSize: "13px",
  },

  footerBottom: {
    maxWidth: "1200px",
    margin: "auto",
    paddingTop: "20px",
    borderTop: "1px solid #1f2937",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    color: "#9ca3af",
    fontSize: "12px",
  },
};

export default Home;
