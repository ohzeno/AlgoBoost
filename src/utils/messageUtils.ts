import { getActiveTab } from "./tabUtils";

export function sendMessageToBackground(action, data = {}) {
  chrome.runtime.sendMessage({ action, data });
}

export async function sendMessageToTab(message: any): Promise<any> {
  const activeTab = await getActiveTab();
  const response = await chrome.tabs.sendMessage(activeTab.id, message);
  return response;
}

export function sendMessagePromise(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}
