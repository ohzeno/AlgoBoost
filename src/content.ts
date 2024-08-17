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
  getProgrammersProblemInfo,
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
  [PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB]: () =>
    handleProgrammersRequest(getProgrammersProblemInfo),
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.recipient !== GLOBAL_CONSTANTS.RECIPIENTS.CONTENT) return;
  let command;
  if (message.action === GLOBAL_CONSTANTS.COMMANDS.COPY) {
    command = message.data.getTextFunctionName;
  } else if (
    message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB
  ) {
    command = message.action;
  }
  const handler = commandHandlers[command];
  if (!handler) return;
  const response = handler();
  sendResponse(response);
  return true;
});
