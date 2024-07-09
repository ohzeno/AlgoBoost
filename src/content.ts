import { getBaekjoonExample, getBaekjoonFormat } from "./utils/baekjoonUtils";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getBaekjoonExample") {
    try {
      const baekjoonExample = getBaekjoonExample();
      sendResponse(baekjoonExample);
    } catch (error) {
      sendResponse(null);
    }
  } else if (message === "getBaekjoonFormat") {
    try {
      const baekjoonFormat = getBaekjoonFormat();
      sendResponse(baekjoonFormat);
    } catch (error) {
      sendResponse(null);
    }
  }
  return true;
});
