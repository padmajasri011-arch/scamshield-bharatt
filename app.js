const input = document.getElementById("input");
const result = document.getElementById("result");
const sampleBtn = document.getElementById("sampleBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

const sample = `URGENT!!! Invest ₹5,000 TODAY and get ₹25,000 guaranteed in 7 days. Limited seats. Contact us on WhatsApp and pay the processing fee now. Do not share this opportunity with others.`;

sampleBtn.onclick = () => { input.value = sample; input.focus(); };

analyzeBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) { input.focus(); return; }

  analyzeBtn.disabled = true;
  analyzeBtn.textContent = "Analyzing…";

  try {
    const apiBase = window.location.protocol === "file:" ? "http://localhost:3000" : "";
    const response = await fetch(`${apiBase}/api/analyze`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({text})
    });
    if (!response.ok) throw new Error("API error");
    render(await response.json());
  } catch (e) {
    render(localAnalyze(text));
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = "🔍 Analyze safely";
  }
};

function localAnalyze(text){
  const rules = [
    ["guaranteed","Guaranteed returns","Promises of guaranteed/high returns can be a major scam warning sign.",28],
    ["urgent","Urgency / pressure","Pressure to act immediately can prevent users from verifying a claim.",18],
    ["today","Time pressure","Deadline-style language is often used to push rushed decisions.",10],
    ["otp","OTP / credential request","Never share OTPs, passwords, PINs or authentication codes.",30],
    ["password","Credential request","Requests for passwords or sensitive credentials are high-risk.",30],
    ["pay","Payment request","Unexpected payment requests should be independently verified.",16],
    ["fee","Advance fee","Requests for an upfront fee to unlock returns or withdrawals are suspicious.",20],
    ["whatsapp","Messaging-app solicitation","Unsolicited investment offers through messaging platforms deserve extra verification.",10],
    ["telegram","Messaging-app solicitation","Unsolicited investment offers through messaging platforms deserve extra verification.",10],
    ["secret","Secrecy pressure","Requests to keep an investment opportunity secret reduce independent verification.",12]
  ];
  let score=0, flags=[];
  const lower=text.toLowerCase();
  rules.forEach(([key,label,reason,points])=>{if(lower.includes(key)&&!flags.some(f=>f.label===label)){flags.push({label,reason});score+=points;}});
  score=Math.min(100,score);
  const level=score>=55?"HIGH":score>=25?"MEDIUM":"LOW";
  return {riskScore:score,level,flags,summary:level==="HIGH"?"Multiple high-risk warning patterns were detected. Treat this content as suspicious and verify independently.":level==="MEDIUM"?"Some warning patterns were detected. Pause and independently verify the sender and claims.":"No strong warning pattern was detected by this prototype. This is not proof that the content is safe.",actions:["Do not share OTPs, passwords, PINs or other authentication secrets.","Do not transfer money based only on an unsolicited message.","Verify the sender, entity and claim through trusted official sources.","If you suspect fraud, preserve evidence and use the appropriate official grievance/reporting channel."]};
}

function render(data){
  result.classList.remove("hidden");
  document.getElementById("levelBadge").textContent = `${data.level} RISK`;
  document.getElementById("scoreText").textContent = `Risk score ${data.riskScore}/100`;
  document.getElementById("score").textContent = data.riskScore;
  document.getElementById("summary").textContent = data.summary;

  const deg = data.riskScore * 3.6;
  document.getElementById("scoreRing").style.background = `radial-gradient(circle at center,#11142a 58%,transparent 60%), conic-gradient(#ff6685 0deg,#ff6685 ${deg}deg,rgba(255,255,255,.08) ${deg}deg)`;

  document.getElementById("flagsList").innerHTML = data.flags.length
    ? data.flags.map(f=>`<div class="flag"><b>🚩 ${escapeHtml(f.label)}</b><p>${escapeHtml(f.reason)}</p></div>`).join("")
    : `<div class="flag"><b>✓ No strong pattern detected</b><p>Still verify the source independently. A low score is not a guarantee of safety.</p></div>`;

  document.getElementById("actionsList").innerHTML = data.actions.map(a=>`<div class="action">${escapeHtml(a)}</div>`).join("");
  result.scrollIntoView({behavior:"smooth",block:"start"});
}

function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}