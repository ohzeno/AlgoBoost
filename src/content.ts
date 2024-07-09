import {
  getBaekjoonExample,
  getBaekjoonFormat,
  handleBaekjoonRequest,
} from "./utils/baekjoonUtils";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getBaekjoonExample") {
    const baekjoonExample = handleBaekjoonRequest(getBaekjoonExample);
    sendResponse(baekjoonExample);
  } else if (message === "getBaekjoonFormat") {
    const baekjoonFormat = handleBaekjoonRequest(getBaekjoonFormat);
    sendResponse(baekjoonFormat);
  }
  return true;
});
