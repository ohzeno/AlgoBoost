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
    async () => await copyTextToClipboard(LEETCODE.COMMANDS.GET_FORMAT)
  );
  createFeatureBtn(
    section,
    "Copy Title",
    async () => await copyTextToClipboard(LEETCODE.COMMANDS.GET_TITLE)
  );
}

export function getLeetcodeTitle(): string {
  const titleElement = document.querySelector<HTMLAnchorElement>(
    LEETCODE.SELECTORS.title
  );
  if (!titleElement) {
    // showNotification("Failed to get the title");
    return null;
  }
  const titleFullText = titleElement.innerText;
  const title = titleFullText.split(". ")[1];
  return title;
}

export async function getLeetcodeExample(): Promise<string> {
  return "LeetCode Example";
}

function getDifficultyStr(): string {
  const difficultyElement = document.querySelector<HTMLDivElement>(
    LEETCODE.SELECTORS.difficulty
  );
  if (!difficultyElement) {
    // showNotification("Failed to get the difficulty");
    return null;
  }
  return difficultyElement.innerText;
}

export function getLeetcodeFormat(): string {
  const difficulty = getDifficultyStr();
  return `LeetCode Format: ${difficulty}`;
}

export function handleLeetcodeRequest(requestFunction) {
  const descriptionElement = document.querySelector<HTMLDivElement>(
    LEETCODE.SELECTORS.description
  );
  if (!descriptionElement) {
    // showNotification("Failed to get the description");
    return null;
  }
  try {
    return requestFunction();
  } catch (error) {
    return null;
  }
}
