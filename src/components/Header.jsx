export default function Header({ role, setRole, panel, setPanel }) {
  const farmerTabs = [
    { id: "assess", label: "Assess crop" },
    { id: "assistant", label: "Ask assistant" },
    { id: "myclaims", label: "My claims" },
  ];

  return (
    <header className="top">
      <div className="brandrow">
        <div className="brand">
          <div className="mark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22V12" />
              <path d="M12 12C12 7 8 4 4 4c0 5 3 8 8 8Z" />
              <path d="M12 12c0-5 4-8 8-8 0 5-3 8-8 8Z" />
            </svg>
          </div>
          <div>
            <h1>Fasal Sahayak</h1>
            <p>AI crop damage assessment &amp; claim assistant</p>
          </div>
        </div>
        <div className="roleswitch">
          <button
            className={role === "farmer" ? "active" : ""}
            onClick={() => setRole("farmer")}
          >
            Farmer view
          </button>
          <button
            className={role === "officer" ? "active" : ""}
            onClick={() => setRole("officer")}
          >
            Officer view
          </button>
        </div>
      </div>

      {role === "farmer" && (
        <nav className="tabs">
          {farmerTabs.map((tab) => (
            <button
              key={tab.id}
              className={panel === tab.id ? "active" : ""}
              onClick={() => setPanel(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
