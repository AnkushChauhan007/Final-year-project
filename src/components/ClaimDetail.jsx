import { useState } from "react";
import { updateClaim, uploadUrl } from "../api.js";
import { categoryBadgeClass, statusBadgeClass } from "./Badge.jsx";

export default function ClaimDetail({ claim, onDecided }) {
  const [note, setNote] = useState(claim.officerNote || "");
  const [saving, setSaving] = useState(false);

  async function decide(status) {
    setSaving(true);
    try {
      const updated = await updateClaim(claim.id, { status, officerNote: note.trim() });
      onDecided(updated);
    } catch (err) {
      alert("Could not save the decision. Make sure the backend is running.");
    } finally {
      setSaving(false);
    }
  }

  const imgUrl = claim.imageId ? uploadUrl(claim.imageId) : null;

  return (
    <div className="detailoverlay">
      <div className="detailgrid">
        <div>
          {imgUrl ? (
            <img src={imgUrl} alt={`Uploaded crop photo for ${claim.farmerName}`} />
          ) : (
            <div className="empty">No image</div>
          )}
        </div>
        <div>
          <div className="kv">
            <span>Claim ID</span>
            <span>{claim.id}</span>
          </div>
          <div className="kv">
            <span>Farmer</span>
            <span>{claim.farmerName}</span>
          </div>
          <div className="kv">
            <span>Phone</span>
            <span>{claim.phone || "—"}</span>
          </div>
          <div className="kv">
            <span>Crop</span>
            <span>{claim.cropType}</span>
          </div>
          <div className="kv">
            <span>Village / district</span>
            <span>{claim.village}</span>
          </div>
          <div className="kv">
            <span>Affected area</span>
            <span>{claim.area || "—"} acres</span>
          </div>
          <div className="kv">
            <span>AI assessment</span>
            <span>
              <span className={categoryBadgeClass(claim.aiCategory)}>{claim.aiCategory}</span>{" "}
              · {claim.aiConfidence}%
            </span>
          </div>
          <div className="kv">
            <span>Farmer notes</span>
            <span>{claim.notes || "—"}</span>
          </div>
          <div className="kv">
            <span>Current status</span>
            <span>
              <span className={statusBadgeClass(claim.status)}>{claim.status}</span>
            </span>
          </div>
          <label htmlFor="officerNoteInput">Officer note</label>
          <textarea
            id="officerNoteInput"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="decisionrow">
            <button className="btn btn-primary" disabled={saving} onClick={() => decide("Approved")}>
              Approve claim
            </button>
            <button
              className="btn btn-ghost"
              disabled={saving}
              onClick={() => decide("Needs more info")}
            >
              Request more info
            </button>
            <button className="btn btn-danger" disabled={saving} onClick={() => decide("Rejected")}>
              Reject claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
