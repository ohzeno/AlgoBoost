import {
  getBaekjoonExample,
  getBaekjoonFormat,
  handleBaekjoonRequest,
} from "./utils/baekjoonUtils";
import {
  getLeetcodeFormat,
  getLeetcodeTitle,
  handleLeetcodeRequest,
} from "./utils/leetcodeUtils";
import {
  getProgrammersTitle,
  handleProgrammersRequest,
} from "./utils/programmersUtils";
import { BAEKJOON, LEETCODE, PROGRAMMERS } from "./constants";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === BAEKJOON.COMMANDS.GET_EXAMPLE) {
    const baekjoonExample = handleBaekjoonRequest(getBaekjoonExample);
    sendResponse(baekjoonExample);
  } else if (message === BAEKJOON.COMMANDS.GET_FORMAT) {
    const baekjoonFormat = handleBaekjoonRequest(getBaekjoonFormat);
    sendResponse(baekjoonFormat);
  } else if (message == LEETCODE.COMMANDS.GET_FORMAT) {
    const leetcodeFormat = handleLeetcodeRequest(getLeetcodeFormat);
    sendResponse(leetcodeFormat);
  } else if (message == LEETCODE.COMMANDS.GET_TITLE) {
    const leetcodeTitle = handleLeetcodeRequest(getLeetcodeTitle);
    sendResponse(leetcodeTitle);
  } else if (message == PROGRAMMERS.COMMANDS.GET_FORMAT) {
  } else if (message == PROGRAMMERS.COMMANDS.GET_TITLE) {
    const programmersTitle = handleProgrammersRequest(getProgrammersTitle);
    sendResponse(programmersTitle);
  }
  return true;
});
