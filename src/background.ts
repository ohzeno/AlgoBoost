import { PROGRAMMERS, GLOBAL_CONSTANTS } from "./constants";
import { getProgrammersSearchUrlTab } from "./utils/tabUtils";
import { sendMessageWithPort } from "./utils/messageUtils";

chrome.runtime.onConnect.addListener(function (port) {
  if (
    port.name !== GLOBAL_CONSTANTS.PORT_NAMES.GET_PROBLEM_INFO_TO_BACKGROUND
  ) {
    return;
  }

  port.onMessage.addListener(async function (message) {
    if (message.recipient !== GLOBAL_CONSTANTS.RECIPIENTS.BACKGROUND) return;
    if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_REQUEST) {
      const { searchUrl, problemUrl } = message.data;

      try {
        let created;
        let searchUrlTab = await getProgrammersSearchUrlTab(searchUrl);
        if (!searchUrlTab) {
          searchUrlTab = await new Promise((resolve) => {
            chrome.tabs.create(
              { url: searchUrl, index: port.sender.tab.index, active: false },
              (tab) => {
                chrome.tabs.onUpdated.addListener(function listener(
                  tabId,
                  info
                ) {
                  if (tabId === tab.id && info.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener);
                    created = true;
                    resolve(tab);
                  }
                });
              }
            );
          });
        }
        const response = await sendMessageWithPort({
          action: PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB,
          data: { problemUrl },
          recipient: GLOBAL_CONSTANTS.RECIPIENTS.CONTENT,
          tabId: searchUrlTab.id,
        });
        if (created) chrome.tabs.remove(searchUrlTab.id);

        port.postMessage(response);
      } catch (error) {
        port.postMessage({ error: error.message });
      }
    }
  });
});
