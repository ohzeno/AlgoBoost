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
import { getStoredLanguage } from "./storageUtils";

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

function parseJavaItem(item: any): any {
  if (typeof item === "string") {
    try {
      return JSON.parse(item);
    } catch (error) {
      return item;
    }
  }
  return item;
}

function formatJavaData(data: any): string {
  if (!Array.isArray(data)) return data;
  return data
    .map((item) => {
      const parsed = parseJavaItem(item);
      if (Array.isArray(parsed)) {
        const elems = parsed.map((el) => JSON.stringify(el)).join(", ");
        return `new Object[]{${elems}}`;
      }
      return item;
    })
    .join(", ");
}

function formatExampleData(targetLanguage, exampleData: any[]): string {
  const template =
    PROGRAMMERS.TEMPLATES.EXAMPLES[targetLanguage] ||
    PROGRAMMERS.TEMPLATES.EXAMPLES.PYTHON;

  const formattedItems = exampleData
    .map(({ data, answer }) => {
      let dataStr;
      if (targetLanguage === "JAVA") {
        dataStr = formatJavaData(data);
        // formatJavaData는 배열을 처리하므로 배열로 감싸줘야 answer 자체가 배열일 때 처리 가능
        answer = formatJavaData([answer]);
      } else {
        dataStr = Array.isArray(data) ? data.join(", ") : data;
      }
      return template.item
        .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.DATA, dataStr)
        .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.ANSWER, answer);
    })
    .join(",\n");

  return `${template.start}\n${formattedItems}\n${template.end}`;
}

function getExamples(targetLanguage: string): string {
  const examplesSection = Array.from(
    document.querySelectorAll("h3, h4, h5")
  ).find((el) => el.textContent?.includes("입출력 예"));
  if (!examplesSection) {
    // showNotification("Failed to get the examples");
    return "";
  }
  const tableElem = examplesSection.nextElementSibling as HTMLTableElement;
  const exampleData = parseExampleElements(tableElem);
  return formatExampleData(targetLanguage, exampleData);
}

function getTemplateData1(targetLanguage: string): ProgrammersTemplateData1 {
  const baseCode = extractEditorCode();
  const constraints = getConstraints();
  const examples = getExamples(targetLanguage);
  return { baseCode, constraints, examples };
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

async function getTemplateData2(): Promise<ProgrammersTemplateData2> {
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

  return { problemTag, level, finCnt, accRate };
}

export async function getProgrammersFormat(): Promise<string> {
  const curUrl = window.location.href;
  if (!curUrl.match(PROGRAMMERS.REGEX.problem)) {
    // showNotification("This is not a Programmers problem page");
    return null;
  }
  const targetLanguage = await getStoredLanguage();
  const { baseCode, constraints, examples } = getTemplateData1(targetLanguage);
  const { problemTag, level, finCnt, accRate } = await getTemplateData2();
  const template =
    PROGRAMMERS.TEMPLATES[targetLanguage] || PROGRAMMERS.TEMPLATES.PYTHON;
  return template
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.URL, curUrl)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE, baseCode)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS, constraints)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS, examples)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.PROBLEM_TAG, problemTag)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY, level)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.FINISHED_CNT, finCnt)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE, accRate);
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
  const match = problemUrl.match(PROGRAMMERS.REGEX.problem);
  if (match) {
    problemUrl = `${PROGRAMMERS.URLS.problem}/${match[1]}`;
  }
  searchReset();
  const table = await waitForElement(PROGRAMMERS.SELECTORS.table, 600);
  if (!table) {
    console.error("Failed to get the table");
    return null;
  }
  const tableRow = Array.from(table.querySelectorAll("tr")).find((row) => {
    const titleA = row.querySelector(
      PROGRAMMERS.SELECTORS.titleA
    ) as HTMLAnchorElement;
    return titleA.href === problemUrl;
  });
  if (!tableRow) {
    console.error("Failed to get the tableRow");
    return null;
  }
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
