
function hasSpeechSynthesis() {
  return "speechSynthesis" in window &&
         "SpeechSynthesisUtterance" in window;
}

function speakChinese(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = Number(localStorage.getItem("zh-rate") || "0.85");
  utterance.pitch = Number(localStorage.getItem("zh-pitch") || "1.0");

  const preferredVoice = localStorage.getItem("zh-voice");
  const voices = speechSynthesis.getVoices();

  const selected =
    voices.find(v => v.name === preferredVoice) ||
    voices.find(v => v.lang.toLowerCase() === "zh-cn") ||
    voices.find(v => v.lang.toLowerCase().startsWith("zh"));

  if (selected) {
    utterance.voice = selected;
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

async function playChinese(button) {
  const text = button.dataset.text;
  const audioUrl = button.dataset.audio;
  const mode = localStorage.getItem("zh-audio-mode") || "webspeech";

  if (mode === "file" && audioUrl) {
    try {
      await new Audio(audioUrl).play();
      return;
    } catch (_) {
      // Fall through to Web Speech.
    }
  }

  if (hasSpeechSynthesis()) {
    speakChinese(text);
    return;
  }

  if (audioUrl) {
    await new Audio(audioUrl).play();
  }
}

document.addEventListener("click", event => {
  const button = event.target.closest(".zh-play");
  if (!button) return;
  playChinese(button);
});
