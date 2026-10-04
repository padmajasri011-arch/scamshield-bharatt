const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const RED_FLAGS = [
  { key: "guaranteed", label: "Guaranteed returns", points: 28, reason: "Promises of guaranteed/high returns can be a major scam warning sign." },
  { key: "double", label: "Unrealistic return claim", points: 24, reason: "Very large returns in a short period are a common manipulation pattern." },
  { key: "urgent", label: "Urgency / pressure", points: 18, reason: "Pressure to act immediately can prevent users from verifying a claim." },
  { key: "today", label: "Time pressure", points: 10, reason: "Deadline-style language is often used to push rushed decisions." },
  { key: "otp", label: "OTP / credential request", points: 30, reason: "Never share OTPs, passwords, PINs or authentication codes with unknown parties." },
  { key: "password", label: "Credential request", points: 30, reason: "Requests for passwords or sensitive credentials are high-risk." },
  { key: "pay", label: "Payment request", points: 16, reason: "Unexpected payment requests should be independently verified." },
  { key: "fee", label: "Advance fee", points: 20, reason: "Requests for an upfront fee to unlock returns or withdrawals are suspicious." },
  { key: "whatsapp", label: "Messaging-app solicitation", points: 10, reason: "Unsolicited investment offers through messaging platforms deserve extra verification." },
  { key: "telegram", label: "Messaging-app solicitation", points: 10, reason: "Unsolicited investment offers through messaging platforms deserve extra verification." },
  { key: "secret", label: "Secrecy / confidentiality pressure", points: 12, reason: "Requests to keep an investment opportunity secret reduce the chance of independent verification." }
];

function analyze(text = "") {
  const lower = text.toLowerCase();
  const flags = [];
  let score = 0;

  for (const rule of RED_FLAGS) {
    if (lower.includes(rule.key)) {
      if (!flags.some(f => f.label === rule.label)) {
        flags.push({ label: rule.label, reason: rule.reason });
        score += rule.points;
      }
    }
  }

  score = Math.min(100, score);
  let level = score >= 55 ? "HIGH" : score >= 25 ? "MEDIUM" : "LOW";

  if (!text.trim()) {
    return {
      riskScore: 0, level: "UNKNOWN", flags: [],
      summary: "No content was provided. Paste a message to analyze.",
      actions: ["Do not share OTPs, passwords or PINs.", "Verify financial claims through official sources.", "Avoid acting under pressure."]
    };
  }

  const summary =
    level === "HIGH" ? "Multiple high-risk warning patterns were detected. Treat this content as suspicious and verify independently."
    : level === "MEDIUM" ? "Some warning patterns were detected. Pause and independently verify the sender and claims."
    : "No strong warning pattern was detected by this prototype. This is not proof that the content is safe.";

  return {
    riskScore: score,
    level,
    flags,
    summary,
    actions: [
      "Do not share OTPs, passwords, PINs or other authentication secrets.",
      "Do not transfer money based only on an unsolicited message.",
      "Verify the sender, entity and claim through trusted official sources.",
      "If you suspect fraud, preserve evidence and use the appropriate official grievance/reporting channel."
    ]
  };
}

app.get("/api/health", (_, res) => res.json({ ok: true, service: "ScamShield Bharat" }));
app.post("/api/analyze", (req, res) => res.json(analyze(req.body.text || "")));

app.listen(PORT, () => console.log(`ScamShield Bharat API running on port ${PORT}`));