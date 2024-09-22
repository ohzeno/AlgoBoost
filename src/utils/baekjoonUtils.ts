import { createSection, createFeatureBtn } from "./uiUtils";
import { getActiveTab, createNewTabToRight, getPageUrl } from "./tabUtils";
import { GLOBAL_CONSTANTS, BAEKJOON } from "../constants";
import { divMod } from "./mathUtils";
import {
  copyTextToClipboard,
  copyTextToClipboardWithPort,
} from "./clipboardUtils";
import { getStoredLanguage } from "./storageUtils";

function getMatches(url: string): BaekjoonRegExpMatches {
  return {
    problemMatch: url.match(BAEKJOON.REGEX.problem),
    solverMatch: url.match(BAEKJOON.REGEX.solver),
    submitMatch: url.match(BAEKJOON.REGEX.submit),
  };
}

async function validatePage(): Promise<boolean> {
  const pageUrl: string = await getPageUrl();
  const { problemMatch, solverMatch, submitMatch } = getMatches(pageUrl);
  const isValidPage = !!(problemMatch || solverMatch || submitMatch);
  if (isValidPage) return true;
  // showNotification("This is not a Baekjoon page");
  return false;
}

export async function createBaekjoonSection(): Promise<void> {
  const isValidPage = await validatePage();
  if (!isValidPage) return;

  const section = await createSection("백준");

  createFeatureBtn(
    section,
    "맞힌 사람",
    async () => await handleBaekjoonTab(BAEKJOON.TAB_TYPES.SOLVED_USERS)
  );

  createFeatureBtn(
    section,
    "숏코딩",
    async () => await handleBaekjoonTab(BAEKJOON.TAB_TYPES.SHORT_CODING)
  );

  createFeatureBtn(
    section,
    "예제 복사",
    async () => await copyTextToClipboard(BAEKJOON.COMMANDS.GET_EXAMPLE)
  );
  createFeatureBtn(
    section,
    "양식 복사",
    async () => await copyTextToClipboardWithPort(BAEKJOON.COMMANDS.GET_FORMAT)
  );
}

function getPageInfo(url: string): {
  problemNumber: string;
  urlType: string | undefined;
  languageNumber: string | undefined;
} {
  const { problemMatch, solverMatch, submitMatch } = getMatches(url);
  let problemNumber, urlType, languageNumber;

  if (problemMatch) {
    problemNumber = problemMatch[1];
  } else if (solverMatch) {
    urlType = solverMatch[1];
    problemNumber = solverMatch[2];
    languageNumber = solverMatch[3];
  } else if (submitMatch) {
    problemNumber = submitMatch[1];
  }

  return { problemNumber, urlType, languageNumber };
}

function getOrder(
  type: baekjoonTabType,
  urlType: string | null,
  languageNumber: string | null,
  trgLanguageNumber: string
): "SAME_PAGE" | "UPDATE_TAB" | "NEW_TAB" {
  const isSameType =
    urlType &&
    ((type === BAEKJOON.TAB_TYPES.SOLVED_USERS && urlType === "problem") ||
      (type === BAEKJOON.TAB_TYPES.SHORT_CODING && urlType === "short"));

  if (isSameType)
    // 같은 페이지면 언어만 일치시켜주면 됨.
    return languageNumber === trgLanguageNumber ? "SAME_PAGE" : "UPDATE_TAB";

  return "NEW_TAB";
}

async function handleBaekjoonTab(type: baekjoonTabType) {
  const { id, url, index } = await getActiveTab();
  const pageInfo = getPageInfo(url);
  const { problemNumber, urlType, languageNumber } = pageInfo;
  const targetLanguage = await getStoredLanguage();
  const trgLanguageNumber = BAEKJOON.LANG_CODES[targetLanguage] || "1003";
  const newUrl = await getNewUrl(type, problemNumber, trgLanguageNumber);
  const order = getOrder(type, urlType, languageNumber, trgLanguageNumber);
  if (order === "SAME_PAGE") {
    // 이미 targetLanguage 페이지인 경우
    // showNotification(`This is already a ${type} {targetLanguage} page`);
    return;
  } else if (order === "UPDATE_TAB") {
    // ${urlType}/status 페이지면 언어만 바꿔주면 됨.
    await chrome.tabs.update(id, { url: newUrl });
  }
  // 오른쪽이 이미 ${urlType}/status라도 언어 다르면 새로 열어줌.
  // 다른 언어탭을 업데이트 해버리면 여러 언어 보고싶을 때 불편함.
  else createNewTabToRight(newUrl, index);
}

async function getNewUrl(
  tabType: string,
  problemNumber: string,
  languageNumber: string
): Promise<string> {
  const typeStr =
    tabType === BAEKJOON.TAB_TYPES.SOLVED_USERS ? "problem" : "short";
  return `${BAEKJOON.URLS.BASE}/${typeStr}/status/${problemNumber}/${languageNumber}/1`;
}

export function getBaekjoonExample(): string {
  const exampleElems = document.querySelectorAll(
    BAEKJOON.SELECTORS.exampleElems
  );
  if (!exampleElems || exampleElems.length === 0) {
    // showNotification("Failed to get exampleElems");
    return null;
  }
  const exampleData = parseExampleElements(exampleElems);
  return formatExampleData(exampleData);
}

function parseExampleElements(
  elements: NodeListOf<Element>
): BaekjoonExampleData[] {
  const exampleData: BaekjoonExampleData[] = [];
  for (let i = 0; i < elements.length; i += 2) {
    const inputElem = elements[i];
    const outputElem = elements[i + 1];
    exampleData.push({
      data: inputElem.textContent?.trim() ?? "",
      answer: outputElem.textContent?.trim() ?? "",
    });
  }
  return exampleData;
}

function formatExampleData(exampleData: BaekjoonExampleData[]): string {
  const formattedData = exampleData
    .map(
      ({ data, answer }) =>
        `    {"data": """${data}""", "answer": """${answer}"""}`
    )
    .join(",\n");
  return `inputdatas = [\n${formattedData}\n]`;
}

export async function getBaekjoonFormat(): Promise<string> {
  const targetLanguage = await getStoredLanguage();
  const upperPart = getUpperPart(targetLanguage);
  const lowerPart = getLowerPart(targetLanguage);
  const languageSpaces = BAEKJOON.LANGUAGE_SPACES[targetLanguage] || 4;
  return `${upperPart}${"\n".repeat(languageSpaces)}${lowerPart}\n`;
}

function getUpperPart(targetLanguage): string {
  /* content스크립트 -> getBaekjoonFormat -> getUpperPart
    content script에서 실행되므로 chrome.tabs API를 사용할 수 없음.
    대신 window.location.href를 사용하여 현재 url을 가져옴.
  */
  const curUrl = window.location.href;
  const upperTemplate =
    BAEKJOON.TEMPLATES[targetLanguage]?.UPPER ||
    BAEKJOON.TEMPLATES.PYTHON.UPPER;
  return upperTemplate.replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.URL, curUrl);
}

function getLowerPart(targetLanguage): string {
  const tierStr = getTierStr();
  const { subCnt, accRate } = getStat();
  const lowerTemplate =
    BAEKJOON.TEMPLATES[targetLanguage]?.LOWER ||
    BAEKJOON.TEMPLATES.PYTHON.LOWER;
  return lowerTemplate
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.TIER, tierStr)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS, subCnt)
    .replace(GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE, accRate);
}

function getTierStr(): string {
  const tierElement = document.querySelector<HTMLImageElement>(
    BAEKJOON.SELECTORS.tier
  );
  if (!tierElement?.src) {
    // showNotification("Failed to get tierElement src");
    return null;
  }
  const match = tierElement.src.match(BAEKJOON.REGEX.tier);
  if (!match) {
    // showNotification("Failed to get tierMatch");
    return null;
  }
  const tierNum = parseInt(match[1]) - 1;
  if (tierNum < 0 || tierNum > 29) return "Invalid Tier";
  const [tierIdx, rankIdx] = divMod(tierNum, 5);
  const tier = BAEKJOON.TIERS[tierIdx];
  const rank = BAEKJOON.RANKS[rankIdx];
  return `${tier} ${rank}`;
}

function getStat(): BaekjoonProblemStats {
  const table = document.querySelector<HTMLTableElement>(
    BAEKJOON.SELECTORS.problemInfoTable
  );
  if (!table) {
    // showNotification("Failed to get problem info table");
    return null;
  }
  const headers = Array.from(table.querySelectorAll("th"));
  const subIdx = headers.findIndex((th) => th.textContent.trim() === "제출");
  const accIdx = headers.findIndex(
    (th) => th.textContent.trim() === "정답 비율"
  );
  if (subIdx === -1 || accIdx === -1) {
    console.error("Required columns not found in the table");
    return null;
  }
  const cells = Array.from(table.querySelectorAll("td"));
  const subCnt = cells[subIdx].textContent.trim();
  const accRate = cells[accIdx].textContent.trim().slice(0, -1); // Remove the '%' sign
  return { subCnt, accRate };
}

export function handleBaekjoonRequest(requestFunction) {
  try {
    return requestFunction();
  } catch (error) {
    return null;
  }
}
