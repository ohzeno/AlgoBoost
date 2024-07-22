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

function getConstraints(problemDescriptionDiv: HTMLDivElement): string {
  const constraintsHeader = Array.from(
    problemDescriptionDiv.querySelectorAll("p strong")
  ).find((el) => el.textContent && el.textContent.includes("Constraints"));

  let constraints: string[] = [];

  if (constraintsHeader && constraintsHeader.parentElement) {
    const nextElement = constraintsHeader.parentElement.nextElementSibling;
    if (nextElement instanceof HTMLUListElement) {
      constraints = Array.from(nextElement.querySelectorAll("li")).map(
        (li) => (li instanceof HTMLElement ? li.textContent?.trim() : "") || ""
      );
    }
  }
  return "  " + constraints.join("\n  ");
}

function extractEditorCode() {
  const editorLines = document.querySelector(".view-lines");
  if (!editorLines) {
    // showNotification("Failed to get the editor code");
    return null;
  }
  const lines = editorLines.querySelectorAll(".view-line");

  // 각 줄의 텍스트 내용 추출, 공백 유지
  const codeLines = Array.from(lines).map((line) => {
    return line.innerHTML
      .replace(/<[^>]*>/g, "") // HTML 태그 제거
      .replace(/&nbsp;/g, " ") // &nbsp;를 일반 공백으로 변환
      .replace(/&gt;/g, ">") // &gt;를 >로 변환
      .replace(/&lt;/g, "<") // &lt;를 <로 변환
      .replace(/&amp;/g, "&"); // &amp;를 &로 변환
  });
  return codeLines.join("\n");
}

function getUpperPart(problemDescriptionDiv: HTMLDivElement): string {
  const curUrl = window.location.href.replace(/\/description\/$/, "/");
  const constraints = getConstraints(problemDescriptionDiv);
  const baseCode = extractEditorCode();
  return `curUrl: ${curUrl}\n
constraints:\n${constraints}\n
baseCode:\n${baseCode}`;
}

function getExamples(problemDescriptionDiv: HTMLDivElement): string {
  const exampleDivs = problemDescriptionDiv.querySelectorAll("pre");
  const examples: { input: string; output: string }[] = [];

  exampleDivs.forEach((div) => {
    const strongElements = div.querySelectorAll("strong");
    let inputElement: Element | null = null;
    let outputElement: Element | null = null;

    for (const element of strongElements) {
      if (element.textContent?.includes("Input:")) {
        inputElement = element;
      } else if (element.textContent?.includes("Output:")) {
        outputElement = element;
      }
    }

    if (inputElement && outputElement) {
      const input = inputElement.nextSibling?.textContent?.trim() || "";
      const output = outputElement.nextSibling?.textContent?.trim() || "";

      if (input && output) {
        examples.push({ input, output });
      }
    }
  });
  return JSON.stringify(examples, null, 2);
}

function getDifficultyStr(problemDescriptionDiv: HTMLDivElement): string {
  const difficultyElement = problemDescriptionDiv.querySelector<HTMLDivElement>(
    LEETCODE.SELECTORS.difficulty
  );
  if (!difficultyElement) {
    // showNotification("Failed to get the difficulty");
    return null;
  }
  return difficultyElement.innerText;
}

function getStats(problemDescriptionDiv: HTMLDivElement): {
  submissions: string;
  acceptanceRate: string;
} {
  const statsDiv = Array.from(
    problemDescriptionDiv.querySelectorAll("div")
  ).find(
    (div) =>
      div.textContent.includes("Submissions") &&
      div.textContent.includes("Acceptance Rate")
  );
  let submissions = "",
    acceptanceRate = "";
  if (statsDiv) {
    const statElements = statsDiv.querySelectorAll("div");
    statElements.forEach((el) => {
      if (el.textContent?.includes("Submissions")) {
        submissions = el.nextElementSibling?.textContent?.trim() || "";
      } else if (el.textContent?.includes("Acceptance Rate")) {
        acceptanceRate = el.nextElementSibling?.textContent?.trim() || "";
      }
    });
  }
  return { submissions, acceptanceRate };
}

function getLowerPart(problemDescriptionDiv: HTMLDivElement): string {
  const examples = getExamples(problemDescriptionDiv);
  const difficulty = getDifficultyStr(problemDescriptionDiv);
  const { submissions, acceptanceRate } = getStats(problemDescriptionDiv);
  return `difficulty: ${difficulty}\n
examples: ${examples}\n
submissions: ${submissions}\n
acceptanceRate: ${acceptanceRate}`;
}

export function getLeetcodeFormat(): string {
  const problemDescriptionDiv = Array.from(
    document.querySelectorAll("div")
  ).find(
    (div) =>
      div.textContent.includes("Example") &&
      div.textContent.includes("Input") &&
      div.textContent.includes("Output") &&
      div.textContent.includes("Constraints")
  );
  const upperPart = getUpperPart(problemDescriptionDiv);
  const lowerPart = getLowerPart(problemDescriptionDiv);
  return `${upperPart}\n\n${lowerPart}\n`;
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
