import { createSection, createFeatureBtn } from "./uiUtils";
import { getPageUrl } from "./tabUtils";
import { PROGRAMMERS, GLOBAL_CONSTANTS } from "../constants";
import {
  copyTextToClipboard,
  copyTextToClipboardWithPort,
} from "./clipboardUtils";
import { sendMessageWithPort } from "./messageUtils";
import { waitForElement } from "./domUtils";
import { sanitizeText } from "./textUtils";

async function validatePage(): Promise<boolean> {
  const pageUrl: string = await getPageUrl();
  const problemMatch = pageUrl.match(PROGRAMMERS.REGEX.problem);
  const isValidPage = !!problemMatch;
  if (isValidPage) return true;
  // showNotification("This is not a Programmers page");
  return false;
}

export async function createProgrammersSection(): Promise<void> {
  const isValidPage = await validatePage();
  if (!isValidPage) return;

  const section = await createSection("프로그래머스");

  createFeatureBtn(
    section,
    "양식 복사",
    async () =>
      await copyTextToClipboardWithPort(PROGRAMMERS.COMMANDS.GET_FORMAT)
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
  return sanitizeText(title);
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
  if (depth == 0) return GLOBAL_CONSTANTS.BULLET_TYPES.disc;
  const computedStyle = window.getComputedStyle(li);
  const listStyleType = computedStyle.getPropertyValue("list-style-type");

  if (listStyleType === "decimal") return `${index + 1}.`;
  return GLOBAL_CONSTANTS.BULLET_TYPES[listStyleType];
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

    let text = Array.from(li.childNodes)
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          if (el.tagName === "P") {
            return el.textContent;
          } else if (el.tagName === "CODE") {
            return el.textContent;
          } else if (el.tagName === "SUP") {
            return `^${el.textContent}`;
          }
        }
        return "";
      })
      .join("")
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
  return PROGRAMMERS.TEMPLATES.UPPER.replace(
    GLOBAL_CONSTANTS.TEMPLATE_VAR.URL,
    url
  )
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE, baseCode)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS, constraints)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS, examples);
}

function customUrlEncode(str: string): string {
  return str
    .split("")
    .map((char) => {
      if (char.match(/[a-zA-Z0-9]/)) {
        // 영문자와 숫자는 그대로 유지
        return char;
      } else if (char === " ") {
        // 공백은 '+'로 변환
        return "+";
      } else {
        // 나머지 문자 (한글 포함)
        return encodeURIComponent(char)
          .split("%")
          .filter(Boolean)
          .map((hex) => `%${hex.toUpperCase()}`)
          .join("");
      }
    })
    .join("");
}

async function getLowerPart(): Promise<string> {
  const problemTag = document.querySelector<HTMLDivElement>(
    PROGRAMMERS.SELECTORS.problemTag
  ).textContent;
  const title = getProgrammersTitle();
  const searchUrl = PROGRAMMERS.URLS.SEARCH.replace(
    GLOBAL_CONSTANTS.TEMPLATE_VAR.PARAMETER,
    customUrlEncode(title)
  );
  const { level, finCnt, accRate } = await sendMessageWithPort({
    action: PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO_REQUEST,
    data: { searchUrl, problemUrl: window.location.href },
    recipient: GLOBAL_CONSTANTS.RECIPIENTS.BACKGROUND,
  });

  return PROGRAMMERS.TEMPLATES.LOWER.replace(
    GLOBAL_CONSTANTS.TEMPLATE_VAR.PROBLEM_TAG,
    problemTag
  )
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY, level)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.FINISHED_CNT, finCnt)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE, accRate);
}

export async function getProgrammersFormat(): Promise<string> {
  const curUrl = window.location.href;
  if (!curUrl.match(PROGRAMMERS.REGEX.problem)) {
    // showNotification("This is not a Programmers problem page");
    return null;
  }
  const upperPart = getUpperPart(curUrl);
  const lowerPart = await getLowerPart();
  return `${upperPart}\n\n\n${lowerPart}\n`;
}

async function searchReset(): Promise<void> {
  const resetBtn = (await waitForElement(
    PROGRAMMERS.SELECTORS.resetBtn,
    300
  )) as HTMLButtonElement;
  if (resetBtn) {
    resetBtn.click();
  }
}

export async function getProgrammersProblemInfo(problemUrl): Promise<{
  level: string;
  finCnt: string;
  accRate: string;
} | null> {
  searchReset();
  const table = await waitForElement(PROGRAMMERS.SELECTORS.table, 600);
  if (!table) {
    return null;
  }
  const tableRow = Array.from(table.querySelectorAll("tr")).find((row) => {
    const titleA = row.querySelector(
      PROGRAMMERS.SELECTORS.titleA
    ) as HTMLAnchorElement;
    return titleA.href === problemUrl;
  });
  if (!tableRow) return null;
  const getContent = (selector: string) =>
    tableRow.querySelector(selector)?.textContent || "";
  return {
    level: getContent(PROGRAMMERS.SELECTORS.level).replace(" ", ""),
    finCnt: getContent(PROGRAMMERS.SELECTORS.finishedCnt),
    accRate: getContent(PROGRAMMERS.SELECTORS.acceptanceRate),
  };
}

export function handleProgrammersRequest(requestFunction) {
  try {
    return requestFunction();
  } catch (error) {
    return null;
  }
}
