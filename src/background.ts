import { handleBaekjoonTab } from "./utils/baekjoonUtils";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "solvedUsers") {
    await handleBaekjoonTab("Solved Users");
  } else if (request.action === "shortCoding") {
    await handleBaekjoonTab("Short Coding");
  }
});
