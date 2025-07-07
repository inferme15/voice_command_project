const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 🔄 Simple Offline Mapping (Local fallback)
const offlineCommandMap = {
  "பக்கெட் தூக்கு": "Lift the bucket",
  "இயந்திரத்தை நிறுத்து": "Stop the machine",
  "தெரியவில்லை": "I don't know",
  "நான் அவனை காதலிக்கிறேன்": "I love him"
};

// 🧠 Translate API endpoint
app.post("/translate", async (req, res) => {
  const { text, mode } = req.body;

  console.log("🗣️ Input received:", text);

  // 📴 Offline mode
  if (mode === "offline") {
  const cleanText = text.trim().replace(/[.,?!؟!₹]/g, "");
  const translated = offlineCommandMap[cleanText] || "Unknown command";
  console.log("📴 Offline:", translated);
  return res.json({ translated });
}


// 🌐 Online mode
try {
  const apiUrl = "https://translate.argosopentech.com/translate";

  const response = await axios.post(
  "https://translate.argosopentech.com/translate",
  {
    q: text,
    source: "ta",
    target: "en",
    format: "text",
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);

  console.log("📤 Sending to API:", {
  q: text,
  source: "ta",
  target: "en",
});

console.log("🌐 API Response:", response.data);

  console.log("🌐 API Response (raw):", JSON.stringify(response.data, null, 2));

  // Try all possible keys
  const translated =
    response.data.translatedText ||
    response.data.translation ||
    response.data.text ||
    response.data[0]?.translatedText ||
    "Translation unavailable";

  res.json({ translated });

} catch (error) {
  console.error("❌ API Error:", error.message);
  if (error.response) {
    console.error("💥 API Response Error:", error.response.data);
  }
  res.status(500).json({ translated: "Translation failed (API error)" });
}
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
