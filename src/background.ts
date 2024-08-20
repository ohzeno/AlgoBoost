import { PROGRAMMERS, GLOBAL_CONSTANTS } from "./constants";
import { getProgrammersSearchUrlTab } from "./utils/tabUtils";
import { sendMessageWithPort } from "./utils/messageUtils";

chrome.runtime.onConnect.addListener(function (port) {
  if (
    port.name !== GLOBAL_CONSTANTS.PORT_NAMES.GET_PROBLEM_INFO_TO_BACKGROUND
  ) {
    console.error("Unexpected port name:", port.name);
    return;
  }

  port.onMessage.addListener(async function (message) {
    if (message.recipient !== GLOBAL_CONSTANTS.RECIPIENTS.BACKGROUND) return;
    if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_REQUEST) {
      const { searchUrl, title } = message.data;
      console.log(`sender`, port.sender.url);

      try {
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
                    console.log(`bg tab created ${new Date().toISOString()}`);
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve(tab);
                  }
                });
              }
            );
          });
        }
        console.log(
          `bg before sendMessageToTabPromise ${new Date().toISOString()}`
        );
        const response = await sendMessageWithPort({
          action: PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB,
          data: { title },
          recipient: GLOBAL_CONSTANTS.RECIPIENTS.CONTENT,
          tabId: searchUrlTab.id,
        });
        console.log(`bg before response ${new Date().toISOString()}`);
        console.log("response", response);
        port.postMessage(response);
      } catch (error) {
        console.error("Error in background script:", error);
        port.postMessage({ error: error.message });
      }
    }
  });
});
