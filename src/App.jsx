import { useState } from "react";
import Header from "./components/Header.jsx";
import AssessCrop from "./components/AssessCrop.jsx";
import Assistant from "./components/Assistant.jsx";
import MyClaims from "./components/MyClaims.jsx";
import OfficerQueue from "./components/OfficerQueue.jsx";
import { API_BASE } from "./api.js";

export default function App() {
  const [role, setRole] = useState("farmer");
  const [panel, setPanel] = useState("assess");
  const [farmerName, setFarmerName] = useState("");

  function handleClaimSubmitted(name) {
    setFarmerName(name);
    setPanel("myclaims");
  }

  return (
    <div className="wrap">
      <h1 className="sr-only">
        Fasal Sahayak crop insurance assessment: upload crop images for AI damage assessment, ask
        a farmer assistant questions, and manage insurance claims across a farmer and an officer
        view.
      </h1>

      <Header role={role} setRole={setRole} panel={panel} setPanel={setPanel} />

      {role === "farmer" && (
        <section className="view">
          {panel === "assess" && <AssessCrop onClaimSubmitted={handleClaimSubmitted} />}
          {panel === "assistant" && <Assistant />}
          {panel === "myclaims" && (
            <MyClaims farmerName={farmerName} setFarmerName={setFarmerName} />
          )}
        </section>
      )}

      {role === "officer" && (
        <section className="view">
          <OfficerQueue />
        </section>
      )}

      <footer>
        <p>
          Connects to a Flask backend at <code>{API_BASE}</code>. Set VITE_API_BASE in a{" "}
          <code>.env</code> file if your backend runs elsewhere.
        </p>
      </footer>
    </div>
  );
}
