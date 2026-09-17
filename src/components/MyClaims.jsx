import { useEffect, useState } from "react";
import { listClaims } from "../api.js";
import { categoryBadgeClass, statusBadgeClass } from "./Badge.jsx";

export default function MyClaims({ farmerName, setFarmerName }) {
  const [claims, setClaims] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const name = farmerName.trim();
    if (!name) {
      setClaims(null);
      return;
    }
    let cancelled = false;
    listClaims({ farmer: name })
      .then((data) => {
        if (!cancelled) {
          setClaims(data);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [farmerName]);

  return (
    <div>
      <h2>My claims</h2>
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="myFarmerName">Show claims for</label>
        <input
          type="text"
          id="myFarmerName"
          placeholder="Enter the farmer name used when submitting"
          value={farmerName}
          onChange={(e) => setFarmerName(e.target.value)}
        />
      </div>

      {!farmerName.trim() && (
        <div className="empty">Enter your name above to see your claims.</div>
      )}
      {farmerName.trim() && loadError && (
        <div className="empty">Could not reach the backend.</div>
      )}
      {farmerName.trim() && !loadError && claims && claims.length === 0 && (
        <div className="empty">No claims found for this name yet.</div>
      )}
      {claims &&
        claims.map((c) => (
          <div className="card" key={c.id} style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <div>
                <strong>{c.id}</strong> · {c.cropType} · {c.village}
              </div>
              <span className={statusBadgeClass(c.status)}>{c.status}</span>
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <span className={categoryBadgeClass(c.aiCategory)}>{c.aiCategory}</span>
              <span className="subtext" style={{ margin: 0 }}>
                AI confidence {c.aiConfidence}%
              </span>
            </div>
            {c.officerNote && (
              <div className="note" style={{ marginTop: 10 }}>
                Officer note: {c.officerNote}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
