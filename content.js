(function () {
  let currentIndex = 0;
  let words = [];

  function createOverlay() {
    let overlay = document.getElementById("focus-reader-overlay");
    if (overlay) {
      return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = "focus-reader-overlay";
    overlay.hidden = true;

    const content = document.createElement("div");
    content.id = "focus-reader-content";

    const input = document.createElement("textarea");
    input.id = "focus-reader-input";
    input.placeholder = "Type notes or answers here...";
    input.setAttribute("aria-label", "Notes");

    overlay.append(content, input);
    document.body.appendChild(overlay);
    return overlay;
  }

  function renderWord() {
    const content = document.getElementById("focus-reader-content");
    if (!content) {
      return;
    }

    if (currentIndex >= words.length) {
      content.textContent = "Done!";
      return;
    }

    content.replaceChildren();

    const currentWord = document.createElement("span");
    currentWord.className = "focus-reader-current";
    currentWord.textContent = words[currentIndex];
    content.appendChild(currentWord);

    const contextWords = words.slice(currentIndex + 1, currentIndex + 3);
    if (contextWords.length > 0) {
      const context = document.createElement("span");
      context.className = "focus-reader-context";
      context.textContent = ` ${contextWords.join(" ")}`;
      content.appendChild(context);
    }
  }

  function handleKeydown(event) {
    if (document.activeElement?.id === "focus-reader-input") {
      return;
    }

    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      currentIndex = Math.min(currentIndex + 1, words.length);
      renderWord();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      renderWord();
    } else if (event.key === "Escape") {
      const overlay = document.getElementById("focus-reader-overlay");
      if (overlay) {
        overlay.hidden = true;
      }
      document.removeEventListener("keydown", handleKeydown);
    }
  }

  function startFocusReader() {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      alert("Please highlight text first.");
      return;
    }

    words = selectedText.split(/\s+/);
    currentIndex = 0;

    const overlay = createOverlay();
    overlay.hidden = false;
    renderWord();

    document.removeEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", handleKeydown);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "start_focus_reader") {
      startFocusReader();
    }
  });
})();
