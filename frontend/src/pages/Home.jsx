import React from "react";
import { Link } from "react-router-dom";
import { 
  Scan, 
  Activity, 
  Sprout, 
  Bot, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Layers, 
  BrainCircuit, 
  BookOpen
} from "lucide-react";
import "./Home.css";

function Home() {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} className="hero-badge-sparkle" />
              <span>Next-Generation Botanical Intelligence</span>
            </div>

            <h1 className="hero-headline">
              See your plant. <br />
              <span className="gradient-text">Understand it.</span> <br />
              Care for it.
            </h1>

            <p className="hero-description">
              AI-powered plant identification, health insights, seed recognition and personalized care — all in one intelligent platform.
            </p>

            <div className="hero-cta-group">
              <Link to="/scanner" className="btn btn-primary btn-hero-primary">
                <Scan size={18} />
                <span>Scan a Plant</span>
              </Link>
              <a href="#features" className="btn btn-outline btn-hero-secondary">
                <span>Explore PlantAI</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="hero-trust-indicators">
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Pl@ntNet Taxonomy</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Foliar Pathology AI</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} className="trust-icon" />
                <span>Verified MySQL Care Database</span>
              </div>
            </div>
          </div>

          {/* Hero Visual: Premium AI Botanical Scanner Telemetry */}
          <div className="hero-visual">
            <div className="scanner-mockup-card">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="mockup-status">
                  <span className="live-dot"></span> Live AI Optical Analysis
                </div>
              </div>

              <div className="mockup-display">
                {/* Botanical image */}
                <img 
                  src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80" 
                  alt="Monstera Deliciosa Botanical Specimen" 
                  className="mockup-plant-img"
                />

                {/* Laser scan beam & overlay */}
                <div className="scan-beam"></div>
                <div className="scan-overlay-grid"></div>

                {/* Scanning Target Reticle */}
                <div className="scanner-reticle">
                  <div className="reticle-corner tl"></div>
                  <div className="reticle-corner tr"></div>
                  <div className="reticle-corner bl"></div>
                  <div className="reticle-corner br"></div>
                </div>

                {/* Floating Telemetry Badges */}
                <div className="telemetry-badge telemetry-top-left">
                  <span className="telemetry-label">Organ Detection</span>
                  <strong className="telemetry-val">Foliage / Leaf (99.2%)</strong>
                </div>

                <div className="telemetry-badge telemetry-bottom-right">
                  <span className="telemetry-label">Species Identified</span>
                  <strong className="telemetry-val">Monstera deliciosa</strong>
                </div>
              </div>

              <div className="mockup-footer">
                <div className="footer-metric">
                  <span className="metric-title">Model Confidence</span>
                  <strong className="metric-data metric-green">98.8%</strong>
                </div>
                <div className="footer-metric">
                  <span className="metric-title">Health State</span>
                  <strong className="metric-data metric-green">Optimal</strong>
                </div>
                <div className="footer-metric">
                  <span className="metric-title">Soil Moisture Profile</span>
                  <strong className="metric-data">Moderate (Dry 2")</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capability Strip */}
      <section className="capability-strip">
        <div className="strip-container">
          <div className="strip-item">
            <div className="strip-icon-wrap">
              <Scan size={20} />
            </div>
            <div className="strip-text">
              <h4>Plant Recognition</h4>
              <p>Species-level taxonomic computer vision</p>
            </div>
          </div>

          <div className="strip-item">
            <div className="strip-icon-wrap">
              <Activity size={20} />
            </div>
            <div className="strip-text">
              <h4>Health Analysis</h4>
              <p>Early symptom and pathogen assessment</p>
            </div>
          </div>

          <div className="strip-item">
            <div className="strip-icon-wrap">
              <Sprout size={20} />
            </div>
            <div className="strip-text">
              <h4>Seed Recognition</h4>
              <p>Dedicated seed and pod classification</p>
            </div>
          </div>

          <div className="strip-item">
            <div className="strip-icon-wrap">
              <Bot size={20} />
            </div>
            <div className="strip-text">
              <h4>AI Care Assistant</h4>
              <p>Conversational horticultural expertise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <div className="section-eyebrow">Comprehensive Toolkit</div>
          <h2 className="section-title">Engineered for Precision Plant Intelligence</h2>
          <p className="section-desc">
            Four specialized AI pipelines united by structured botanical science and relational cultivation data.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1: Plant Identification */}
          <div className="feature-card">
            <div className="feature-card-icon">
              <Scan size={24} />
            </div>
            <h3 className="feature-card-title">Plant Identification</h3>
            <p className="feature-card-desc">
              Identify plant species from photographs. Evaluates species, genus, and family taxonomy with candidate probability scoring.
            </p>
            <div className="feature-card-footer">
              <Link to="/scanner" className="feature-card-link">
                <span>Scan a Plant</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Card 2: Plant Health */}
          <div className="feature-card">
            <div className="feature-card-icon">
              <Activity size={24} />
            </div>
            <h3 className="feature-card-title">Plant Health</h3>
            <p className="feature-card-desc">
              Analyze visible symptoms and possible conditions. Examines chlorosis, necrotic spotting, and pathogens with organic & chemical treatments.
            </p>
            <div className="feature-card-footer">
              <Link to="/health" className="feature-card-link">
                <span>Diagnose Health</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Card 3: Seed Identification */}
          <div className="feature-card">
            <div className="feature-card-icon">
              <Sprout size={24} />
            </div>
            <h3 className="feature-card-title">Seed Identification</h3>
            <p className="feature-card-desc">
              Recognize seeds from images. Dedicated close-up seed classification adhering strictly to botanical taxonomy.
            </p>
            <div className="feature-card-footer">
              <Link to="/seed-identification" className="feature-card-link">
                <span>Identify Seeds</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Card 4: AI Assistant */}
          <div className="feature-card">
            <div className="feature-card-icon">
              <Bot size={24} />
            </div>
            <h3 className="feature-card-title">AI Assistant</h3>
            <p className="feature-card-desc">
              Ask plant-specific questions. Context-aware advice regarding watering intervals, sunlight, potting soil, fertilizers, and yellowing foliage.
            </p>
            <div className="feature-card-footer">
              <Link to="/assistant" className="feature-card-link">
                <span>Ask Assistant</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="timeline-section">
        <div className="section-header">
          <div className="section-eyebrow">The Analytical Workflow</div>
          <h2 className="section-title">How PlantAI Works</h2>
          <p className="section-desc">
            From optical specimen capture to ongoing cultivation support in five deliberate phases.
          </p>
        </div>

        <div className="timeline-container">
          <div className="timeline-step">
            <div className="step-number">01</div>
            <div className="step-content">
              <h4>Capture</h4>
              <p>Upload a clear photo of your plant leaf, flower, fruit, or seed specimen.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">02</div>
            <div className="step-content">
              <h4>Analyze</h4>
              <p>Multi-spectral pixel preprocessing evaluates sharpness, lighting, and texture clarity.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">03</div>
            <div className="step-content">
              <h4>Identify</h4>
              <p>Neural vision models compute candidate classifications and rigorous confidence scores.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">04</div>
            <div className="step-content">
              <h4>Understand</h4>
              <p>Query symptoms, assess leaf pathology, or explore botanical taxonomy.</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-number">05</div>
            <div className="step-content">
              <h4>Care</h4>
              <p>Access verified database care guidelines for sunlight, water, soil, fertilizer, and repotting.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Intelligence Architecture Section */}
      <section className="intelligence-section">
        <div className="intelligence-card">
          <div className="intelligence-header">
            <div className="hero-badge">
              <BrainCircuit size={14} />
              <span>Holistic Botanical Intelligence</span>
            </div>
            <h2>An Ecosystem of AI & Verified Knowledge</h2>
            <p>PlantAI synthesizes four distinct pillars to provide reliable, actionable horticultural insight.</p>
          </div>

          <div className="intelligence-pillars-grid">
            <div className="pillar-item">
              <div className="pillar-icon">
                <Eye size={22} />
              </div>
              <h4>Image Analysis</h4>
              <p>Computer vision models trained on millions of botanical specimens across distinct organs and developmental stages.</p>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon">
                <Layers size={22} />
              </div>
              <h4>Plant Knowledge</h4>
              <p>Taxonomic catalogs covering species classifications, native ranges, and pathogenic manifestations.</p>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon">
                <Bot size={22} />
              </div>
              <h4>AI Assistance</h4>
              <p>Contextual generative models trained to answer complex horticultural queries based on the active specimen.</p>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon">
                <Database size={22} />
              </div>
              <h4>Structured Care Data</h4>
              <p>Relational MySQL storage of validated parameters for sunlight, watering, soil mixtures, containers, and fertilizers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="final-cta-section">
        <div className="cta-box">
          <h2>Start understanding your plants.</h2>
          <p>
            Join thousands of plant owners, horticulturists, and farmers who cultivate healthier plants with PlantAI.
          </p>
          <div className="cta-buttons">
            <Link to="/scanner" className="btn btn-primary btn-hero-primary">
              <Scan size={18} />
              <span>Scan a Plant Now</span>
            </Link>
            <Link to="/details" className="btn btn-outline" style={{ background: "#fff" }}>
              <BookOpen size={16} />
              <span>Browse Plant Care Database</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
