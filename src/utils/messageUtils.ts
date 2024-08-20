import { getActiveTab } from "./tabUtils";
import { GLOBAL_CONSTANTS, PROGRAMMERS } from "../constants";

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

export function sendMessageWithPort(message: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let port;
    if (message.recipient === GLOBAL_CONSTANTS.RECIPIENTS.BACKGROUND) {
      port = chrome.runtime.connect({
        name: GLOBAL_CONSTANTS.PORT_NAMES.GET_PROBLEM_INFO_TO_BACKGROUND,
      });
    } else if (
      message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB
    ) {
      port = chrome.tabs.connect(message.tabId, {
        name: GLOBAL_CONSTANTS.PORT_NAMES.GET_PROBLEM_INFO_TO_CONTENT,
      });
    } else if (message.action === GLOBAL_CONSTANTS.COMMANDS.COPY) {
      const activeTab = await getActiveTab();
      port = chrome.tabs.connect(activeTab.id, {
        name: GLOBAL_CONSTANTS.PORT_NAMES.GET_FORMAT_TO_CONTENT,
      });
    }

    sendMessageThroughPort(port, message)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        port.disconnect();
      });
  });
}

function sendMessageThroughPort(
  port: chrome.runtime.Port,
  message: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    const listener = (response: any) => {
      if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response);
      }
      port.onMessage.removeListener(listener);
    };
    port.onMessage.addListener(listener);
    port.postMessage(message);
  });
}
