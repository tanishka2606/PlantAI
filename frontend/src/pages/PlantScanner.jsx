import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { identifyPlant } from "../services/api";
import "./PlantScanner.css";

function PlantScanner() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Clear previous state when a new file is picked
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

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setResult(null);
    setErrorMsg("");

    try {
      const response = await identifyPlant(selectedFile);
      setResult(response);
      if (!response.success && response.status === "error") {
        setErrorMsg(response.message || "Failed to identify plant.");
      }
    } catch (err) {
      console.error("Plant identification error:", err);
      setErrorMsg("Could not connect to the PlantAI backend. Please check your connection.");
    } finally {
      setAnalyzing(false);
    }
  };

  const plantData = result?.data;
  const isIdentified = result?.success && result?.status === "identified";
  const isLowConfidence = result?.status === "low_confidence";

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-badge">
          <span>🌿</span> Precision Computer Vision
        </div>
        <h1 className="page-title">AI Plant Scanner</h1>
        <p className="page-subtitle">
          Upload a clear photo of a leaf, flower, fruit, or entire plant to accurately identify its species.
        </p>
      </header>

      <div className="scanner-box">
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
              onClick={() => document.getElementById("plant-file-input").click()}
            >
              <div className="dropzone-icon">📷</div>
              <div className="dropzone-text">Click to upload or drag & drop</div>
              <div className="dropzone-hint">Supports JPG, PNG, WEBP (Max 10MB)</div>
              <input
                id="plant-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleInputChange}
                hidden
              />
            </div>
          ) : (
            <div>
              <div className="preview-container">
                <img src={previewUrl} alt="Plant Preview" className="preview-image" />
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
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{ width: "100%", maxWidth: "300px" }}
                >
                  {analyzing ? (
                    <>
                      <span className="spinner"></span>
                      <span>Analyzing your plant...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>Analyze Plant</span>
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

          {/* Validation Warning */}
          {result && result.status === "validation_error" && (
            <div className="alert-banner alert-warning">
              <span>⚠️</span>
              <div>{result.message}</div>
            </div>
          )}

          {/* Low Confidence State */}
          {isLowConfidence && (
            <div className="result-card" style={{ borderTopColor: "#f59e0b" }}>
              <div className="alert-banner alert-warning">
                <span>⚠️</span>
                <div>
                  <strong>{result.message}</strong>
                  <div style={{ marginTop: "4px", fontSize: "13px" }}>
                    Confidence score: <strong>{plantData?.confidence_percent}%</strong> (Below confidence threshold).
                  </div>
                </div>
              </div>

              <div className="tips-box">
                <strong>Tips for more accurate plant identification:</strong>
                <ul>
                  <li>Take a clear, well-lit photo of the full leaf or blossom.</li>
                  <li>Ensure the camera is focused and not blurry.</li>
                  <li>Avoid harsh shadows or extreme backlighting.</li>
                </ul>
              </div>

              {plantData?.candidates && plantData.candidates.length > 0 && (
                <div className="candidate-list">
                  <h4 style={{ fontSize: "14px", color: "var(--text-main)", marginBottom: "10px" }}>
                    Possible Matches:
                  </h4>
                  {plantData.candidates.slice(0, 3).map((cand, idx) => (
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

          {/* High Confidence Success State */}
          {isIdentified && plantData && (
            <div className="result-card">
              <div className="result-header">
                <div>
                  <div className="result-plant-name">
                    {plantData.common_name || plantData.plant_name}
                  </div>
                  <div className="result-scientific-name">
                    Scientific Name: {plantData.scientific_name}
                  </div>
                </div>
                <span
                  className={`confidence-badge ${
                    plantData.confidence >= 0.7 ? "confidence-high" : "confidence-medium"
                  }`}
                >
                  🎯 {plantData.confidence_percent}% Match
                </span>
              </div>

              <div className="result-meta">
                {plantData.species && (
                  <div className="meta-item">
                    <span className="meta-label">Species</span>
                    <span className="meta-val">{plantData.species}</span>
                  </div>
                )}
                {plantData.genus && (
                  <div className="meta-item">
                    <span className="meta-label">Genus</span>
                    <span className="meta-val">{plantData.genus}</span>
                  </div>
                )}
                {plantData.family && (
                  <div className="meta-item">
                    <span className="meta-label">Family</span>
                    <span className="meta-val">{plantData.family}</span>
                  </div>
                )}
              </div>

              {plantData.candidates && plantData.candidates.length > 1 && (
                <div className="candidate-list">
                  <h4 style={{ fontSize: "14px", color: "var(--text-main)", marginBottom: "10px" }}>
                    Alternative Species Matches:
                  </h4>
                  {plantData.candidates.slice(1, 4).map((cand, idx) => (
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

              <div className="result-actions">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate("/details", {
                      state: {
                        plantName: plantData.scientific_name,
                        commonName: plantData.common_name,
                      },
                    })
                  }
                >
                  <span>📖</span> View Care Guide
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    navigate("/assistant", {
                      state: {
                        plantName: plantData.common_name || plantData.scientific_name,
                      },
                    })
                  }
                >
                  <span>🤖</span> Ask AI Assistant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlantScanner;
