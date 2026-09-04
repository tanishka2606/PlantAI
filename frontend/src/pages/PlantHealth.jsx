import React, { useState } from "react";
import { 
  Activity, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Pill, 
  Sparkles, 
  RotateCcw,
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
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

  const handleDiagnose = async () => {
    if (!selectedFile) return;

    setDiagnosing(true);
    setResult(null);
    setErrorMsg("");

    try {
      const response = await checkPlantHealth(selectedFile);
      setResult(response);
      if (!response.success && response.status === "error") {
        setErrorMsg(response.message || "Plant health assessment service is temporarily unavailable.");
      }
    } catch (err) {
      console.error("Plant health diagnosis error:", err);
      setErrorMsg("Unable to connect to PlantAI. Please ensure the backend server is running.");
    } finally {
      setDiagnosing(false);
    }
  };

  const healthData = result?.data;
  const isAnalyzed = result?.success && result?.status === "analyzed";
  const isHealthy = isAnalyzed && healthData?.is_healthy;
  const isDiseased = isAnalyzed && !healthData?.is_healthy;
  const isLowConfidence = result?.status === "low_confidence" || result?.status === "uncertain";

  return (
    <div className="page-container">
      {/* Header */}
      <header className="page-header">
        <div className="page-badge">
          <Activity size={14} />
          <span>Foliar Pathology & Disease Diagnosis</span>
        </div>
        <h1 className="page-title">Plant Health Check</h1>
        <p className="page-subtitle">
          Upload an image of an affected leaf or plant section to analyze visible symptoms, detect potential pathogens, and obtain organic remedies.
        </p>
      </header>

      {/* 2-Column Pathology Workspace */}
      <div className="health-workspace-grid">
        {/* Left: Upload Workspace */}
        <div className="health-left-panel">
          <div className="plant-card health-upload-card">
            <h3 className="panel-title">Foliar Specimen Upload</h3>
            <p className="panel-subtitle">Upload a close-up photo of the affected leaf or stem tissue</p>

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
                <div className="dropzone-icon-wrap">
                  <UploadCloud size={28} />
                </div>
                <div className="dropzone-text">Click to upload leaf photo or drag & drop</div>
                <div className="dropzone-hint">Close-up leaf captures in balanced natural light yield the highest accuracy</div>
                <input
                  id="health-file-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleInputChange}
                  hidden
                />
              </div>
            ) : (
              <div className="uploaded-preview-wrapper">
                <div className="preview-container">
                  <img src={previewUrl} alt="Leaf Specimen Preview" className="preview-image" />
                  
                  {/* Cellular inspection scan animation */}
                  {diagnosing && (
                    <>
                      <div className="scan-beam"></div>
                      <div className="scan-overlay-grid"></div>
                    </>
                  )}

                  <button
                    className="btn-remove-preview"
                    onClick={handleRemoveImage}
                    title="Remove image"
                    disabled={diagnosing}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="preview-actions">
                  <button
                    className="btn btn-primary btn-analyze"
                    onClick={handleDiagnose}
                    disabled={diagnosing}
                  >
                    {diagnosing ? (
                      <>
                        <span className="spinner"></span>
                        <span>Evaluating foliar pathology...</span>
                      </>
                    ) : (
                      <>
                        <Activity size={18} />
                        <span>Analyze Plant Health</span>
                      </>
                    )}
                  </button>

                  <button
                    className="btn btn-outline btn-reset"
                    onClick={handleRemoveImage}
                    disabled={diagnosing}
                  >
                    <RotateCcw size={16} />
                    <span>Choose Another Photo</span>
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

        {/* Right: Diagnosis Result Panel */}
        <div className="health-right-panel">
          <div className="plant-card health-result-panel-card">
            <div className="result-panel-header">
              <h3 className="panel-title">Pathology Assessment</h3>
              {isHealthy && (
                <span className="badge badge-success">
                  <ShieldCheck size={13} />
                  <span>Healthy Plant</span>
                </span>
              )}
              {isDiseased && (
                <span className="badge badge-warning">
                  <ShieldAlert size={13} />
                  <span>Condition Detected</span>
                </span>
              )}
            </div>

            {/* State 1: Empty / Waiting State */}
            {!result && !diagnosing && (
              <div className="empty-analysis-state">
                <div className="empty-state-icon">
                  <Activity size={36} />
                </div>
                <h4>Ready for Health Diagnosis</h4>
                <p>Upload a photograph of your leaf or plant to inspect for chlorosis, necrosis, leaf spots, and pests.</p>
                <div className="guidelines-card">
                  <strong>Photography guidance for diagnostic accuracy:</strong>
                  <ul>
                    <li>Capture the boundary between discolored and healthy leaf tissue</li>
                    <li>Ensure sharp focus on spots, pustules, or powdery films</li>
                    <li>Avoid harsh backlighting or heavy shadows</li>
                  </ul>
                </div>
              </div>
            )}

            {/* State 2: Diagnosing Animation */}
            {diagnosing && (
              <div className="loading-analysis-state">
                <div className="loading-radar-ring">
                  <div className="radar-pulse"></div>
                  <Activity size={32} className="radar-icon" />
                </div>
                <h4>Inspecting Tissue Characteristics</h4>
                <p>Analyzing chlorophyll density, chromatic discoloration variance, and foliar lesion patterns...</p>
                <div className="loading-step-list">
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Multi-spectral chromatic variance analysis</span>
                  </div>
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Foliar lesion & necrotic margin segmentation</span>
                  </div>
                  <div className="loading-step active">
                    <span className="step-bullet"></span>
                    <span>Pathological recommendation compilation</span>
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
                    <strong style={{ fontSize: "15px" }}>Low confidence assessment</strong>
                    <p style={{ marginTop: "4px", fontSize: "13.5px" }}>
                      The image does not provide enough visual evidence for a reliable assessment.
                    </p>
                    <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-secondary)" }}>
                      Try uploading a clearer, close-up image showing the affected leaf in good natural lighting.
                    </p>
                    {healthData?.confidence_percent !== undefined && (
                      <div className="threshold-meta">
                        Observation score: <strong>{healthData.confidence_percent}%</strong> (Below confidence threshold).
                      </div>
                    )}
                  </div>
                </div>

                <div className="tips-box">
                  <strong>Recommendations for better photo capture:</strong>
                  <ul>
                    <li>Take a closer photo filling 80% of the frame with the leaf</li>
                    <li>Ensure adequate natural daylight without direct sun reflection</li>
                    <li>Turn off flash if it washes out leaf surface colors</li>
                  </ul>
                </div>
              </div>
            )}

            {/* State 4: Healthy Assessment */}
            {isHealthy && healthData && (
              <div className="health-assessment-content">
                <div className="health-status-box healthy-box">
                  <div className="status-badge-row">
                    <div className="status-pill status-pill-healthy">
                      <ShieldCheck size={16} />
                      <span>Status: Healthy Foliage</span>
                    </div>
                    <span className="confidence-badge confidence-high">
                      {healthData.confidence_percent}% Confidence
                    </span>
                  </div>

                  <h3 className="health-main-heading">No Critical Disease Detected</h3>
                  <p className="health-observation-text">
                    {healthData.observation || "Foliage structure appears healthy with uniform chlorophyll pigmentation and no major pathogen detected."}
                  </p>

                  <div className="confidence-bar-wrap">
                    <div 
                      className="confidence-bar-fill high"
                      style={{ width: `${Math.min(100, Math.max(20, healthData.confidence_percent))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="pathology-section-box">
                  <div className="section-title-row">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <h4>Maintenance Guidelines</h4>
                  </div>
                  <ul className="pathology-list">
                    {(healthData.recommendations || []).map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Guidance Notice */}
                <div className="ai-disclaimer-notice">
                  <Info size={16} />
                  <div>
                    <strong>AI Guidance Notice:</strong> {healthData.disclaimer || "This result is an AI-based visual assessment and should not be treated as a professional diagnosis."}
                  </div>
                </div>
              </div>
            )}

            {/* State 5: Possible Condition / Disease Detected */}
            {isDiseased && healthData && (
              <div className="health-assessment-content">
                <div className="health-status-box diseased-box">
                  <div className="status-badge-row">
                    <div className="status-pill status-pill-disease">
                      <ShieldAlert size={16} />
                      <span>Status: Possible Condition Detected</span>
                    </div>
                    <span className="confidence-badge confidence-medium">
                      {healthData.confidence_percent}% Confidence
                    </span>
                  </div>

                  <div className="condition-highlight-wrap">
                    <span className="condition-pre-label">Possible Condition</span>
                    <h2 className="condition-name">{healthData.condition || "Foliar Tissue Condition"}</h2>
                  </div>

                  <div className="observation-box">
                    <Eye size={16} className="text-accent" />
                    <div>
                      <strong>Visual Observation:</strong>
                      <p>{healthData.observation || "Visible discoloration and lesion patterns detected on foliage."}</p>
                    </div>
                  </div>

                  <div className="confidence-bar-wrap">
                    <div 
                      className="confidence-bar-fill medium"
                      style={{ width: `${Math.min(100, Math.max(20, healthData.confidence_percent))}%` }}
                    ></div>
                  </div>
                </div>

                {/* Suggested Next Steps / Treatments Grid */}
                <div className="pathology-grid">
                  <div className="pathology-section-box">
                    <div className="section-title-row">
                      <Sparkles size={16} className="text-emerald" />
                      <h4>Suggested Next Steps</h4>
                    </div>
                    <ul className="pathology-list">
                      {(healthData.recommendations || []).map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  {healthData.causes && healthData.causes.length > 0 && (
                    <div className="pathology-section-box">
                      <div className="section-title-row">
                        <Layers size={16} className="text-accent" />
                        <h4>Probable Causes</h4>
                      </div>
                      <ul className="pathology-list">
                        {healthData.causes.map((cause, idx) => (
                          <li key={idx}>{cause}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {healthData.treatments && healthData.treatments.length > 0 && (
                    <div className="pathology-section-box full-width">
                      <div className="section-title-row">
                        <Pill size={16} className="text-emerald" />
                        <h4>Recommended Treatments</h4>
                      </div>
                      <ul className="pathology-list">
                        {healthData.treatments.map((treat, idx) => (
                          <li key={idx}>{treat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* AI Guidance Notice */}
                <div className="ai-disclaimer-notice">
                  <Info size={16} />
                  <div>
                    <strong>AI Guidance Notice:</strong> {healthData.disclaimer || "This result is an AI-based visual assessment and should not be treated as a professional diagnosis."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlantHealth;
