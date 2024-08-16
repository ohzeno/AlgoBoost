import { PROGRAMMERS } from "./constants";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO) {
    const searchUrl = message.data;
    console.log("background.ts: searchUrl", searchUrl);
    sendResponse({ Hi: "Hi2" });
    // const tab = await getTab(searchUrl);
    // if (!tab) {
    //   return;
    // }
    // const tabId = tab.id;
    // chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    //   if (tabId === tabId && changeInfo.url) {
    //     chrome.tabs.onUpdated.removeListener(listener);
    //     chrome.tabs.sendMessage(tabId, { action: "init" });
    //   }
    // });
  }
  return true;
});
