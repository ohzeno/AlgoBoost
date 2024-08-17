import { sendMessageToTab } from "./messageUtils";
import { GLOBAL_CONSTANTS } from "../constants";

export async function copyTextToClipboard(
  getTextFunctionName: string
): Promise<void> {
  const text = await sendMessageToTab({
    action: GLOBAL_CONSTANTS.COMMANDS.COPY,
    data: { getTextFunctionName },
    recipient: GLOBAL_CONSTANTS.RECIPIENTS.CONTENT,
  });

  if (!text) {
    // showNotification(`Failed to get ${ordType}`);
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      // showNotification(`${ordType} copied to clipboard!`);
    })
    .catch((err: Error) => {
      // showNotification(`Error: ${err.message}`);
    });
}
