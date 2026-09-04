import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Leaf, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  ShieldCheck
} from "lucide-react";
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
      setErrorMsg("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerUser(name.trim(), email.trim(), password);
        if (res.success) {
          setSuccessMsg("Account created successfully! Please sign in with your credentials.");
          setIsRegister(false);
          setPassword("");
        } else {
          setErrorMsg(res.message || "Registration could not be completed.");
        }
      } else {
        const res = await loginUser(email.trim(), password);
        if (res.success && res.data) {
          localStorage.setItem("plantai_user", JSON.stringify(res.data));
          navigate("/dashboard");
        } else {
          setErrorMsg(res.message || "Invalid email or password.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMsg("Unable to connect to the authentication server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card-container">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <Link to="/" className="auth-brand-link">
            <div className="auth-brand-icon">
              <Leaf size={22} />
            </div>
            <span className="auth-brand-title">Plant<span>AI</span></span>
          </Link>
          <h2 className="auth-title">
            {isRegister ? "Create your account" : "Welcome back to PlantAI"}
          </h2>
          <p className="auth-subtitle">
            {isRegister
              ? "Join PlantAI to manage your botanical collection and diagnostic history."
              : "Enter your credentials to access your plant intelligence workspace."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs-toggle">
          <button
            type="button"
            className={`auth-toggle-tab ${!isRegister ? "active" : ""}`}
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
            className={`auth-toggle-tab ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
          >
            Register Account
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="alert-banner alert-error" style={{ marginBottom: "20px" }}>
            <AlertTriangle size={18} />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="alert-banner alert-success" style={{ marginBottom: "20px" }}>
            <CheckCircle2 size={18} />
            <div>{successMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="form-field-group">
              <label className="form-field-label">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="field-leading-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Dr. Eleanor Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-field-group">
            <label className="form-field-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-leading-icon" />
              <input
                type="email"
                className="auth-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-field-group">
            <label className="form-field-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-leading-icon" />
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Authenticating...</span>
              </>
            ) : isRegister ? (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Sign In to PlantAI</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-card-footer">
          <ShieldCheck size={16} className="text-emerald" />
          <span>Secure authentication with bcrypt salted hash encryption</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
