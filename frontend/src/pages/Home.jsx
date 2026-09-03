import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="page-badge">
          <span>🌿</span> AI-Powered Botanical Intelligence
        </div>

        <h1 className="hero-headline">
          Identify, Protect & Nurture <br />
          <span>Your Plants with AI</span>
        </h1>

        <p className="hero-description">
          PlantAI delivers precision plant and seed identification, accurate disease detection,
          personalized care guidelines, and intelligent conversational support for gardening enthusiasts and farmers.
        </p>

        <div className="hero-cta-group">
          <Link to="/scanner" className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}>
            <span>🔍</span> Scan a Plant Now
          </Link>
          <Link to="/seed-identification" className="btn btn-outline" style={{ padding: "14px 28px", fontSize: "16px" }}>
            <span>🌱</span> Identify Seeds
          </Link>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-section">
        <div className="section-heading">
          <h2>Core Capabilities</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            Everything you need for healthy botanical cultivation
          </p>
        </div>

        <div className="features-grid">
          <Link to="/scanner" className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3 className="feature-title">AI Plant Scanner</h3>
            <p className="feature-desc">
              Accurate botanical classification using computer vision with candidate probability scoring and strict confidence validation.
            </p>
            <span className="feature-link">Open Scanner &rarr;</span>
          </Link>

          <Link to="/seed-identification" className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3 className="feature-title">Seed Recognition</h3>
            <p className="feature-desc">
              Dedicated seed and grain recognition pipeline with close-up image quality verification and confidence scoring.
            </p>
            <span className="feature-link">Identify Seeds &rarr;</span>
          </Link>

          <Link to="/health" className="feature-card">
            <div className="feature-icon">🩺</div>
            <h3 className="feature-title">Health & Disease Check</h3>
            <p className="feature-desc">
              Early diagnosis of leaf spots, nutrient deficiencies, and rot with organic and chemical treatment recommendations.
            </p>
            <span className="feature-link">Check Plant Health &rarr;</span>
          </Link>

          <Link to="/details" className="feature-card">
            <div className="feature-icon">📖</div>
            <h3 className="feature-title">Smart Care Guides</h3>
            <p className="feature-desc">
              Detailed botanical care guides powered by a dedicated MySQL database covering sunlight, watering, soil, and pots.
            </p>
            <span className="feature-link">View Care Guides &rarr;</span>
          </Link>

          <Link to="/assistant" className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Botanical Assistant</h3>
            <p className="feature-desc">
              Ask questions about watering schedules, pest remedies, yellowing foliage, and get context-aware answers.
            </p>
            <span className="feature-link">Chat with Assistant &rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
