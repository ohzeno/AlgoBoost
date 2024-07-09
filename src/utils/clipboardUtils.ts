import { sendMessageToTab } from "./messageUtils";

export async function copyTextToClipboard(
  getTextFunctionName: string
): Promise<void> {
  const text = await sendMessageToTab(getTextFunctionName);

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
