import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Authenticate with Firebase
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Step 2: Get Firebase ID token
      const token = await credential.user.getIdToken();

      // Step 3: Save or retrieve the user's MongoDB profile
      const response = await axios.post(
        `${API_URL}/auth/profile`,
        {
          name:
            credential.user.displayName ||
            credential.user.email.split("@")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 4: Save profile locally
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Login successful!");
      navigate("/account");
    } catch (err) {
      // If Firebase login worked but profile saving failed,
      // sign out so the UI doesn't leave a partial login.
      if (auth.currentUser) {
        try {
          await signOut(auth);
        } catch (signOutError) {
          console.error("Sign-out error:", signOutError);
        }
      }

      const code = err.code;

      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 75px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 20px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "430px",
            background: "white",
            padding: "35px",
            borderRadius: "18px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
              textAlign: "center",
              color: "#111827",
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: "14px",
              margin: "8px 0 25px",
            }}
          >
            Login to your PandiSelvi account
          </p>

          {error && (
            <p
              role="alert"
              style={{
                color: "#dc2626",
                background: "#fee2e2",
                padding: "10px",
                borderRadius: "7px",
                fontSize: "13px",
                marginBottom: "15px",
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "13px",
                marginBottom: "13px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                boxSizing: "border-box",
                width: "100%",
                padding: "13px",
                marginBottom: "15px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "#2563eb", fontWeight: 600 }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
