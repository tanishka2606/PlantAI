import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Leaf, 
  Scan, 
  Activity, 
  Sprout, 
  BookOpen, 
  Bot, 
  LayoutDashboard, 
  User, 
  LogOut, 
  Menu, 
  X,
  ArrowRight
} from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu on route change
    setMobileMenuOpen(false);

    // Refresh user state
    const savedUser = localStorage.getItem("plantai_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("plantai_user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <Leaf className="brand-leaf-icon" size={20} />
          </div>
          <span className="brand-name">
            Plant<span>AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} end>
            Home
          </NavLink>
          <NavLink to="/scanner" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Plant Scanner
          </NavLink>
          <NavLink to="/health" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Plant Health
          </NavLink>
          <NavLink to="/seed-identification" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Seed ID
          </NavLink>
          <NavLink to="/details" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Care Guide
          </NavLink>
          <NavLink to="/assistant" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Assistant
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>
        </nav>

        {/* Desktop Right Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-profile-badge">
              <div className="user-avatar">
                <User size={15} />
              </div>
              <span className="user-name">{user.name || user.email?.split("@")[0]}</span>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="auth-actions-group">
              <Link to="/login" className="btn-nav-login">
                Login
              </Link>
              <Link to="/scanner" className="btn btn-primary btn-sm btn-get-started">
                <span>Get Started</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <Link to="/" className="navbar-brand">
                <div className="brand-icon-wrapper">
                  <Leaf size={18} />
                </div>
                <span className="brand-name">Plant<span>AI</span></span>
              </Link>
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-list">
              <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`} end>
                <Leaf size={18} />
                <span>Home</span>
              </NavLink>
              <NavLink to="/scanner" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
                <Scan size={18} />
                <span>Plant Scanner</span>
              </NavLink>
              <NavLink to="/health" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
                <Activity size={18} />
                <span>Plant Health</span>
              </NavLink>
              <NavLink to="/seed-identification" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
                <Sprout size={18} />
                <span>Seed ID</span>
              </NavLink>
              <NavLink to="/details" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
                <BookOpen size={18} />
                <span>Care Guide</span>
              </NavLink>
              <NavLink to="/assistant" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
                <Bot size={18} />
                <span>AI Assistant</span>
              </NavLink>
              <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </nav>

            <div className="mobile-drawer-footer">
              {user ? (
                <div className="mobile-user-row">
                  <div className="mobile-user-info">
                    <User size={16} />
                    <span>{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-logout-mobile">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/login" className="btn btn-outline" style={{ width: "100%" }}>
                    Login
                  </Link>
                  <Link to="/scanner" className="btn btn-primary" style={{ width: "100%" }}>
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
