import React, { useState } from "react";
import { identifySeed } from "../services/api";
import "./SeedIdentification.css";

function SeedIdentification() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Clear state when new file is selected
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

  const handleIdentify = async () => {
    if (!selectedFile) return;

    setIdentifying(true);
    setResult(null);
    setErrorMsg("");

    try {
      const response = await identifySeed(selectedFile);
      setResult(response);
      if (!response.success && response.status === "error") {
        setErrorMsg(response.message || "Failed to identify seed.");
      }
    } catch (err) {
      console.error("Seed identification error:", err);
      setErrorMsg("Could not connect to the PlantAI backend. Please check your connection.");
    } finally {
      setIdentifying(false);
    }
  };

  const seedData = result?.data;
  const isIdentified = result?.success && result?.status === "identified";
  const isLowConfidence = result?.status === "low_confidence";

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-badge">
          <span>🌱</span> Dedicated Seed Recognition
        </div>
        <h1 className="page-title">Seed Identification</h1>
        <p className="page-subtitle">
          Upload a clear close-up photograph of seeds, grains, or pods to accurately determine their botanical source.
        </p>
      </header>

      <div className="seed-box">
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
              onClick={() => document.getElementById("seed-file-input").click()}
            >
              <div className="dropzone-icon">🌱</div>
              <div className="dropzone-text">Click to upload seed image or drag & drop</div>
              <div className="dropzone-hint">Clear close-up photos yield the highest accuracy</div>
              <input
                id="seed-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleInputChange}
                hidden
              />
            </div>
          ) : (
            <div>
              <div className="preview-container">
                <img src={previewUrl} alt="Seed Preview" className="preview-image" />
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
                  onClick={handleIdentify}
                  disabled={identifying}
                  style={{ width: "100%", maxWidth: "300px" }}
                >
                  {identifying ? (
                    <>
                      <span className="spinner"></span>
                      <span>Analyzing seed features...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Identify Seed</span>
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

          {/* Validation Error */}
          {result && result.status === "validation_error" && (
            <div className="alert-banner alert-warning">
              <span>⚠️</span>
              <div>{result.message}</div>
            </div>
          )}

          {/* Low Confidence State */}
          {isLowConfidence && (
            <div className="seed-result-card" style={{ borderTopColor: "#f59e0b" }}>
              <div className="alert-banner alert-warning">
                <span>⚠️</span>
                <div>
                  <strong>{result.message}</strong>
                  <div style={{ marginTop: "4px", fontSize: "13px" }}>
                    Recorded confidence: <strong>{seedData?.confidence_percent}%</strong> (Below confidence threshold).
                  </div>
                </div>
              </div>

              <div className="tips-box">
                <strong>Tips for higher seed accuracy:</strong>
                <ul>
                  <li>Place seeds on a plain, contrasting white or neutral surface.</li>
                  <li>Ensure sharp focus on seed coat texture, color, and shape.</li>
                  <li>Take the photo with good ambient light without harsh shadows.</li>
                </ul>
              </div>

              {seedData?.candidates && seedData.candidates.length > 0 && (
                <div className="candidate-list">
                  <h4 style={{ fontSize: "14px", color: "var(--text-main)", marginBottom: "10px" }}>
                    Possible Botanical Matches:
                  </h4>
                  {seedData.candidates.slice(0, 3).map((cand, idx) => (
                    <div key={idx} className="candidate-item">
                      <div className="candidate-names">
                        <strong>{cand.common_name || cand.scientific_name}</strong>
                        <em>({cand.scientific_name})</em>
                      </div>
                      <span className="confidence-badge confidence-medium">
                        {cand.confidence_percent}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Successful Identification */}
          {isIdentified && seedData && (
            <div className="seed-result-card">
              <div className="seed-header">
                <div>
                  <div className="seed-name">
                    {seedData.common_name || seedData.seed_name}
                  </div>
                  <div className="seed-scientific">
                    Botanical Name: {seedData.scientific_name}
                  </div>
                </div>
                <span
                  className={`confidence-badge ${
                    seedData.confidence >= 0.6 ? "confidence-high" : "confidence-medium"
                  }`}
                >
                  🎯 {seedData.confidence_percent}% Confidence
                </span>
              </div>

              {seedData.candidates && seedData.candidates.length > 1 && (
                <div className="candidate-list">
                  <h4 style={{ fontSize: "14px", color: "var(--text-main)", marginBottom: "10px" }}>
                    Top Candidate Matches:
                  </h4>
                  {seedData.candidates.slice(0, 3).map((cand, idx) => (
                    <div key={idx} className="candidate-item">
                      <div className="candidate-names">
                        <strong>{cand.common_name || cand.scientific_name}</strong>
                        <em>({cand.scientific_name})</em>
                      </div>
                      <span className="confidence-badge confidence-medium">
                        {cand.confidence_percent}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeedIdentification;
