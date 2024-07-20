import {
  getBaekjoonExample,
  getBaekjoonFormat,
  handleBaekjoonRequest,
} from "./utils/baekjoonUtils";
import { BAEKJOON } from "./constants";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === BAEKJOON.COMMANDS.GET_EXAMPLE) {
    const baekjoonExample = handleBaekjoonRequest(getBaekjoonExample);
    sendResponse(baekjoonExample);
  } else if (message === BAEKJOON.COMMANDS.GET_FORMAT) {
    const baekjoonFormat = handleBaekjoonRequest(getBaekjoonFormat);
    sendResponse(baekjoonFormat);
  }
  return true;
});
