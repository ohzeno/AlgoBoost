import { PROGRAMMERS, GLOBAL_CONSTANTS } from "./constants";
import { getProgrammersSearchUrlTab } from "./utils/tabUtils";
import { sendMessageToTabPromise } from "./utils/messageUtils";

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name !== "problem-info") {
    console.error("Unexpected port name:", port.name);
    return;
  }

  port.onMessage.addListener(async function (message) {
    if (message.recipient !== GLOBAL_CONSTANTS.RECIPIENTS.BACKGROUND) return;
    if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_REQUEST) {
      const { searchUrl } = message.data;
      console.log(`sender`, port.sender.url);

      try {
        let searchUrlTab = await getProgrammersSearchUrlTab(searchUrl);
        if (!searchUrlTab) {
          searchUrlTab = await new Promise((resolve) => {
            chrome.tabs.create(
              { url: searchUrl, index: port.sender.tab.index, active: false },
              (tab) => {
                console.log(`after create tab ${new Date().toISOString()}`);
                resolve(tab);
              }
            );
          });
        }
        console.log(
          `bg before sendMessageToTabPromise ${new Date().toISOString()}`
        );
        const response = await sendMessageToTabPromise(searchUrlTab.id, {
          action: PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB,
          recipient: GLOBAL_CONSTANTS.RECIPIENTS.CONTENT,
        });
        console.log(`bg before response ${new Date().toISOString()}`);

        port.postMessage(response);
      } catch (error) {
        console.error("Error in background script:", error);
        port.postMessage({ error: error.message });
      }
    }
  });
});
