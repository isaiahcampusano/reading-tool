chrome.action.onClicked.addListener((tab) => {
  if (tab.id === undefined) {
    return;
  }

  chrome.tabs.sendMessage(tab.id, { action: "start_focus_reader" });
});
