import { createSection, createFeatureBtn } from "./uiUtils";
import { getPageUrl } from "./tabUtils";
import { PROGRAMMERS, GLOBAL_CONSTANTS } from "../constants";
import { copyTextToClipboard } from "./clipboardUtils";
import { sendMessagePromise } from "./messageUtils";

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
    "{PARAM}",
    customUrlEncode(title)
  );
  const info = await sendMessagePromise({
    action: PROGRAMMERS.COMMANDS.GET_PROBLEM_INFO,
    data: { searchUrl },
  });
  console.log("info", info);
  /*   
  백그라운드로 메시지 보내기
    기존 탭 중에 해당 주소 창이 있는지 확인
    없으면 현재 탭 왼쪽에 새 탭 열기(
    chrome.tabs.create({url: "https://www.example.com"}, function(tab) { 
      const createdTabId = tab.id;
      ... 
    }))
    새 탭 열리고 잠시 후 주소 바뀌었는지 확인(chrome.tabs.onUpdated.addListener)
  주소 바뀌었으면 옆 탭에서 초기화 버튼 누르기(sendMessage로 그 탭 콘텐트 스크립트)
  검색 창에서 문제 정보 가져오기(백그라운드에서 다시 받아서 최초 실행 콘텐트로)
  */
  return PROGRAMMERS.TEMPLATES.LOWER.replace("{PROBLEM_TAG}", problemTag);
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

export function searchReset(): void {
  const resetBtn = document.querySelector<HTMLButtonElement>(
    PROGRAMMERS.SELECTORS.resetBtn
  );
  resetBtn.click();
}

export function handleProgrammersRequest(requestFunction) {
  try {
    return requestFunction();
  } catch (error) {
    return null;
  }
}
