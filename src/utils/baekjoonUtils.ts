import { createSection, createFeatureBtn } from "./uiUtils";
import { getActiveTab, createNewTabToRight, getPageUrl } from "./tabUtils";
import { BAEKJOON } from "../constants";
import { divMod } from "./mathUtils";
import { copyTextToClipboard } from "./clipboardUtils";

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

  const section = createSection("백준");

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
    async () => await copyTextToClipboard(BAEKJOON.COMMANDS.GET_FORMAT)
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
  languageNumber: string | null
): "SAME_PAGE" | "UPDATE_TAB" | "NEW_TAB" {
  const isSameType =
    urlType &&
    ((type === BAEKJOON.TAB_TYPES.SOLVED_USERS && urlType === "problem") ||
      (type === BAEKJOON.TAB_TYPES.SHORT_CODING && urlType === "short"));

  if (isSameType)
    // 같은 페이지면 언어만 일치시켜주면 됨.
    return languageNumber === BAEKJOON.LANG_CODES.PYTHON
      ? "SAME_PAGE"
      : "UPDATE_TAB";

  return "NEW_TAB";
}

async function handleBaekjoonTab(type: baekjoonTabType) {
  const { id, url, index } = await getActiveTab();
  const pageInfo = getPageInfo(url);
  const { problemNumber, urlType, languageNumber } = pageInfo;
  const newUrl = getNewUrl(type, problemNumber);
  const order = getOrder(type, urlType, languageNumber);
  if (order === "SAME_PAGE") {
    // 이미 python 페이지인 경우
    // showNotification(`This is already a ${type} python page`);
    return;
  } else if (order === "UPDATE_TAB") {
    // ${urlType}/status 페이지면 언어만 바꿔주면 됨.
    await chrome.tabs.update(id, { url: newUrl });
  }
  // 오른쪽이 이미 ${urlType}/status라도 언어 다르면 새로 열어줌.
  // 다른 언어탭을 업데이트 해버리면 여러 언어 보고싶을 때 불편함.
  else createNewTabToRight(newUrl, index);
}

function getNewUrl(tabType: string, problemNumber: string): string {
  const typeStr =
    tabType === BAEKJOON.TAB_TYPES.SOLVED_USERS ? "problem" : "short";
  return `${BAEKJOON.BASE_URL}/${typeStr}/status/${problemNumber}/${BAEKJOON.LANG_CODES.PYTHON}/1`;
}

export function getBaekjoonExample(): string {
  const exampleElems = document.querySelectorAll(
    BAEKJOON.SELECTOR.exampleElems
  );
  if (!exampleElems || exampleElems.length === 0) {
    // showNotification("Failed to get exampleElems");
    return null;
  }
  const exampleData = parseExampleElements(exampleElems);
  return formatExampleData(exampleData);
}

function parseExampleElements(elements: NodeListOf<Element>): ExampleData[] {
  const exampleData: ExampleData[] = [];
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

function formatExampleData(exampleData: ExampleData[]): string {
  const formattedData = exampleData
    .map(
      ({ data, answer }) =>
        `    {"data": """${data}""", "answer": """${answer}"""}`
    )
    .join(",\n");
  return `inputdatas = [\n${formattedData}\n]`;
}

export function getBaekjoonFormat(): string {
  const upperPart = getUpperPart();
  const lowerPart = getLowerPart();
  return `${upperPart}\n\n\n\n${lowerPart}\n`;
}

function getUpperPart(): string {
  /* content스크립트 -> getBaekjoonFormat -> getUpperPart
    content script에서 실행되므로 chrome.tabs API를 사용할 수 없음.
    대신 window.location.href를 사용하여 현재 url을 가져옴.
  */
  const curUrl = window.location.href;
  return BAEKJOON.TEMPLATE.UPPER.replace("{URL}", curUrl);
}

function getLowerPart(): string {
  const tierStr = getTierStr();
  const { subCnt, accRate } = getStat();
  return BAEKJOON.TEMPLATE.LOWER.replace("{TIER}", tierStr)
    .replace("{SUBCNT}", subCnt)
    .replace("{ACCRATE}", accRate);
}

function getTierStr(): string {
  const tierElement = document.querySelector<HTMLImageElement>(
    BAEKJOON.SELECTOR.tier
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
  const tdElems = document.querySelectorAll(BAEKJOON.SELECTOR.tdElems);
  if (!tdElems || tdElems.length < 6) {
    // showNotification("Failed to get table");
    return null;
  }
  const subCnt = tdElems[3].textContent.trim();
  const accRate = tdElems[5].textContent.trim().slice(0, -1);
  return { subCnt: subCnt, accRate: accRate };
}

export function handleBaekjoonRequest(requestFunction) {
  try {
    return requestFunction();
  } catch (error) {
    return null;
  }
}
