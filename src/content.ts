import {
  getBaekjoonExample,
  getBaekjoonFormat,
  getBaekjoonTitle,
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
  [BAEKJOON.COMMANDS.GET_TITLE]: () => handleBaekjoonRequest(getBaekjoonTitle),
  [LEETCODE.COMMANDS.GET_FORMAT]: () =>
    handleLeetcodeRequest(getLeetcodeFormat),
  [LEETCODE.COMMANDS.GET_TITLE]: () => handleLeetcodeRequest(getLeetcodeTitle),
  [PROGRAMMERS.COMMANDS.GET_FORMAT]: () =>
    handleProgrammersRequest(getProgrammersFormat),
  [PROGRAMMERS.COMMANDS.GET_TITLE]: () =>
    handleProgrammersRequest(getProgrammersTitle),
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.recipient !== GLOBAL_CONSTANTS.RECIPIENTS.CONTENT) return;
  let command;
  if (message.action === GLOBAL_CONSTANTS.COMMANDS.COPY) {
    command = message.data.getTextFunctionName;
  }
  const handler = commandHandlers[command];
  if (!handler) return;
  (async () => {
    const response = await handler();
    sendResponse(response);
  })();
  return true;
});

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === GLOBAL_CONSTANTS.PORT_NAMES.GET_PROBLEM_INFO_TO_CONTENT) {
    port.onMessage.addListener(async function (message) {
      if (message.action === PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_FROM_TAB) {
        const response = await handleProgrammersRequest(
          async () => await getProgrammersProblemInfo(message.data.problemUrl)
        );
        port.postMessage(response);
      }
    });
  } else if (port.name === GLOBAL_CONSTANTS.PORT_NAMES.GET_FORMAT_TO_CONTENT) {
    port.onMessage.addListener(async function (message) {
      if (message.action === GLOBAL_CONSTANTS.COMMANDS.COPY) {
        const command = message.data.getTextFunctionName;
        const handler = commandHandlers[command];
        if (!handler) return;
        const response = await handler();
        port.postMessage(response);
      }
    });
  }
});
