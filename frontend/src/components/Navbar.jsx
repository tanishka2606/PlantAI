import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("plantai_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("plantai_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
        <span className="logo-icon">🌱</span>
        <span>PlantAI</span>
      </Link>

      <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/scanner"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Plant Scanner
        </NavLink>
        <NavLink
          to="/seed-identification"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Seed Identification
        </NavLink>
        <NavLink
          to="/health"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Plant Health
        </NavLink>
        <NavLink
          to="/details"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Care Guide
        </NavLink>
        <NavLink
          to="/assistant"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        >
          AI Assistant
        </NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <div className="user-badge">
            <span>👤 {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "#dc2626",
                fontSize: "12px",
                marginLeft: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="auth-btn">
            Login
          </Link>
        )}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
