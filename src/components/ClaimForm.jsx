import { useState } from "react";
import { createClaim } from "../api.js";

export default function ClaimForm({ lastResult, onSubmitted, onCancel }) {
  const [fields, setFields] = useState({
    farmerName: "",
    phone: "",
    cropType: "",
    village: "",
    area: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(key) {
    return (e) => setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const name = fields.farmerName.trim();
    const crop = fields.cropType.trim();
    const village = fields.village.trim();
    if (!name || !crop || !village) {
      setError("Please fill in farmer name, crop type and village.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await createClaim({
        farmerName: name,
        phone: fields.phone.trim(),
        cropType: crop,
        village,
        area: fields.area.trim(),
        notes: fields.notes.trim(),
        imageId: lastResult ? lastResult.imageId : "",
        aiCategory: lastResult ? lastResult.category : "Not assessed",
        aiConfidence: lastResult ? lastResult.confidence : 0,
      });
      onSubmitted(name);
    } catch (err) {
      setError("Could not submit claim. Make sure the backend is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="claim-form" onSubmit={handleSubmit}>
      <h2>Claim details</h2>
      <div className="grid2">
        <div>
          <label htmlFor="farmerName">Farmer name</label>
          <input
            type="text"
            id="farmerName"
            value={fields.farmerName}
            onChange={update("farmerName")}
            required
          />
          <label htmlFor="farmerPhone">Phone number</label>
          <input
            type="tel"
            id="farmerPhone"
            placeholder="Optional"
            value={fields.phone}
            onChange={update("phone")}
          />
          <label htmlFor="cropType">Crop type</label>
          <input
            type="text"
            id="cropType"
            value={fields.cropType}
            onChange={update("cropType")}
            required
          />
        </div>
        <div>
          <label htmlFor="village">Village / district</label>
          <input
            type="text"
            id="village"
            value={fields.village}
            onChange={update("village")}
            required
          />
          <label htmlFor="area">Affected area (acres)</label>
          <input type="text" id="area" value={fields.area} onChange={update("area")} />
          <label htmlFor="claimNotes">Notes for the officer</label>
          <textarea id="claimNotes" value={fields.notes} onChange={update("notes")} />
        </div>
      </div>
      {error && <div className="err">{error}</div>}
      <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }} disabled={submitting}>
        {submitting ? "Submitting…" : "Submit claim"}
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ marginTop: 16, marginLeft: 8 }}
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
}
