import { getBaekjoonExample, getBaekjoonFormat } from "./utils/baekjoonUtils";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getBaekjoonExample") {
    getBaekjoonExample()
      .then(sendResponse)
      .catch((error) => sendResponse(null));
  } else if (message === "getBaekjoonFormat") {
    getBaekjoonFormat()
      .then(sendResponse)
      .catch((error) => sendResponse(null));
  }
  return true;
});
