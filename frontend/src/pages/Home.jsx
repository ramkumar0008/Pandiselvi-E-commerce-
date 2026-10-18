import { Link } from "react-router-dom";

function CategoryCard({ title, icon }) {
  return (
    <Link
      to="/products"
      style={{
        textDecoration: "none",
        color: "#111827",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "28px 20px",
          textAlign: "center",
          border: "1px solid #e5e7eb",
          transition: "transform 0.2s ease",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>
          {icon}
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            margin: 0,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {title}
        </h3>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "28px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontSize: "34px", marginBottom: "12px" }}>
        {icon}
      </div>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: 700,
          margin: "0 0 8px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#6b7280",
          fontSize: "14px",
          lineHeight: 1.7,
          margin: 0,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function Home() {
  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#ffffff",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Temporary diagnostic heading */}
      <div
        style={{
          padding: "12px",
          background: "#e0f2fe",
          color: "#075985",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        PandiSelvi E-Commerce — Home Page Loaded
      </div>

      {/* Hero Section */}
      <section
        style={{
          background: "#111827",
          color: "#ffffff",
          padding: "90px 5%",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "auto" }}>
          <span style={{ fontSize: "14px", color: "#93c5fd" }}>
            ✨ Welcome to PandiSelvi
          </span>

          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-2px",
              margin: "18px 0",
            }}
          >
            Shop Smarter.
            <br />
            Live Better.
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.8,
              color: "#d1d5db",
              maxWidth: "650px",
              margin: "0 auto 30px",
            }}
          >
            Discover quality products, amazing deals and
            everything you need for your modern lifestyle.
          </p>

          <Link to="/products" style={{ textDecoration: "none" }}>
            <button
              type="button"
              style={{
                background: "#ffffff",
                color: "#111827",
                border: "none",
                padding: "14px 28px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Shop Now →
            </button>
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section style={{ padding: "55px 5%", background: "#f8fafc" }}>
        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            textAlign: "center",
          }}
        >
          {[
            ["500+", "Products"],
            ["10K+", "Happy Customers"],
            ["4.8 ⭐", "Customer Rating"],
            ["24/7", "Support"],
          ].map(([number, label]) => (
            <div key={label}>
              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: 800,
                  margin: "0 0 8px",
                }}
              >
                {number}
              </h2>
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "70px 5%" }}>
        <div style={{ maxWidth: "1100px", margin: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800 }}>
              Shop by Category
            </h2>
            <p style={{ color: "#6b7280", fontSize: "15px" }}>
              Explore our popular categories
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            <CategoryCard title="Electronics" icon="💻" />
            <CategoryCard title="Fashion" icon="👕" />
            <CategoryCard title="Bags" icon="🎒" />
            <CategoryCard title="Home" icon="🏠" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "70px 5%", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1100px", margin: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800 }}>
              Why Choose Us?
            </h2>
            <p style={{ color: "#6b7280", fontSize: "15px" }}>
              Shopping made simple and reliable
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            <FeatureCard
              icon="🚚"
              title="Fast Delivery"
              text="Get your products delivered quickly and safely."
            />
            <FeatureCard
              icon="🔒"
              title="Secure Payment"
              text="Your shopping experience is safe and secure."
            />
            <FeatureCard
              icon="⭐"
              title="Quality Products"
              text="We provide carefully selected quality products."
            />
            <FeatureCard
              icon="💬"
              title="Customer Support"
              text="Our support team is always ready to help."
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        style={{
          padding: "70px 5%",
          background: "#111827",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800 }}>
          Ready to Start Shopping?
        </h2>

        <p style={{ color: "#d1d5db", fontSize: "15px", margin: "12px 0 25px" }}>
          Find something you love today.
        </p>

        <Link to="/products" style={{ textDecoration: "none" }}>
          <button
            type="button"
            style={{
              background: "#ffffff",
              color: "#111827",
              border: "none",
              padding: "14px 28px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Explore Products
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "22px 5%",
          textAlign: "center",
          background: "#030712",
          color: "#d1d5db",
          fontSize: "13px",
        }}
      >
        © {new Date().getFullYear()} PandiSelvi E-Commerce. All rights reserved.
      </footer>
    </main>
  );
}

export default Home;
