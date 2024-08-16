import { PROGRAMMERS } from "./constants";
import { getProgrammersSearchUrlTab } from "./utils/tabUtils";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO) {
    const { searchUrl } = message.data;
    console.log("background.ts: searchUrl", searchUrl);
    console.log(`sender`, sender.url);

    const tab = await getProgrammersSearchUrlTab(searchUrl);
    console.log("tab", tab);

    sendResponse({ Hi: "Hi2" });
  }
  return true;
});
