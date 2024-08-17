import { getActiveTab } from "./tabUtils";
import { GLOBAL_CONSTANTS } from "../constants";

export function sendMessageToBackground(action, data = {}) {
  chrome.runtime.sendMessage({
    action,
    data,
    recipient: GLOBAL_CONSTANTS.RECIPIENTS.BACKGROUND,
  });
}

export function sendMessageToTabPromise(
  tabId: number,
  message: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

export async function sendMessageToActiveTab(message: any): Promise<any> {
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
