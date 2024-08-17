import { PROGRAMMERS, GLOBAL_CONSTANTS } from "./constants";
import { getProgrammersSearchUrlTab } from "./utils/tabUtils";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.recipient !== GLOBAL_CONSTANTS.RECIPIENTS.BACKGROUND) return;
  if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_REQUEST) {
    const { searchUrl } = message.data;
    console.log(`sender`, sender.url);

    let searchUrlTab = await getProgrammersSearchUrlTab(searchUrl);
    if (!searchUrlTab) {
      chrome.tabs.create({ url: searchUrl, index: sender.tab.index }, (tab) => {
        searchUrlTab = tab;
      });
    }
    chrome.tabs.sendMessage(searchUrlTab.id, {
      action: PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB,
      recipient: GLOBAL_CONSTANTS.RECIPIENTS.CONTENT,
    });
    sendResponse({ Hi: "Hi2" });
  }
  return true;
});
