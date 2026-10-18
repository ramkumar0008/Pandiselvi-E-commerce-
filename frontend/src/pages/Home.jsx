import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function CategoryCard({ title, icon }) {
  return (
    <Link to="/products">
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "28px 20px",
          textAlign: "center",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            fontSize: "40px",
            marginBottom: "12px",
          }}
        >
          {icon}
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.2px",
            fontFamily: "Poppins, Arial, sans-serif",
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
        background: "white",
        padding: "28px",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontSize: "34px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "8px",
          fontFamily: "Poppins, Arial, sans-serif",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#6b7280",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: 1.7,
          fontFamily: "Poppins, Arial, sans-serif",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          background: "#111827",
          color: "white",
          padding: "90px 5%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: "#93c5fd",
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            ✨ Welcome to PandiSelvi
          </span>

          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-2px",
              margin: "18px 0",
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            Shop Smarter.
            <br />
            Live Better.
          </h1>

          <p
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: 1.8,
              color: "#d1d5db",
              maxWidth: "650px",
              margin: "0 auto 30px",
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            Discover quality products, amazing deals and
            everything you need for your modern lifestyle.
          </p>

          <Link to="/products">
            <button
              style={{
                background: "white",
                color: "#111827",
                border: "none",
                padding: "14px 28px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Shop Now →
            </button>
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        style={{
          padding: "55px 5%",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            textAlign: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              500+
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Products
            </p>
          </div>

          <div>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              10K+
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Happy Customers
            </p>
          </div>

          <div>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              4.8 ⭐
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Customer Rating
            </p>
          </div>

          <div>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              24/7
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Support
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        style={{
          padding: "70px 5%",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "35px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.7px",
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Shop by Category
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
                fontWeight: 400,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Explore our popular categories
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px",
            }}
          >
            <CategoryCard
              title="Electronics"
              icon="💻"
            />

            <CategoryCard
              title="Fashion"
              icon="👕"
            />

            <CategoryCard
              title="Bags"
              icon="🎒"
            />

            <CategoryCard
              title="Home"
              icon="🏠"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          padding: "70px 5%",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "35px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 800,
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Why Choose Us?
            </h2>

            <p
              style={{
                color: "#6b7280",
                fontSize: "15px",
                fontFamily: "Poppins, Arial, sans-serif",
              }}
            >
              Shopping made simple and reliable
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
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

      {/* CTA Section */}
      <section
        style={{
          padding: "70px 5%",
          background: "#111827",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "34px",
            fontWeight: 800,
            letterSpacing: "-0.7px",
            fontFamily: "Poppins, Arial, sans-serif",
          }}
        >
          Ready to Start Shopping?
        </h2>

        <p
          style={{
            color: "#d1d5db",
            fontSize: "15px",
            fontWeight: 400,
            margin: "12px 0 25px",
            fontFamily: "Poppins, Arial, sans-serif",
          }}
        >
          Find something you love today.
        </p>

        <Link to="/products">
          <button
            style={{
              background: "white",
              color: "#111827",
              border: "none",
              padding: "14px 28px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "Poppins, Arial, sans-serif",
            }}
          >
            Explore Products
          </button>
        </Link>
      </section>
    </>
  );
}

export default Home;