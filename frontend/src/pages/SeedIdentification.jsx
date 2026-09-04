import React, { useState } from "react";
import { 
  Sprout, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Dna, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { identifySeed } from "../services/api";
import "./SeedIdentification.css";

function SeedIdentification() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [identifying, setIdentifying] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Clear previous state when a new image is selected
  const handleFile = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg("Unsupported file format. Please upload JPG, PNG, or WEBP.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

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
        setErrorMsg(response.message || "Seed identification service is temporarily unavailable.");
      }
    } catch (err) {
      console.error("Seed identification error:", err);
      setErrorMsg("Unable to connect to PlantAI backend. Please check your connection.");
    } finally {
      setIdentifying(false);
    }
  };

  const seedData = result?.data;
  const isIdentified = result?.success && result?.status === "identified";
  const isLowConfidence = result?.status === "low_confidence" || result?.status === "uncertain";

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="page-badge">
          <Sprout size={14} />
          <span>Botanical Seed Recognition</span>
        </div>
        <h1 className="page-title">Seed Identification</h1>
        <p className="page-subtitle">
          Upload a clear close-up photograph of a seed, grain, or pod to determine its botanical species taxonomy.
        </p>
      </header>

      {/* 2-Column Seed Workspace */}
      <div className="seed-workspace-grid">
        {/* Left: Upload Workspace */}
        <div className="seed-left-panel">
          <div className="plant-card seed-upload-card">
            <h3 className="panel-title">Seed Specimen Upload</h3>
            <p className="panel-subtitle">Upload a macro or close-up photo of a seed on a contrasting background</p>

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
                <div className="dropzone-icon-wrap">
                  <UploadCloud size={28} />
                </div>
                <div className="dropzone-text">Click to upload seed photo or drag & drop</div>
                <div className="dropzone-hint">Place seeds on a plain background for maximum recognition accuracy</div>
                <input
                  id="seed-file-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleInputChange}
                  hidden
                />
              </div>
            ) : (
              <div className="uploaded-preview-wrapper">
                <div className="preview-container">
                  <img src={previewUrl} alt="Seed Specimen Preview" className="preview-image" />
                  
                  {/* Laser scan animation when analyzing */}
                  {identifying && (
                    <>
                      <div className="scan-beam"></div>
                      <div className="scan-overlay-grid"></div>
                    </>
                  )}

                  <button
                    className="btn-remove-preview"
                    onClick={handleRemoveImage}
                    title="Remove image"
                    disabled={identifying}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="preview-actions">
                  <button
                    className="btn btn-primary btn-analyze"
                    onClick={handleIdentify}
                    disabled={identifying}
                  >
                    {identifying ? (
                      <>
                        <span className="spinner"></span>
                        <span>Analyzing seed morphology...</span>
                      </>
                    ) : (
                      <>
                        <Sprout size={18} />
                        <span>Identify Seed</span>
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-outline btn-reset"
                    onClick={handleRemoveImage}
                    disabled={identifying}
                  >
                    <RotateCcw size={16} />
                    <span>Choose Another Seed</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="alert-banner alert-error">
                <AlertTriangle size={18} />
                <div>{errorMsg}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Result Panel */}
        <div className="seed-right-panel">
          <div className="plant-card seed-result-panel-card">
            <div className="result-panel-header">
              <h3 className="panel-title">Seed Classification</h3>
              {isIdentified && (
                <span className="badge badge-success">
                  <CheckCircle2 size={12} />
                  <span>Seed Verified</span>
                </span>
              )}
            </div>

            {/* State 1: Empty State */}
            {!result && !identifying && (
              <div className="empty-analysis-state">
                <div className="empty-state-icon">
                  <Sprout size={36} />
                </div>
                <h4>Ready for Seed Inspection</h4>
                <p>Upload a photograph of a seed, nut, grain, or pod to initiate optical taxonomy.</p>
                <div className="guidelines-card">
                  <strong>Photography tips for seed classification:</strong>
                  <ul>
                    <li>Use a neutral, plain background (such as white paper)</li>
                    <li>Ensure sharp camera focus on the seed coat and texture</li>
                    <li>Avoid extreme distance or blurry macro captures</li>
                  </ul>
                </div>
              </div>
            )}

            {/* State 2: Identifying Loading Animation */}
            {identifying && (
              <div className="loading-analysis-state">
                <div className="loading-radar-ring">
                  <div className="radar-pulse"></div>
                  <Sprout size={32} className="radar-icon" />
                </div>
                <h4>Analyzing Seed Morphology</h4>
                <p>Comparing seed coat texture, color gradients, and geometric contours with botanical taxonomy...</p>
                <div className="loading-step-list">
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Morphological contour segmentation</span>
                  </div>
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Taxonomic fruit/seed database matching</span>
                  </div>
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Strict confidence threshold validation</span>
                  </div>
                </div>
              </div>
            )}

            {/* State 3: Low Confidence Warning */}
            {isLowConfidence && (
              <div className="low-confidence-result-state">
                <div className="alert-banner alert-warning">
                  <AlertTriangle size={20} />
                  <div>
                    <strong style={{ fontSize: "15px" }}>Low confidence identification</strong>
                    <p style={{ marginTop: "4px", fontSize: "13.5px" }}>
                      The image does not provide enough evidence for a reliable seed identification.
                    </p>
                    <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      Try placing the seed on a plain, contrasting surface with brighter ambient lighting.
                    </p>
                    {seedData?.confidence_percent !== undefined && (
                      <div className="threshold-meta">
                        Observation score: <strong>{seedData.confidence_percent}%</strong> (Below confidence threshold).
                      </div>
                    )}
                  </div>
                </div>

                {seedData?.candidates && seedData.candidates.length > 0 && (
                  <div className="candidate-list">
                    <h5 className="candidates-heading">Possible Candidate Taxa:</h5>
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

            {/* State 4: Successful Identification (Adhering strictly to Rule 21: IDENTIFICATION ONLY) */}
            {isIdentified && seedData && (
              <div className="seed-identified-content">
                <div className="seed-result-card-inner">
                  <span className="species-tag">Seed Identified</span>
                  
                  <div className="seed-name-block">
                    <div className="field-group">
                      <span className="field-label">Common Name</span>
                      <h2 className="seed-common-name">
                        {seedData.common_name || seedData.seed_name}
                      </h2>
                    </div>

                    <div className="field-group" style={{ marginTop: "12px" }}>
                      <span className="field-label">Scientific Name</span>
                      <div className="seed-scientific-name">
                        <em>{seedData.scientific_name || seedData.seed_name}</em>
                      </div>
                    </div>
                  </div>

                  <div className="confidence-metric-row" style={{ marginTop: "20px" }}>
                    <span className="metric-label">Identification Confidence</span>
                    <span className="confidence-badge confidence-high">
                      {seedData.confidence_percent}% Confidence
                    </span>
                  </div>

                  <div className="confidence-bar-wrap">
                    <div 
                      className="confidence-bar-fill high"
                      style={{ width: `${Math.min(100, Math.max(20, seedData.confidence_percent))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Candidates if multiple */}
                {seedData.candidates && seedData.candidates.length > 1 && (
                  <div className="candidate-list">
                    <h5 className="candidates-heading">Alternative Species Candidates:</h5>
                    {seedData.candidates.slice(1, 4).map((cand, idx) => (
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

                {/* Action button per Section 22 */}
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleRemoveImage}
                    style={{ width: "100%", padding: "13px" }}
                  >
                    <RotateCcw size={16} />
                    <span>Identify Another Seed</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeedIdentification;
