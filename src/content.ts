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
  getProgrammersFormat,
  searchReset,
  handleProgrammersRequest,
} from "./utils/programmersUtils";
import { BAEKJOON, LEETCODE, PROGRAMMERS, GLOBAL_CONSTANTS } from "./constants";

const commandHandlers = {
  [BAEKJOON.COMMANDS.GET_EXAMPLE]: () =>
    handleBaekjoonRequest(getBaekjoonExample),
  [BAEKJOON.COMMANDS.GET_FORMAT]: () =>
    handleBaekjoonRequest(getBaekjoonFormat),
  [LEETCODE.COMMANDS.GET_FORMAT]: () =>
    handleLeetcodeRequest(getLeetcodeFormat),
  [LEETCODE.COMMANDS.GET_TITLE]: () => handleLeetcodeRequest(getLeetcodeTitle),
  [PROGRAMMERS.COMMANDS.GET_FORMAT]: () =>
    handleProgrammersRequest(getProgrammersFormat),
  [PROGRAMMERS.COMMANDS.GET_TITLE]: () =>
    handleProgrammersRequest(getProgrammersTitle),
  [PROGRAMMERS.COMMANDS.SEARCH_RESET]: () =>
    handleProgrammersRequest(searchReset),
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === GLOBAL_CONSTANTS.COMMANDS.COPY) {
    const command = message.data.getTextFunctionName;
    const handler = commandHandlers[command];
    if (!handler) return;
    const response = handler();
    sendResponse(response);
  } else if (message.action === PROGRAMMERS.COMMANDS.SEARCH_RESET) {
    const handler = commandHandlers[message.action];
    handler();
  }
  return true;
});
