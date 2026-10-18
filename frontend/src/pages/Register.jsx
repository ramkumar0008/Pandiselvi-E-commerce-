import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://pandiselvi-e-commerce.onrender.com/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (
      !name ||
      !email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let firebaseUser = null;

    try {
      setLoading(true);

      // 1. Create the Firebase account.
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        form.password
      );

      firebaseUser = credential.user;

      // 2. Save the display name in Firebase.
      await updateProfile(firebaseUser, {
        displayName: name,
      });

      // 3. Get a fresh Firebase ID token.
      const token = await firebaseUser.getIdToken(true);

      // 4. Create the MongoDB profile through the backend.
      const response = await axios.post(
        `${API_URL}/auth/profile`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data?.success || !response.data?.user) {
        throw new Error(
          response.data?.message ||
            "Unable to save the user profile."
        );
      }

      // 5. Store the returned profile.
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      localStorage.removeItem("token");

      setSuccess("Registration successful!");

      // 6. Navigate to the account page.
      navigate("/account", { replace: true });
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data || err.code || err.message
      );

      // If the Firebase account was created but profile creation failed,
      // keep the Firebase account so the user can log in again.
      if (firebaseUser) {
        try {
          await signOut(auth);
        } catch (signOutError) {
          console.error("Sign-out error:", signOutError.message);
        }
      }

      const code = err.code;
      const serverMessage = err.response?.data?.message;

      if (code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else if (code === "auth/operation-not-allowed") {
        setError(
          "Email/password registration is disabled in Firebase Console."
        );
      } else if (err.response?.status === 401) {
        setError(
          serverMessage ||
            "The backend could not verify your Firebase token."
        );
      } else if (err.response) {
        setError(
          serverMessage ||
            "Unable to save your profile in the database."
        );
      } else {
        setError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "50px 20px",
          background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
        }}
      >
        <form
          onSubmit={handleRegister}
          style={{
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "460px",
            background: "#ffffff",
            padding: "40px",
            borderRadius: "22px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.09)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div style={{ fontSize: "45px", marginBottom: "10px" }}>
              ✨
            </div>

            <h1
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#111827",
                margin: 0,
              }}
            >
              Create Account
            </h1>

            <p
              style={{
                color: "#6b7280",
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              Join the PandiSelvi shopping community
            </p>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                color: "#b91c1c",
                background: "#fee2e2",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "18px",
                fontSize: "13px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              style={{
                color: "#166534",
                background: "#dcfce7",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "18px",
                fontSize: "13px",
              }}
            >
              {success}
            </div>
          )}

          <label htmlFor="name" style={labelStyle}>
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />

          <label htmlFor="email" style={labelStyle}>
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <label htmlFor="password" style={labelStyle}>
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password (minimum 6 characters)"
            autoComplete="new-password"
            minLength={6}
            required
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
          />

          <label htmlFor="confirmPassword" style={labelStyle}>
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            minLength={6}
            required
            value={form.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#6b7280" : "#111827",
              color: "#ffffff",
              border: "none",
              borderRadius: "9px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "5px",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "22px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#2563eb",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </p>
        </form>
      </main>
    </>
  );
}

const labelStyle = {
  display: "block",
  color: "#374151",
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "7px",
};

const inputStyle = {
  boxSizing: "border-box",
  display: "block",
  width: "100%",
  padding: "14px",
  marginBottom: "17px",
  border: "1px solid #d1d5db",
  borderRadius: "9px",
  fontSize: "14px",
  outlineColor: "#6366f1",
};

export default Register;
