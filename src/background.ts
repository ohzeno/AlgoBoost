import { PROGRAMMERS } from "./constants";
import { getProgrammersSearchUrlTab } from "./utils/tabUtils";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO) {
    const { searchUrl } = message.data;
    console.log(`sender`, sender.url);

    const searchUrlTab = await getProgrammersSearchUrlTab(searchUrl);
    if (searchUrlTab) {
      if (searchUrlTab.url !== searchUrl) {
        chrome.tabs.sendMessage(searchUrlTab.id, {
          action: PROGRAMMERS.COMMANDS.SEARCH_RESET,
        });
      }
    } else {
    }

    sendResponse({ Hi: "Hi2" });
  }
  return true;
});
