import React, { useState } from "react";
import { checkPlantHealth } from "../services/api";
import "./PlantHealth.css";

function PlantHealth() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setErrorMsg("");
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMsg("");
  };

  const handleDiagnose = async () => {
    if (!selectedFile) return;

    setDiagnosing(true);
    setResult(null);
    setErrorMsg("");

    try {
      const response = await checkPlantHealth(selectedFile);
      setResult(response);
      if (!response.success && response.status === "error") {
        setErrorMsg(response.message || "Failed to analyze plant health.");
      }
    } catch (err) {
      console.error("Plant health diagnosis error:", err);
      setErrorMsg("Could not connect to the PlantAI backend. Please check your connection.");
    } finally {
      setDiagnosing(false);
    }
  };

  const healthData = result?.data;
  const isAssessed = result?.success;
  const isHealthy = healthData?.is_healthy;
  const isLowConfidence = result?.status === "low_confidence";

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-badge">
          <span>🩺</span> Pathology & Disease Diagnosis
        </div>
        <h1 className="page-title">Plant Health Check</h1>
        <p className="page-subtitle">
          Upload an image of an affected leaf, stem, or flower to diagnose plant illnesses, deficiencies, and pests.
        </p>
      </header>

      <div className="health-box">
        <div className="plant-card">
          {!previewUrl ? (
            <div
              className={`dropzone ${isDragOver ? "active" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("health-file-input").click()}
            >
              <div className="dropzone-icon">🔬</div>
              <div className="dropzone-text">Upload affected leaf/plant photo</div>
              <div className="dropzone-hint">Clear close-up photos of spots or discolored areas work best</div>
              <input
                id="health-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleInputChange}
                hidden
              />
            </div>
          ) : (
            <div>
              <div className="preview-container">
                <img src={previewUrl} alt="Leaf Preview" className="preview-image" />
                <button
                  className="btn-remove-preview"
                  onClick={handleRemoveImage}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>

              <div style={{ textAlign: "center", marginTop: "16px" }}>
                <button
                  className="btn btn-primary"
                  onClick={handleDiagnose}
                  disabled={diagnosing}
                  style={{ width: "100%", maxWidth: "320px" }}
                >
                  {diagnosing ? (
                    <>
                      <span className="spinner"></span>
                      <span>Diagnosing plant health...</span>
                    </>
                  ) : (
                    <>
                      <span>🩺</span>
                      <span>Check Disease & Health</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="alert-banner alert-error">
              <span>⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Low Confidence State */}
          {isLowConfidence && (
            <div className="alert-banner alert-warning" style={{ marginTop: "24px" }}>
              <span>⚠️</span>
              <div>
                <strong>{result.message}</strong>
                <div style={{ fontSize: "13px", marginTop: "4px" }}>
                  Please upload a sharper, better-lit close-up of the affected foliage.
                </div>
              </div>
            </div>
          )}

          {/* Successful Assessment */}
          {isAssessed && healthData && (
            <div style={{ marginTop: "28px" }}>
              <div className="health-status-header">
                <div>
                  <span
                    className={`status-indicator ${
                      isHealthy ? "status-healthy" : "status-diseased"
                    }`}
                  >
                    {isHealthy ? "💚 Healthy Plant" : "🦠 Disease / Health Issue Detected"}
                  </span>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Host Plant: <strong>{healthData.plant_name}</strong>
                  </div>
                </div>

                <span
                  className={`confidence-badge ${
                    healthData.confidence >= 0.7 ? "confidence-high" : "confidence-medium"
                  }`}
                >
                  🎯 {healthData.confidence_percent}% Confidence
                </span>
              </div>

              {!isHealthy && healthData.disease_name && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fca5a5",
                    borderRadius: "var(--radius-md)",
                    padding: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "#991b1b" }}>
                    Diagnosed Condition: {healthData.disease_name}
                  </div>
                </div>
              )}

              <div className="health-sections-grid">
                {healthData.symptoms && healthData.symptoms.length > 0 && (
                  <div className="health-section-card">
                    <div className="health-section-title">
                      <span>🍂</span> Observable Symptoms
                    </div>
                    <ul className="health-list">
                      {healthData.symptoms.map((sym, idx) => (
                        <li key={idx}>{sym}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {healthData.causes && healthData.causes.length > 0 && (
                  <div className="health-section-card">
                    <div className="health-section-title">
                      <span>🔍</span> Probable Causes
                    </div>
                    <ul className="health-list">
                      {healthData.causes.map((cause, idx) => (
                        <li key={idx}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {healthData.treatments && healthData.treatments.length > 0 && (
                  <div className="health-section-card">
                    <div className="health-section-title">
                      <span>💊</span> Recommended Treatments
                    </div>
                    <ul className="health-list">
                      {healthData.treatments.map((treat, idx) => (
                        <li key={idx}>{treat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {healthData.prevention && healthData.prevention.length > 0 && (
                  <div className="health-section-card">
                    <div className="health-section-title">
                      <span>🛡️</span> Prevention & Ongoing Care
                    </div>
                    <ul className="health-list">
                      {healthData.prevention.map((prev, idx) => (
                        <li key={idx}>{prev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="disclaimer-box">
                <span>ℹ️</span>
                <span>
                  <strong>Disclaimer:</strong> {healthData.disclaimer}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantHealth;
