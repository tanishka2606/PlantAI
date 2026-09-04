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

  // Clear previous state when new image is chosen
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
        setErrorMsg(response.message || "Plant health assessment service temporarily unavailable.");
      }
    } catch (err) {
      console.error("Plant health diagnosis error:", err);
      setErrorMsg("Could not connect to the PlantAI backend. Please check your connection.");
    } finally {
      setDiagnosing(false);
    }
  };

  const healthData = result?.data;
  const isAnalyzed = result?.success && result?.status === "analyzed";
  const isHealthy = isAnalyzed && healthData?.health_status === "healthy";
  const isDiseased = isAnalyzed && healthData?.health_status === "possible_disease";
  const isUncertain = result?.status === "uncertain";
  const isValidationErr = result?.status === "validation_error";

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-badge">
          <span>🩺</span> Pathology & Disease Diagnosis
        </div>
        <h1 className="page-title">Plant Health Check</h1>
        <p className="page-subtitle">
          Upload an image of an affected leaf, stem, or plant part to analyze symptoms and detect potential diseases.
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
              <div className="dropzone-text">Click to upload affected leaf or plant photo</div>
              <div className="dropzone-hint">Clear close-up photos of leaves with good lighting yield the best results</div>
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
                  title="Remove / Change Image"
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
                      <span>Analyzing plant health...</span>
                    </>
                  ) : (
                    <>
                      <span>🩺</span>
                      <span>Analyze Health</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="alert-banner alert-error" style={{ marginTop: "20px" }}>
              <span>⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Validation Warning */}
          {isValidationErr && (
            <div className="alert-banner alert-warning" style={{ marginTop: "20px" }}>
              <span>⚠️</span>
              <div>
                <strong>{result.message}</strong>
                <p style={{ marginTop: "4px", fontSize: "13px" }}>
                  Please ensure the image contains a clear, well-lit view of the plant foliage.
                </p>
              </div>
            </div>
          )}

          {/* Uncertain State */}
          {isUncertain && (
            <div className="health-result-card" style={{ borderTopColor: "#f59e0b" }}>
              <div className="alert-banner alert-warning">
                <span>⚠️</span>
                <div>
                  <strong style={{ fontSize: "16px" }}>Analysis Uncertain</strong>
                  <p style={{ marginTop: "6px", fontSize: "14px" }}>
                    We could not confidently determine the plant condition.
                  </p>
                  <p style={{ marginTop: "4px", fontSize: "13.5px" }}>
                    Please upload a clearer close-up image of the affected leaf.
                  </p>
                  {healthData?.confidence_percent !== undefined && healthData.confidence_percent > 0 && (
                    <div style={{ marginTop: "8px", fontSize: "12.5px", color: "#854d0e" }}>
                      Model Confidence: <strong>{healthData.confidence_percent}%</strong> (Below confidence threshold).
                    </div>
                  )}
                </div>
              </div>

              <div className="tips-box">
                <strong>Tips for better disease diagnosis:</strong>
                <ul>
                  <li>Capture the boundary between healthy and discolored leaf tissue.</li>
                  <li>Ensure the camera is sharply focused on spots, powdery coatings, or lesions.</li>
                  <li>Avoid blurry captures or harsh glare.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Healthy Result */}
          {isHealthy && healthData && (
            <div className="health-result-card" style={{ borderTopColor: "#15803d" }}>
              <div className="health-status-header">
                <div>
                  <h3 style={{ fontSize: "18px", color: "var(--text-main)", marginBottom: "4px" }}>
                    🌿 Plant Health
                  </h3>
                  <span className="status-indicator status-healthy">
                    ✓ Status: Healthy
                  </span>
                </div>
                <span className="confidence-badge confidence-high">
                  🎯 {healthData.confidence_percent}% Confidence
                </span>
              </div>

              <div className="alert-banner alert-info">
                <span>🌿</span>
                <div>
                  <strong>{result.message || "The plant appears healthy."}</strong>
                  <p style={{ marginTop: "4px", fontSize: "13px" }}>
                    No significant signs of foliar pathogens, severe nutrient deficiencies, or pest damage were detected.
                  </p>
                </div>
              </div>

              <div className="health-disclaimer-box">
                <span>ℹ️</span>
                <div>
                  <strong>Note:</strong> {healthData.disclaimer || "This is an AI-based assessment and should not be treated as a confirmed diagnosis."}
                </div>
              </div>
            </div>
          )}

          {/* Possible Disease Result */}
          {isDiseased && healthData && (
            <div className="health-result-card" style={{ borderTopColor: "#ef4444" }}>
              <div className="health-status-header">
                <div>
                  <h3 style={{ fontSize: "18px", color: "var(--text-main)", marginBottom: "4px" }}>
                    🌿 Plant Health
                  </h3>
                  <span className="status-indicator status-diseased">
                    ⚠️ Status: Possible Disease
                  </span>
                </div>
                <span className="confidence-badge confidence-medium">
                  🎯 {healthData.confidence_percent}% Confidence
                </span>
              </div>

              <div className="health-condition-banner">
                <div className="health-condition-title">Possible Condition</div>
                <div className="health-condition-name">{healthData.condition}</div>
              </div>

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
                      <span>🛡️</span> Prevention & Maintenance
                    </div>
                    <ul className="health-list">
                      {healthData.prevention.map((prev, idx) => (
                        <li key={idx}>{prev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="health-disclaimer-box">
                <span>ℹ️</span>
                <div>
                  <strong>Note:</strong> {healthData.disclaimer || "This is an AI-based assessment and should not be treated as a confirmed diagnosis."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantHealth;
