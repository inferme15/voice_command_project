import React, { useState } from "react";
import axios from "axios";


function App() {
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [translated, setTranslated] = useState("");
  const [listening, setListening] = useState(false);
  const [mode, setMode] = useState("online"); // 'online' or 'offline'

  const handleStartListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "ta-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = async (event) => {
  const spokenText = event.results[0][0].transcript;
  setTranscript(spokenText);
  setListening(false);
  setLoading(true);  // ⏳ Start loading

  try {
    const res = await axios.post("http://localhost:5000/translate", {
      text: spokenText,
      mode: mode, // online/offline
    });
    setTranslated(res.data.translated);
  } catch (err) {
    console.error("Translation error:", err.message);
    setTranslated("Translation unavailable");
  } finally {
    setLoading(false); // ✅ Stop loading in all cases
  }
};


    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🎙️ Tamil to English Voice Command System</h2>

      <label>
        <strong>🌐 Mode:</strong>
        <select
          style={{ marginLeft: "10px" }}
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="online">🌐 Online</option>
          <option value="offline">📴 Offline</option>
        </select>
      </label>

      <br />
      <button onClick={handleStartListening} disabled={listening} style={{ marginTop: "20px" }}>
        {listening ? "🎧 Listening..." : "🎤 Speak in Tamil"}
      </button>

      <div style={{ marginTop: "30px" }}>
        <p><strong>🗣️ Tamil Input:</strong> {transcript || "Waiting..."}</p>
        <p>
  <strong>🌐 Translated English:</strong>{" "}
  {loading ? (
    <span>⏳ Translating...</span>
  ) : (
    translated || "..."
  )}
</p>

      </div>
    </div>
  );
}

export default App;
