import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Scan, 
  Activity, 
  Sprout, 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Lightbulb, 
  ChevronRight, 
  BookOpen,
  Calendar,
  Layers,
  Leaf
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentScans, setRecentScans] = useState([
    {
      id: 1,
      name: "Guava (Psidium guajava)",
      type: "Seed Identification",
      confidence: "78.3%",
      status: "Identified",
      date: "Today, 10:45 PM"
    },
    {
      id: 2,
      name: "Hibiscus rosa-sinensis",
      type: "Plant Scanner",
      confidence: "94.2%",
      status: "Identified",
      date: "Yesterday, 4:20 PM"
    },
    {
      id: 3,
      name: "Foliar Chlorosis",
      type: "Health Check",
      confidence: "73.0%",
      status: "Possible Disease",
      date: "Sep 3, 2026"
    }
  ]);

  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    {
      title: "Morning Base Watering",
      text: "Always water plants at their soil base early in the morning. This prevents fungal spore activation and allows roots to absorb moisture before midday evaporation."
    },
    {
      title: "The Finger Soil Test",
      text: "Before watering houseplants, insert your finger 1-2 inches into the potting soil. If it feels cool and moist, delay watering for another 2-3 days to prevent root rot."
    },
    {
      title: "Leaf Dusting for Photosynthesis",
      text: "Wiping large tropical leaves with a damp cloth monthly removes ambient dust buildup, increasing sunlight absorption and photosynthetic efficiency by up to 25%."
    },
    {
      title: "Organic Neem Oil Application",
      text: "Apply diluted cold-pressed Neem oil (5ml/L water) in the late evening. Daytime spraying under direct sun can cause phototoxic leaf scorching."
    }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("plantai_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }

    // Interval for rotating tip
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentTip = tips[tipIndex];

  return (
    <div className="page-container dashboard-page-container">
      {/* Welcome Banner */}
      <section className="dashboard-welcome-banner">
        <div className="welcome-text-col">
          <div className="page-badge">
            <Sparkles size={14} />
            <span>Botanical Workspace</span>
          </div>
          <h1 className="welcome-heading">
            {user ? `Welcome back, ${user.name}` : "Your Plant Intelligence"}
          </h1>
          <p className="welcome-desc">
            Monitor specimen scans, review foliar health records, and access personalized horticultural care guidelines.
          </p>
        </div>

        <div className="welcome-stats-col">
          <div className="stat-pill">
            <span className="stat-num">30+</span>
            <span className="stat-label">Species Profiles</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">4</span>
            <span className="stat-label">AI Pipelines</span>
          </div>
          <div className="stat-pill">
            <span className="stat-num">100%</span>
            <span className="stat-label">Verified Data</span>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid per Section 27 */}
      <section className="dashboard-section">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {/* Scan Plant */}
          <Link to="/scanner" className="quick-action-card">
            <div className="action-icon-wrap action-scan">
              <Scan size={22} />
            </div>
            <div className="action-info">
              <h3>Scan Plant</h3>
              <p>Identify species from foliage or flowers</p>
            </div>
            <ArrowRight size={16} className="action-arrow" />
          </Link>

          {/* Check Health */}
          <Link to="/health" className="quick-action-card">
            <div className="action-icon-wrap action-health">
              <Activity size={22} />
            </div>
            <div className="action-info">
              <h3>Check Health</h3>
              <p>Analyze leaf pathology and lesions</p>
            </div>
            <ArrowRight size={16} className="action-arrow" />
          </Link>

          {/* Identify Seed */}
          <Link to="/seed-identification" className="quick-action-card">
            <div className="action-icon-wrap action-seed">
              <Sprout size={22} />
            </div>
            <div className="action-info">
              <h3>Identify Seed</h3>
              <p>Recognize seeds, nuts, and pods</p>
            </div>
            <ArrowRight size={16} className="action-arrow" />
          </Link>

          {/* Ask Assistant */}
          <Link to="/assistant" className="quick-action-card">
            <div className="action-icon-wrap action-assistant">
              <Bot size={22} />
            </div>
            <div className="action-info">
              <h3>Ask Assistant</h3>
              <p>Get instant botanical care answers</p>
            </div>
            <ArrowRight size={16} className="action-arrow" />
          </Link>
        </div>
      </section>

      {/* 2-Column Split: Recent Activity + Plant Care Tip */}
      <div className="dashboard-split-grid">
        {/* Recent Activity per Section 27 */}
        <section className="dashboard-card recent-activity-card">
          <div className="card-top-row">
            <div className="card-title-group">
              <Clock size={18} className="text-emerald" />
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <span className="activity-count-badge">Last 3 Observations</span>
          </div>

          <div className="activity-list">
            {recentScans.map((scan) => (
              <div key={scan.id} className="activity-item">
                <div className="activity-left">
                  <div className="activity-icon-badge">
                    {scan.type.includes("Health") ? (
                      <Activity size={16} />
                    ) : scan.type.includes("Seed") ? (
                      <Sprout size={16} />
                    ) : (
                      <Scan size={16} />
                    )}
                  </div>
                  <div>
                    <h4 className="activity-item-title">{scan.name}</h4>
                    <span className="activity-item-type">{scan.type} • {scan.date}</span>
                  </div>
                </div>

                <div className="activity-right">
                  <span className="badge badge-forest">{scan.confidence}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="activity-card-footer">
            <Link to="/details" className="view-catalog-link">
              <span>Explore all database plant profiles</span>
              <ChevronRight size={15} />
            </Link>
          </div>
        </section>

        {/* Rotating Botanical Tip per Section 27 */}
        <section className="dashboard-card plant-tip-card">
          <div className="card-top-row">
            <div className="card-title-group">
              <Lightbulb size={18} className="text-warning" />
              <h3 className="card-title">Botanical Care Tip</h3>
            </div>
            <button 
              className="btn-next-tip" 
              onClick={() => setTipIndex((prev) => (prev + 1) % tips.length)}
              title="Next Tip"
            >
              Rotate Tip
            </button>
          </div>

          <div className="tip-card-body">
            <h4 className="tip-title">{currentTip.title}</h4>
            <p className="tip-text">{currentTip.text}</p>
          </div>

          <div className="tip-card-footer">
            <Link to="/assistant" className="btn btn-outline btn-tip-action" style={{ width: "100%" }}>
              <Bot size={16} />
              <span>Discuss with AI Assistant</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
