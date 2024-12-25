import { createSection, createFeatureBtn } from "./uiUtils";
import { getPageUrl } from "./tabUtils";
import { GLOBAL_CONSTANTS, LEETCODE } from "../constants";
import {
  copyTextToClipboard,
  copyTextToClipboardWithPort,
} from "./clipboardUtils";
import { getStoredLanguage } from "./storageUtils";

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

  const section = await createSection("LeetCode");

  createFeatureBtn(
    section,
    "Copy Format",
    async () => await copyTextToClipboardWithPort(LEETCODE.COMMANDS.GET_FORMAT)
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
      constraints = Array.from(nextElement.querySelectorAll("li")).map((li) => {
        if (li instanceof HTMLElement) {
          let html = li.innerHTML;
          // <sup> 태그로 표현된 지수를 ^ 기호로 변경
          html = html.replace(
            /([0-9a-zA-Z]+)<sup>([0-9a-zA-Z]+)<\/sup>/g,
            "$1^$2"
          );
          // HTML 엔티티를 적절한 기호로 변경
          html = html.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
          html = html.replace(/<\/?code>/g, ""); // code 태그 제거
          let result = html.replace(/<[^>]*>/g, ""); // 남은 HTML 태그 제거
          return result;
        }
        return "";
      });
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

function getUpperPart(
  targetLanguage: string,
  problemDescriptionDiv: HTMLDivElement,
  baseCode: string
): string {
  const curUrl = window.location.href.replace(/\/description\/$/, "/");
  const constraints = getConstraints(problemDescriptionDiv);
  const upperTemplate =
    LEETCODE.TEMPLATES[targetLanguage]?.UPPER ||
    LEETCODE.TEMPLATES.PYTHON.UPPER;
  return upperTemplate
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.URL, curUrl)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS, constraints)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE, baseCode);
}

function getExamples(
  targetLanguage: string,
  problemDescriptionDiv: HTMLDivElement
): string {
  const exampleDivs = problemDescriptionDiv.querySelectorAll("pre");
  const exampleData = parseExampleElements(exampleDivs);
  return formatExampleData(targetLanguage, exampleData);
}

function parseExampleElements(exampleDivs: NodeListOf<Element>): any[] {
  const exampleData: any[] = [];
  for (const exampleDiv of exampleDivs) {
    const strongElements = exampleDiv.querySelectorAll("strong");
    let inputElement: Element | null = null;
    let outputElement: Element | null = null;
    for (const element of strongElements) {
      if (element.textContent?.includes("Input:")) {
        inputElement = element;
      } else if (element.textContent?.includes("Output:")) {
        outputElement = element;
      }
    }
    if (!(inputElement && outputElement)) continue;
    const inputElemText = inputElement.nextSibling?.textContent?.trim() ?? "";
    exampleData.push({
      data: parseInput(inputElemText),
      answer: outputElement.nextSibling?.textContent?.trim() ?? "",
    });
  }
  return exampleData;
}

function parseInput(inputText: string): any[] {
  /* 
  split 사용하니 혹시나 파라미터 값에 ', '가 나오거나 ' = '가 나오면
  문제 생길 수 있음.
  개인 용도 플젝이고, 그런 문제는 드무니 일단은 그냥 쓰고 버그 생겼을 때 수정하자.
  */
  const inputArray = [];
  const parameters = inputText.split(", ");
  for (const parameter of parameters) {
    const value = parameter.split(" = ")[1];
    inputArray.push(value);
  }
  return inputArray;
}

function formatExampleData(targetLanguage, exampleData: any[]): string {
  const template =
    LEETCODE.TEMPLATES.EXAMPLES[targetLanguage] ||
    LEETCODE.TEMPLATES.EXAMPLES.PYTHON;

  const formattedData = exampleData
    .map(
      ({ data, answer }) =>
        `    {"data": [${data.join(", ")}], "answer": ${answer}}`
    )
    .join(",\n");
  return `${template.start}\n${formattedData}\n${template.end}`;
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
        submissions = el.nextElementSibling?.textContent?.trim() ?? "";
      } else if (el.textContent?.includes("Acceptance Rate")) {
        acceptanceRate = el.nextElementSibling?.textContent?.trim() || "";
      }
    });
  }
  return { submissions, acceptanceRate };
}

function getFirstFunctionName(code: string): string {
  const match = code.match(/(?:function|var|const|let)\s+(\w+)\s*=/);
  return match ? match[1] : "";
}

function getLowerPart(
  targetLanguage: string,
  problemDescriptionDiv: HTMLDivElement,
  baseCode: string
): string {
  const examples = getExamples(targetLanguage, problemDescriptionDiv);
  const difficulty = getDifficultyStr(problemDescriptionDiv);
  const { submissions, acceptanceRate } = getStats(problemDescriptionDiv);
  const functionName = getFirstFunctionName(baseCode);
  const lowerTemplate =
    LEETCODE.TEMPLATES[targetLanguage]?.LOWER ||
    LEETCODE.TEMPLATES.PYTHON.LOWER;
  return lowerTemplate
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY, difficulty)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS, examples)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS, submissions)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE, acceptanceRate)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.FUNCTION_NAME, functionName);
}

export async function getLeetcodeFormat(): Promise<string> {
  const problemDescriptionDiv = Array.from(
    document.querySelectorAll("div")
  ).find(
    (div) =>
      div.textContent.includes("Example") &&
      div.textContent.includes("Input") &&
      div.textContent.includes("Output") &&
      div.textContent.includes("Constraints")
  );
  const targetLanguage = await getStoredLanguage();
  const baseCode = extractEditorCode();
  const upperPart = getUpperPart(
    targetLanguage,
    problemDescriptionDiv,
    baseCode
  );
  const lowerPart = getLowerPart(
    targetLanguage,
    problemDescriptionDiv,
    baseCode
  );
  return `${upperPart}\n\n\n${lowerPart}\n`;
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
