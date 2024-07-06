import { getActiveTab } from "./tabUtils";

export function sendMessageToBackground(action, data = {}) {
  chrome.runtime.sendMessage({ action, data });
}

export async function sendMessageToTab(message: any): Promise<any> {
  const activeTab = await getActiveTab();
  const response = await chrome.tabs.sendMessage(activeTab.id, message);
  return response;
}
