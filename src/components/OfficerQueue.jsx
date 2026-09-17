import { useEffect, useState } from "react";
import { listClaims, getClaim } from "../api.js";
import { categoryBadgeClass, statusBadgeClass } from "./Badge.jsx";
import ClaimDetail from "./ClaimDetail.jsx";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Pending review", label: "Pending review" },
  { value: "Approved", label: "Approved" },
  { value: "Needs more info", label: "Needs more info" },
  { value: "Rejected", label: "Rejected" },
];

export default function OfficerQueue() {
  const [status, setStatus] = useState("all");
  const [claims, setClaims] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [activeClaim, setActiveClaim] = useState(null);

  async function refresh() {
    try {
      const data = await listClaims({ status });
      setClaims(data);
      setLoadError(false);
    } catch (err) {
      setClaims([]);
      setLoadError(true);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function openDetail(id) {
    try {
      const claim = await getClaim(id);
      setActiveClaim(claim);
    } catch (err) {
      alert("Could not load that claim.");
    }
  }

  function handleDecided(updatedClaim) {
    setActiveClaim(null);
    refresh();
  }

  return (
    <div>
      <h2>Claims queue</h2>
      <p className="subtext">
        Loaded from <code>/api/claims</code>.
      </p>
      <div className="filterbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button className="btn btn-ghost" onClick={refresh}>
          Refresh
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Farmer</th>
            <th>Crop</th>
            <th>AI category</th>
            <th>Confidence</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c) => (
            <tr key={c.id} className="claimrow" onClick={() => openDetail(c.id)}>
              <td>{c.farmerName}</td>
              <td>{c.cropType}</td>
              <td>
                <span className={categoryBadgeClass(c.aiCategory)}>{c.aiCategory}</span>
              </td>
              <td>{c.aiConfidence}%</td>
              <td>
                <span className={statusBadgeClass(c.status)}>{c.status}</span>
              </td>
              <td>{(c.submittedAt || "").slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {claims.length === 0 && (
        <div className="empty">
          {loadError ? "Could not reach the backend." : "No claims match this filter yet."}
        </div>
      )}

      {activeClaim && <ClaimDetail claim={activeClaim} onDecided={handleDecided} />}
    </div>
  );
}
