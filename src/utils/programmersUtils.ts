import { createSection, createFeatureBtn } from "./uiUtils";
import { getPageUrl } from "./tabUtils";
import { PROGRAMMERS, BULLET_TYPES } from "../constants";
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

function extractEditorCode(): string {
  const hiddenTextarea = document.querySelector(
    PROGRAMMERS.SELECTORS.editor
  ) as HTMLTextAreaElement;
  if (!hiddenTextarea) {
    console.error("Hidden textarea not found");
    return "";
  }
  const editorCode = hiddenTextarea.value.trim();
  return editorCode;
}

function getBullet(depth: number, li: Element, index: number): string {
  if (depth == 0) return BULLET_TYPES.disc;
  const computedStyle = window.getComputedStyle(li);
  const listStyleType = computedStyle.getPropertyValue("list-style-type");

  if (listStyleType === "decimal") return `${index + 1}.`;
  return BULLET_TYPES[listStyleType];
}

function htmlToText(element: Element): string {
  return Array.from(element.childNodes)
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        if (el.tagName === "CODE") {
          return el.textContent;
        } else if (el.tagName === "SUP") {
          return `^${el.textContent}`;
        } else {
        } // 중첩목록이면 여기서 처리하지 않음
      }
      return "";
    })
    .join("");
}

function processListItems(ul: Element, depth: number = 0): string[] {
  return Array.from(ul.children).flatMap((li, index) => {
    const bullet = getBullet(depth, li, index);
    const indent = "  ".repeat(depth + 1);

    let text = htmlToText(li)
      .replace(/\s+/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&le;/g, "≤")
      .replace(/&ge;/g, "≥")
      .trim();

    let result = [`${indent}${bullet} ${text}`];

    const nestedUl = li.querySelector(":scope > ul, :scope > ol");
    if (nestedUl) {
      result.push(...processListItems(nestedUl, depth + 1));
    }
    return result;
  });
}

function getConstraints(): string {
  const constraintsSection = Array.from(document.querySelectorAll("h5")).find(
    (el) => el.textContent.includes("제한사항")
  );
  if (!constraintsSection) {
    // showNotification("Failed to get the constraints");
    return "";
  }
  const ulElem = constraintsSection.nextElementSibling as Element;
  const constraints = processListItems(ulElem);
  return constraints.join("\n");
}

function parseExampleElements(tableElem: HTMLTableElement): any[] {
  const rows = Array.from(tableElem.querySelectorAll("tbody tr"));
  const exampleData: any[] = [];
  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll("td"));
    const data = cells.slice(0, -1).map((cell) => {
      let content = cell.textContent.trim();
      content = content.replace(/<\/?code>/g, "");
      return content;
    });
    const answer = cells[cells.length - 1].textContent.trim();
    exampleData.push({ data, answer });
  }
  return exampleData;
}

function formatExampleData(exampleData: any[]): string {
  const formattedData = exampleData
    .map(
      ({ data, answer }) =>
        `    {"data": [${data.join(", ")}], "answer": ${answer}}`
    )
    .join(",\n");
  return `inputdatas = [\n${formattedData}\n]`;
}

function getExamples(): string {
  const examplesSection = Array.from(document.querySelectorAll("h5")).find(
    (el) => el.textContent === "입출력 예"
  );
  if (!examplesSection) {
    // showNotification("Failed to get the examples");
    return "";
  }
  const tableElem = examplesSection.nextElementSibling as HTMLTableElement;
  const exampleData = parseExampleElements(tableElem);
  return formatExampleData(exampleData);
}

function getUpperPart(url: string): string {
  const baseCode = extractEditorCode();
  const constraints = getConstraints();
  const examples = getExamples();
  return PROGRAMMERS.TEMPLATES.UPPER.replace("{URL}", url)
    .replace("{BASE_CODE}", baseCode)
    .replace("{CONSTRAINTS}", constraints)
    .replace("{INPUTDATAS}", examples);
}

function getLowerPart(): string {
  const problemTag = document.querySelector<HTMLDivElement>(
    PROGRAMMERS.SELECTORS.problemTag
  ).textContent;
  return PROGRAMMERS.TEMPLATES.LOWER.replace("{PROBLEM_TAG}", problemTag);
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
