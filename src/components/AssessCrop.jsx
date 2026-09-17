import { useState } from "react";
import { assessImage } from "../api.js";
import { categoryBadgeClass } from "./Badge.jsx";
import ClaimForm from "./ClaimForm.jsx";

export default function AssessCrop({ onClaimSubmitted }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [assessing, setAssessing] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);

  function handleFile(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setShowClaimForm(false);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(selected);
  }

  async function runAssessment() {
    setAssessing(true);
    try {
      const data = await assessImage(file);
      setResult(data);
    } catch (err) {
      alert("Could not reach the backend. Make sure it is running (python app.py).");
    } finally {
      setAssessing(false);
    }
  }

  function resetAfterSubmit(name) {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setShowClaimForm(false);
    onClaimSubmitted(name);
  }

  return (
    <div>
      <h2>Upload a photo of the damaged crop</h2>
      <p className="subtext">
        Sent to the backend's <code>/api/assess</code> endpoint for a preliminary damage category
        and confidence score.
      </p>
      <div className="grid2">
        <div>
          <label
            className="dropzone"
            htmlFor="fileInput"
            style={{ display: "block" }}
          >
            <strong>Click to upload a crop image</strong>
            <p>JPG or PNG, taken in the field</p>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          {previewUrl && (
            <div className="preview-wrap">
              <img src={previewUrl} alt="Uploaded crop photo preview" />
            </div>
          )}
          <button
            className="btn btn-primary btn-block"
            onClick={runAssessment}
            disabled={!file || assessing}
          >
            {assessing ? "Assessing…" : "Run AI assessment"}
          </button>
        </div>

        {result && (
          <div className="card">
            <h2>Assessment result</h2>
            <span className={categoryBadgeClass(result.category)}>{result.category}</span>
            <div className="conf-row">
              <div className="conf-track">
                <div className="conf-fill" style={{ width: `${result.confidence}%` }} />
              </div>
              <div className="conf-label">{result.confidence}%</div>
            </div>
            <p className="subtext" style={{ marginBottom: 0 }}>
              {result.explanation}
            </p>
            <div className="note">
              Model status: demo heuristic. In production this is replaced by the trained
              YOLOv8 / MobileNet classifier (see backend/ai_model.py).
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => setShowClaimForm(true)}
            >
              File an insurance claim with this result
            </button>
          </div>
        )}
      </div>

      {showClaimForm && (
        <ClaimForm
          lastResult={result}
          onSubmitted={resetAfterSubmit}
          onCancel={() => setShowClaimForm(false)}
        />
      )}
    </div>
  );
}
