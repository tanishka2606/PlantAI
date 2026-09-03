import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPlantCare } from "../services/api";
import "./PlantDetails.css";

function PlantDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialPlant = location.state?.plantName || "";
  const initialCommon = location.state?.commonName || "";

  const [searchTerm, setSearchTerm] = useState(initialCommon || initialPlant);
  const [currentQuery, setCurrentQuery] = useState(initialPlant || initialCommon || "Epipremnum aureum");
  const [careData, setCareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchCare = async (queryName) => {
    if (!queryName || !queryName.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setCareData(null);

    try {
      const response = await getPlantCare(queryName.trim());
      if (response.success && response.data) {
        setCareData(response.data);
      } else {
        setErrorMsg(
          response.message || `Care information for "${queryName}" is currently unavailable in the database.`
        );
      }
    } catch (err) {
      console.error("Plant care fetch error:", err);
      setErrorMsg("Could not connect to the database. Please check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentQuery) {
      fetchCare(currentQuery);
    }
  }, [currentQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentQuery(searchTerm.trim());
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-badge">
          <span>📖</span> Botanical Database Care Profiles
        </div>
        <h1 className="page-title">Smart Plant Care Guide</h1>
        <p className="page-subtitle">
          Explore complete cultivation recommendations retrieved directly from our verified MySQL plant database.
        </p>
      </header>

      {/* Search Input for Looking up other plants */}
      <form className="care-search-box" onSubmit={handleSearch}>
        <input
          type="text"
          className="care-search-input"
          placeholder="Search by plant name (e.g. Neem, Rose, Mango, Money Plant)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Quick suggestions */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "30px" }}>
        {["Money Plant", "Rose", "Hibiscus", "Neem", "Tomato", "Aloe Vera", "Tulsi"].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setSearchTerm(name);
              setCurrentQuery(name);
            }}
            style={{
              background: "rgba(255, 255, 255, 0.7)",
              border: "1px solid var(--border-light)",
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--primary-dark)",
              cursor: "pointer",
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="plant-card">
        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <span className="spinner" style={{ borderColor: "#15803d", borderTopColor: "transparent", width: "28px", height: "28px" }}></span>
            <p style={{ marginTop: "14px", color: "var(--text-muted)", fontSize: "15px" }}>
              Retrieving plant care data from MySQL database...
            </p>
          </div>
        )}

        {errorMsg && !loading && (
          <div style={{ textAlign: "center", padding: "30px 20px" }}>
            <div className="alert-banner alert-warning" style={{ justifyContent: "center" }}>
              <span>⚠️</span>
              <div>{errorMsg}</div>
            </div>
            <div style={{ marginTop: "20px" }}>
              <button
                className="btn btn-outline"
                onClick={() =>
                  navigate("/assistant", {
                    state: { plantName: searchTerm || currentQuery },
                  })
                }
              >
                <span>🤖</span> Ask AI Assistant about this plant
              </button>
            </div>
          </div>
        )}

        {careData && !loading && (
          <div>
            <div className="care-plant-header">
              <h2 className="care-plant-title">
                🌿 {careData.common_name || careData.plant_name}
              </h2>
              {careData.plant_name !== careData.common_name && (
                <div className="care-plant-scientific">
                  Botanical Name: <em>{careData.plant_name}</em>
                </div>
              )}
              <div style={{ marginTop: "8px" }}>
                <span className="confidence-badge confidence-high">
                  🗄️ Database Record #{careData.id || "Verified"}
                </span>
              </div>
            </div>

            <div className="care-grid">
              <div className="care-item-card">
                <div className="care-item-header">
                  <span>☀️</span> Sunlight
                </div>
                <div className="care-item-content">{careData.sunlight || "Bright natural light."}</div>
              </div>

              <div className="care-item-card">
                <div className="care-item-header">
                  <span>💧</span> Watering
                </div>
                <div className="care-item-content">{careData.water || "Water when topsoil is dry."}</div>
              </div>

              <div className="care-item-card">
                <div className="care-item-header">
                  <span>🌱</span> Soil & pH
                </div>
                <div className="care-item-content">{careData.soil || "Well-draining rich potting soil."}</div>
              </div>

              <div className="care-item-card">
                <div className="care-item-header">
                  <span>🪴</span> Container & Pot
                </div>
                <div className="care-item-content">{careData.container || "Adequate drainage pot."}</div>
              </div>

              <div className="care-item-card">
                <div className="care-item-header">
                  <span>🏠</span> Ideal Location
                </div>
                <div className="care-item-content">{careData.location || "Indoor or sunny balcony."}</div>
              </div>

              <div className="care-item-card">
                <div className="care-item-header">
                  <span>🌸</span> Nutrition & Care
                </div>
                <div className="care-item-content">{careData.care || "Regular fertilization and pruning."}</div>
              </div>
            </div>

            {careData.care && (
              <div className="care-full-summary">
                <strong>Botanical Maintenance Summary:</strong>
                <p style={{ marginTop: "6px" }}>{careData.care}</p>
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate("/assistant", {
                    state: { plantName: careData.common_name || careData.plant_name },
                  })
                }
              >
                <span>🤖</span> Ask AI Assistant Questions About {careData.common_name || careData.plant_name}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlantDetails;
