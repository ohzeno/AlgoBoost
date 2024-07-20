import { createSection, createFeatureBtn } from "./uiUtils";
import { getPageUrl } from "./tabUtils";
import { LEETCODE } from "../constants";
import { copyTextToClipboard } from "./clipboardUtils";

async function validatePage(): Promise<boolean> {
  const pageUrl: string = await getPageUrl();
  const problemMatch = pageUrl.match(LEETCODE.REGEX.problem);
  const isValidPage = !!problemMatch;
  if (isValidPage) return true;
  // showNotification("This is not a LeetCode problem page");
  return false;
}

export async function createLeetcodeSection(): Promise<void> {
  const isValidPage = await validatePage();
  if (!isValidPage) return;

  const section = createSection("LeetCode");

  createFeatureBtn(
    section,
    "Copy Example",
    // async () => await copyTextToClipboard(LEETCODE.COMMANDS.GET_EXAMPLE)
    () => console.log(LEETCODE.COMMANDS.GET_EXAMPLE)
  );
  createFeatureBtn(
    section,
    "Copy Format",
    // async () => await copyTextToClipboard(LEETCODE.COMMANDS.GET_FORMAT)
    () => console.log(LEETCODE.COMMANDS.GET_FORMAT)
  );
}
