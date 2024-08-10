import { createSection, createFeatureBtn } from "./uiUtils";
import { getPageUrl } from "./tabUtils";
import { PROGRAMMERS } from "../constants";
import { copyTextToClipboard } from "./clipboardUtils";

function getMatches(url: string): ProgrammersRegExpMatches {
  return {
    problemListMatch: url.match(PROGRAMMERS.REGEX.problem_list),
    specialProblemListMatch: url.match(PROGRAMMERS.REGEX.specilal_problem_list),
    problemMatch: url.match(PROGRAMMERS.REGEX.problem),
  };
}

async function validatePage(): Promise<boolean> {
  const pageUrl: string = await getPageUrl();
  const { problemListMatch, specialProblemListMatch, problemMatch } =
    getMatches(pageUrl);
  const isValidPage = !!(
    problemListMatch ||
    specialProblemListMatch ||
    problemMatch
  );
  if (isValidPage) return true;
  // showNotification("This is not a Programmers page");
  return false;
}

export async function createProgrammersSection(): Promise<void> {
  const isValidPage = await validatePage();
  if (!isValidPage) return;

  const section = createSection("프로그래머스");

  createFeatureBtn(
    section,
    "양식 복사",
    async () => await copyTextToClipboard(PROGRAMMERS.COMMANDS.GET_FORMAT)
  );
  createFeatureBtn(
    section,
    "제목 복사",
    async () => await copyTextToClipboard(PROGRAMMERS.COMMANDS.GET_TITLE)
  );
}

export function getProgrammersTitle(): string {
  const titleElement = document.querySelector<HTMLDivElement>(
    PROGRAMMERS.SELECTORS.title
  );
  if (!titleElement) {
    // showNotification("Failed to get the title");
    return null;
  }
  const title = titleElement.dataset.lessonTitle;
  return title;
}

function getUpperPart(url: string): string {
  return PROGRAMMERS.TEMPLATES.UPPER.replace("{URL}", url);
}

function getLowerPart(): string {
  return PROGRAMMERS.TEMPLATES.LOWER;
}

export function getProgrammersFormat(): string {
  const curUrl = window.location.href;
  if (!curUrl.match(PROGRAMMERS.REGEX.problem)) {
    // showNotification("This is not a Programmers problem page");
    return null;
  }
  const upperPart = getUpperPart(curUrl);
  const lowerPart = getLowerPart();
  return `${upperPart}\n\n\n${lowerPart}\n`;
}

export function handleProgrammersRequest(requestFunction) {
  try {
    return requestFunction();
  } catch (error) {
    return null;
  }
}
