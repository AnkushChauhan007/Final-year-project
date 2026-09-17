import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../api.js";

const SUGGESTED_CHIPS = [
  "How do I file a claim?",
  "What is PMFBY?",
  "Fertilizer advice",
  "My crop is waterlogged",
];

export default function Assistant() {
  const [log, setLog] = useState([]);
  const [input, setInput] = useState("");
  const windowRef = useRef(null);

  useEffect(() => {
    if (log.length === 0) {
      setLog([
        {
          role: "bot",
          text:
            "Hello, I'm your farmer assistant. Ask me about crop diseases, insurance schemes, the claim process, fertilizers, or preventive measures.",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.scrollTop = windowRef.current.scrollHeight;
    }
  }, [log]);

  async function send(text) {
    const message = text.trim();
    if (!message) return;
    setLog((l) => [...l, { role: "user", text: message }]);
    setInput("");
    try {
      const data = await sendChatMessage(message);
      setLog((l) => [...l, { role: "bot", text: data.reply }]);
    } catch (err) {
      setLog((l) => [
        ...l,
        { role: "bot", text: "Could not reach the backend — make sure it is running." },
      ]);
    }
  }

  return (
    <div>
      <h2>Ask the farmer assistant</h2>
      <p className="subtext">Calls the backend's <code>/api/chatbot</code> endpoint.</p>
      <div className="chat-window" ref={windowRef}>
        {log.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chips">
        {SUGGESTED_CHIPS.map((chip) => (
          <button key={chip} className="chip" onClick={() => send(chip)}>
            {chip}
          </button>
        ))}
      </div>
      <div className="chatinput">
        <input
          type="text"
          placeholder="Type a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send(input);
          }}
        />
        <button className="btn btn-primary" onClick={() => send(input)}>
          Send
        </button>
      </div>
    </div>
  );
}
