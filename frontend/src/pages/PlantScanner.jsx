import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, 
  Scan, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Bot, 
  Sparkles, 
  Dna, 
  Layers, 
  RotateCcw,
  ArrowRight
} from "lucide-react";
import { uploadPlant } from "../services/api";
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

    // Validate type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg("Unsupported file format. Please upload JPG, PNG, or WEBP.");
      return;
    }

    // Validate size (10MB limit)
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

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setResult(null);
    setErrorMsg("");

    try {
      const response = await uploadPlant(selectedFile);
      setResult(response);
      if (!response.success && response.status === "error") {
        setErrorMsg(response.message || "Failed to identify plant.");
      }
    } catch (err) {
      console.error("Plant identification error:", err);
      setErrorMsg("Unable to connect to PlantAI. Please ensure the backend server is running.");
    } finally {
      setAnalyzing(false);
    }
  };

  const plantData = result?.data;
  const isIdentified = result?.success && result?.status === "identified";
  const isLowConfidence = result?.status === "low_confidence";

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="page-badge">
          <Scan size={14} />
          <span>Precision Taxonomic Vision</span>
        </div>
        <h1 className="page-title">AI Plant Scanner</h1>
        <p className="page-subtitle">
          Upload a clear photograph of a leaf, flower, or whole plant to determine its species taxonomy and retrieve cultivation care data.
        </p>
      </header>

      {/* Main 2-Column Workspace */}
      <div className="scanner-workspace-grid">
        {/* Left Column: Upload Area */}
        <div className="scanner-left-panel">
          <div className="plant-card upload-card">
            <h3 className="panel-title">Specimen Upload</h3>
            <p className="panel-subtitle">Select or drop a botanical image for optical inspection</p>

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
                <div className="dropzone-icon-wrap">
                  <UploadCloud size={28} />
                </div>
                <div className="dropzone-text">Click to upload or drag & drop</div>
                <div className="dropzone-hint">Supports JPG, JPEG, PNG, WEBP (Max 10MB)</div>
                <input
                  id="plant-file-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleInputChange}
                  hidden
                />
              </div>
            ) : (
              <div className="uploaded-preview-wrapper">
                <div className="preview-container">
                  <img src={previewUrl} alt="Specimen Preview" className="preview-image" />
                  
                  {/* Laser scan animation when analyzing */}
                  {analyzing && (
                    <>
                      <div className="scan-beam"></div>
                      <div className="scan-overlay-grid"></div>
                    </>
                  )}

                  <button
                    className="btn-remove-preview"
                    onClick={handleRemoveImage}
                    title="Remove image"
                    disabled={analyzing}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="preview-actions">
                  <button
                    className="btn btn-primary btn-analyze"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                  >
                    {analyzing ? (
                      <>
                        <span className="spinner"></span>
                        <span>Analyzing botanical features...</span>
                      </>
                    ) : (
                      <>
                        <Scan size={18} />
                        <span>Analyze Plant</span>
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-outline btn-reset"
                    onClick={handleRemoveImage}
                    disabled={analyzing}
                  >
                    <RotateCcw size={16} />
                    <span>Choose Another</span>
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

        {/* Right Column: Analysis Result Panel */}
        <div className="scanner-right-panel">
          <div className="plant-card result-panel-card">
            <div className="result-panel-header">
              <h3 className="panel-title">Taxonomic Intelligence</h3>
              {isIdentified && (
                <span className="badge badge-success">
                  <CheckCircle2 size={12} />
                  <span>Verified Match</span>
                </span>
              )}
            </div>

            {/* State 1: Empty / Waiting State */}
            {!result && !analyzing && (
              <div className="empty-analysis-state">
                <div className="empty-state-icon">
                  <Scan size={36} />
                </div>
                <h4>Ready for Specimen</h4>
                <p>Upload a clear photo on the left and click "Analyze Plant" to initiate neural classification.</p>
                <div className="guidelines-card">
                  <strong>For optimal taxonomic accuracy:</strong>
                  <ul>
                    <li>Photograph in natural daylight without strong glare</li>
                    <li>Ensure leaves, flowers, or fruit are in sharp focus</li>
                    <li>Avoid extreme distance or crowded multi-species backgrounds</li>
                  </ul>
                </div>
              </div>
            )}

            {/* State 2: Loading Analysis State */}
            {analyzing && (
              <div className="loading-analysis-state">
                <div className="loading-radar-ring">
                  <div className="radar-pulse"></div>
                  <Scan size={32} className="radar-icon" />
                </div>
                <h4>Examining Specimen Features</h4>
                <p>Querying botanical neural taxonomy against millions of reference observations...</p>
                <div className="loading-step-list">
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Multi-spectral pixel pre-flight validation</span>
                  </div>
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Taxonomic organ and feature extraction</span>
                  </div>
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Confidence threshold evaluation</span>
                  </div>
                </div>
              </div>
            )}

            {/* State 3: Low Confidence State */}
            {isLowConfidence && (
              <div className="low-confidence-result-state">
                <div className="alert-banner alert-warning">
                  <AlertTriangle size={18} />
                  <div>
                    <strong>Low confidence identification</strong>
                    <p style={{ marginTop: "4px" }}>
                      Try uploading a clearer image showing the leaves, flower, stem or whole plant.
                    </p>
                    {plantData?.confidence_percent !== undefined && (
                      <div className="threshold-meta">
                        Observation score: <strong>{plantData.confidence_percent}%</strong> (Below confidence threshold).
                      </div>
                    )}
                  </div>
                </div>

                {plantData?.candidates && plantData.candidates.length > 0 && (
                  <div className="candidate-list">
                    <h5 className="candidates-heading">Potential Candidate Matches:</h5>
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

            {/* State 4: High Confidence Identification */}
            {isIdentified && plantData && (
              <div className="identified-result-state">
                <div className="primary-identification-box">
                  <div className="ident-top-row">
                    <div>
                      <span className="species-tag">Taxonomic Match</span>
                      <h2 className="plant-common-name">
                        {plantData.common_name || plantData.plant_name}
                      </h2>
                      <div className="plant-scientific-name">
                        <em>{plantData.scientific_name}</em>
                      </div>
                    </div>
                    <span
                      className={`confidence-badge ${
                        plantData.confidence >= 0.70 ? "confidence-high" : "confidence-medium"
                      }`}
                    >
                      {plantData.confidence_percent}% Match
                    </span>
                  </div>

                  {/* Confidence progress bar */}
                  <div className="confidence-metric-row">
                    <span className="metric-label">Identification confidence:</span>
                    <strong className="metric-pct">{plantData.confidence_percent}%</strong>
                  </div>
                  <div className="confidence-bar-wrap">
                    <div 
                      className={`confidence-bar-fill ${plantData.confidence >= 0.70 ? "high" : "medium"}`}
                      style={{ width: `${Math.min(100, Math.max(15, plantData.confidence_percent))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Botanical Metadata Cards */}
                <div className="botanical-meta-grid">
                  <div className="meta-card">
                    <div className="meta-card-label">
                      <Dna size={14} />
                      <span>Species</span>
                    </div>
                    <div className="meta-card-val">{plantData.species || plantData.scientific_name}</div>
                  </div>

                  <div className="meta-card">
                    <div className="meta-card-label">
                      <Layers size={14} />
                      <span>Genus</span>
                    </div>
                    <div className="meta-card-val">{plantData.genus || "Taxonomic Genus"}</div>
                  </div>

                  {plantData.family && (
                    <div className="meta-card">
                      <div className="meta-card-label">
                        <Sparkles size={14} />
                        <span>Family</span>
                      </div>
                      <div className="meta-card-val">{plantData.family}</div>
                    </div>
                  )}
                </div>

                {/* Alternative Candidates */}
                {plantData.candidates && plantData.candidates.length > 1 && (
                  <div className="candidate-list">
                    <h5 className="candidates-heading">Alternative Candidates:</h5>
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

                {/* Action CTAs */}
                <div className="identification-action-row">
                  <button
                    className="btn btn-primary btn-action-care"
                    onClick={() =>
                      navigate(`/plant-care/${encodeURIComponent(plantData.scientific_name)}`, {
                        state: {
                          plantName: plantData.scientific_name,
                          commonName: plantData.common_name,
                        },
                      })
                    }
                  >
                    <BookOpen size={16} />
                    <span>View Care Guide</span>
                  </button>

                  <button
                    className="btn btn-outline btn-action-assistant"
                    onClick={() =>
                      navigate("/assistant", {
                        state: {
                          plantName: plantData.common_name || plantData.scientific_name,
                        },
                      })
                    }
                  >
                    <Bot size={16} />
                    <span>Ask AI Assistant</span>
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

export default PlantScanner;
