export function sendMessageToBackground(action, data = {}) {
  chrome.runtime.sendMessage({ action, data });
}
