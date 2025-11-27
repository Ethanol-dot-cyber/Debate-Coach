// === 1. ELEMENTS ===
const analyzeBtn = document.getElementById("analyzeBtn");
const speechInput = document.getElementById("speech");
const speechAudioInput = document.getElementById("speechAudio");
const formatSelect = document.getElementById("format");
const feedbackDiv = document.getElementById("feedback");
const speech1Input = document.getElementById("speech1");
const speech2Input = document.getElementById("speech2");
const speechAudio1Input = document.getElementById("speechAudio1");
const speechAudio2Input = document.getElementById("speechAudio2");
const compareBtn = document.getElementById("compareBtn");
const comparisonDiv = document.getElementById("comparisonFeedback");
const voiceText = document.getElementById("voiceText");
const startBtn = document.getElementById("startVoiceBtn");
const mic = document.getElementById("micContainer");
const voiceAnalyzeBtn = document.getElementById("voiceAnalyzeBtn");
const outputDiv = document.createElement("div");
document.body.appendChild(outputDiv);

// === 2. FORMAT PROFILE FUNCTION ===
function getFormatProfile(format) {
  if (format === "LD") {
    return `FORMAT: Lincoln-Douglas (LD)
Focus on:
- Value and value criterion
- Logical consistency and use of philosophy
- Use of evidence
- Clash with the opponent
- Overall clarity and structure`;
  } else if (format === "PF") {
    return `FORMAT: Public Forum (PF)
Focus on:
- Clear contention structure
- Use of evidence and sources
- Rebuttal and frontline responses
- Weighing of impacts
- Team strategy and clarity`;
  } else {
    return `FORMAT: Congressional Debate
Focus on:
- Originality of arguments on the bill
- Use of evidence and sources
- Responsiveness to previous speakers
- Organization and clarity
- Professional decorum`;
  }
}

// === 3. MOCK TEXT FEEDBACK ===
function generateMockFeedback(format, text) {
  const strengths = [];
  const improvements = [];

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // --- Strengths ---
  if (wordCount > 150) strengths.push("Your speech is well-developed and detailed.");
  else if (wordCount > 80) strengths.push("Your speech has a solid amount of explanation.");
  else strengths.push("Your ideas are concise and easy to follow.");

  if (/because|therefore|thus|so/.test(text.toLowerCase()))
    strengths.push("You use reasoning connectives that make your argument clearer.");

  if (/[.!?]/.test(text)) strengths.push("Your sentence structure shows good pacing.");

  // --- Areas to Improve ---
  if (wordCount < 80) improvements.push("Add more elaboration and examples to strengthen arguments.");
  if (!text.toLowerCase().includes("evidence") && !text.toLowerCase().includes("example"))
    improvements.push("Include explicit evidence or examples to support your claims.");
  if (!text.match(/[!?]/)) improvements.push("Try varying tone with stronger concluding or impactful statements.");

  return `
Text Feedback:
- Strengths: ${strengths.join(", ")}
- Areas to Improve: ${improvements.join(", ") || "None detected"}
`;
}

// === 4. MOCK AUDIO FEEDBACK ===
function generateMockAudioFeedback(audioFile) {
  const sizeKB = audioFile.size / 1024;
  const strengths = [];
  const improvements = [];

  if (sizeKB < 100) improvements.push("Audio very short; speak slower and elaborate more.");
  else if (sizeKB > 1000) {
    strengths.push("Plenty of speech material.");
    improvements.push("Stay on topic; avoid rambling.");
  } else strengths.push("Speech length is good for practice.");

  const persuasivenessScore = Math.floor(Math.random() * 4) + 6;

  return `
Audio Feedback:
- Estimated persuasiveness score: ${persuasivenessScore}/10
- Strengths: ${strengths.join(", ") || "N/A"}
- Areas to improve: ${improvements.join(", ") || "N/A"}
`;
}

// === 5. COMPARE TWO SPEECHES ===
function compareTwoSpeeches(format) {
  const speech1 = speech1Input.value.trim();
  const speech2 = speech2Input.value.trim();
  const audio1 = speechAudio1Input.files[0];
  const audio2 = speechAudio2Input.files[0];

  if (!speech1 && !speech2 && !audio1 && !audio2) {
    comparisonDiv.textContent = "Provide at least one speech or audio.";
    return;
  }

  const textFeedback1 = speech1 ? generateMockFeedback(format, speech1) : "";
  const textFeedback2 = speech2 ? generateMockFeedback(format, speech2) : "";
  const audioFeedback1 = audio1 ? generateMockAudioFeedback(audio1) : "";
  const audioFeedback2 = audio2 ? generateMockAudioFeedback(audio2) : "";

  const wordCount1 = speech1.split(/\s+/).filter(Boolean).length;
  const wordCount2 = speech2.split(/\s+/).filter(Boolean).length;
  const betterText = wordCount1 > wordCount2 ? "Speech 1 seems more developed." : "Speech 2 seems more developed.";

  const comparisonSummary = `
---------------------------
Speech 1 Feedback
---------------------------
${textFeedback1}
${audioFeedback1}

---------------------------
Speech 2 Feedback
---------------------------
${textFeedback2}
${audioFeedback2}

---------------------------
Comparison Summary
---------------------------
- ${betterText}
- Check which speech has clearer explanations and stronger examples.
- Consider combining the best points from both speeches for practice.
`;

  comparisonDiv.textContent = comparisonSummary;
}

// === 6. BUTTON LISTENERS ===
analyzeBtn.addEventListener("click", () => {
  const speech = speechInput.value.trim();
  const audio = speechAudioInput.files[0];
  const format = formatSelect.value;

  if (!speech && !audio) {
    feedbackDiv.textContent = "Please provide speech text or audio.";
    return;
  }

  let result = "";
  if (speech) result += generateMockFeedback(format, speech);
  if (audio) result += generateMockAudioFeedback(audio);

  feedbackDiv.textContent = getFormatProfile(format) + "\n" + result;
});

compareBtn.addEventListener("click", () => {
  const format = formatSelect.value;
  comparisonDiv.textContent = "Generating comparison...";
  compareTwoSpeeches(format);
});

// === 7. VOICE INPUT SETUP ===
let recognition;
try {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";
} catch (error) {
  alert("Your browser doesn't support speech recognition.");
}

startBtn.addEventListener("click", () => {
  mic.style.display = "flex";
  voiceText.value = "";
  recognition.start();
});

recognition.onresult = (event) => {
  let transcript = "";
  for (let i = 0; i < event.results.length; i++) {
    transcript += event.results[i][0].transcript + " ";
  }
  voiceText.value = transcript.trim();
};

recognition.onend = () => {
  mic.style.display = "none";
};

// === 8. VOICE FEEDBACK BUTTON ===
voiceAnalyzeBtn.addEventListener("click", async () => {
  const speech = voiceText.value.trim();
  if (!speech) {
    alert("Please speak first before requesting feedback.");
    return;
  }

  outputDiv.textContent = "Generating feedback...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_OPENAI_KEY" // <-- REPLACE THIS
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a debate coach who gives helpful, specific feedback." },
          { role: "user", content: speech }
        ]
      })
    });

    const data = await response.json();
    outputDiv.textContent = data.choices[0].message.content;

  } catch (error) {
    outputDiv.textContent = "Error getting feedback: " + error.message;
  }
});
