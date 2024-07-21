import {
  getBaekjoonExample,
  getBaekjoonFormat,
  handleBaekjoonRequest,
} from "./utils/baekjoonUtils";
import {
  getLeetcodeExample,
  getLeetcodeFormat,
  getLeetcodeTitle,
  handleLeetcodeRequest,
} from "./utils/leetcodeUtils";
import { BAEKJOON, LEETCODE } from "./constants";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === BAEKJOON.COMMANDS.GET_EXAMPLE) {
    const baekjoonExample = handleBaekjoonRequest(getBaekjoonExample);
    sendResponse(baekjoonExample);
  } else if (message === BAEKJOON.COMMANDS.GET_FORMAT) {
    const baekjoonFormat = handleBaekjoonRequest(getBaekjoonFormat);
    sendResponse(baekjoonFormat);
  } else if (message == LEETCODE.COMMANDS.GET_EXAMPLE) {
  } else if (message == LEETCODE.COMMANDS.GET_FORMAT) {
    const leetcodeFormat = handleLeetcodeRequest(getLeetcodeFormat);
    sendResponse(leetcodeFormat);
  } else if (message == LEETCODE.COMMANDS.GET_TITLE) {
    const leetcodeTitle = handleLeetcodeRequest(getLeetcodeTitle);
    sendResponse(leetcodeTitle);
  }
  return true;
});
