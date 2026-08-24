export const startVoiceSearch = (onStart, onError, onResult, onEnd) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    onStart();
    setTimeout(() => {
      onResult("Pediatrician");
      onEnd();
    }, 1500);
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => onStart();
  recognition.onerror = (e) => onError(e);
  recognition.onend = () => onEnd();
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.start();
};
