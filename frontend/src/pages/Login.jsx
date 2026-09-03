import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import "./Login.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(name.trim(), email.trim(), password);
        if (res.success) {
          setSuccessMsg("Account created successfully! Please sign in.");
          setIsRegister(false);
          setPassword("");
        } else {
          setErrorMsg(res.message || "Registration failed.");
        }
      } else {
        const res = await loginUser(email.trim(), password);
        if (res.success && res.data) {
          localStorage.setItem("plantai_user", JSON.stringify(res.data));
          navigate("/");
          window.location.reload();
        } else {
          setErrorMsg(res.message || "Invalid credentials.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg("Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <header className="page-header" style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "36px" }}>🌱</span>
          <h1 className="page-title" style={{ fontSize: "28px", marginTop: "8px" }}>
            {isRegister ? "Join PlantAI" : "Welcome Back"}
          </h1>
          <p className="page-subtitle">
            {isRegister
              ? "Create your free account to track your plant collection"
              : "Sign in to access personalized plant care & diagnostics"}
          </p>
        </header>

        <div className="plant-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${!isRegister ? "active" : ""}`}
              onClick={() => {
                setIsRegister(false);
                setErrorMsg("");
                setSuccessMsg("");
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${isRegister ? "active" : ""}`}
              onClick={() => {
                setIsRegister(true);
                setErrorMsg("");
                setSuccessMsg("");
              }}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div className="alert-banner alert-error" style={{ marginBottom: "18px" }}>
              <span>⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="alert-banner alert-info" style={{ marginBottom: "18px" }}>
              <span>✅</span>
              <div>{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sarita / Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", marginTop: "10px" }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Processing...</span>
                </>
              ) : isRegister ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
