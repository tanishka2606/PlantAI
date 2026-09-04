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

  // Instantly clear stale state when a new image is selected
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
        setErrorMsg(response.message || "Seed identification service temporarily unavailable.");
      }
    } catch (err) {
      console.error("Seed identification error:", err);
      setErrorMsg("Could not connect to the PlantAI backend. Please verify your connection.");
    } finally {
      setIdentifying(false);
    }
  };

  const seedData = result?.data;
  const isIdentified = result?.success && result?.status === "identified";
  const isUncertain = result?.status === "uncertain";
  const isValidationErr = result?.status === "validation_error";

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-badge">
          <span>🌱</span> Dedicated Seed Recognition
        </div>
        <h1 className="page-title">Seed Identification</h1>
        <p className="page-subtitle">
          Upload a clear close-up photograph of a seed, grain, or pod to accurately determine its botanical origin.
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
              <div className="dropzone-hint">Clear close-up images of single seeds produce the highest accuracy</div>
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
                  title="Remove / Change Image"
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
                  Please ensure the image is sharp, well-lit, and contains a clearly visible seed.
                </p>
              </div>
            </div>
          )}

          {/* Uncertain State */}
          {isUncertain && (
            <div className="seed-result-card" style={{ borderTopColor: "#f59e0b" }}>
              <div className="alert-banner alert-warning">
                <span>⚠️</span>
                <div>
                  <strong>Seed identification is uncertain.</strong>
                  <div style={{ marginTop: "4px", fontSize: "13.5px" }}>
                    {result.message || "Please upload a clearer image showing the seed from a closer angle."}
                  </div>
                  {seedData?.confidence_percent !== undefined && seedData.confidence_percent > 0 && (
                    <div style={{ marginTop: "6px", fontSize: "12.5px", color: "#854d0e" }}>
                      Model Confidence: <strong>{seedData.confidence_percent}%</strong> (Below confidence threshold).
                    </div>
                  )}
                </div>
              </div>

              <div className="tips-box">
                <strong>Tips for accurate seed identification:</strong>
                <ul>
                  <li>Place the seed on a plain, contrasting white background.</li>
                  <li>Ensure sharp focus on seed shape, color, and surface texture.</li>
                  <li>Take the photo with bright, balanced lighting without harsh shadows.</li>
                </ul>
              </div>
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
                  {seedData.scientific_name && (
                    <div className="seed-scientific">
                      Scientific Name: <em>{seedData.scientific_name}</em>
                    </div>
                  )}
                </div>
                <span className="confidence-badge confidence-high">
                  🎯 {seedData.confidence_percent}% Confidence
                </span>
              </div>

              <div className="seed-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Seed Classification</span>
                  <span className="meta-val">{seedData.seed_name}</span>
                </div>
                {seedData.common_name && (
                  <div className="meta-item">
                    <span className="meta-label">Common Name</span>
                    <span className="meta-val">{seedData.common_name}</span>
                  </div>
                )}
                {seedData.scientific_name && (
                  <div className="meta-item">
                    <span className="meta-label">Botanical Name</span>
                    <span className="meta-val">{seedData.scientific_name}</span>
                  </div>
                )}
              </div>

              {seedData.explanation && (
                <div className="seed-explanation">
                  <strong>Identification Details:</strong>
                  <p style={{ marginTop: "4px" }}>{seedData.explanation}</p>
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
