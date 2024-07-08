import { createSection, createFeatureBtn } from "./uiUtils";
import { getActiveTab, createNewTabToRight, getPageUrl } from "./tabUtils";
import { BAEKJOON } from "../constants";
import { sendMessageToTab } from "./messageUtils";
import { divMod } from "./mathUtils";

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
    async () => await handleBaekjoonTab("Solved Users")
  );

  createFeatureBtn(
    section,
    "숏코딩",
    async () => await handleBaekjoonTab("Short Coding")
  );

  createFeatureBtn(section, "예제 복사", copyBaekjoonExample);
  createFeatureBtn(section, "양식 복사", copyBaekjoonFormat);
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
    ((type === "Solved Users" && urlType === "problem") ||
      (type === "Short Coding" && urlType === "short"));

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
  const typeStr = tabType === "Solved Users" ? "problem" : "short";
  return `${BAEKJOON.BASE_URL}/${typeStr}/status/${problemNumber}/${BAEKJOON.LANG_CODES.PYTHON}/1`;
}

async function copyBaekjoonExample(): Promise<void> {
  const exampleText = await sendMessageToTab("getBaekjoonExample");
  if (!exampleText) {
    // showNotification("Failed to get example");
    return;
  }
  navigator.clipboard
    .writeText(exampleText)
    .then(() => {
      // showNotification("Example Text copied to clipboard!");
    })
    .catch((err: Error) => {
      // showNotification(`Error: ${err.message}`);
    });
}

export async function getBaekjoonExample(): Promise<string> {
  const exampleElems = document.querySelectorAll(".sampledata");
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

async function copyBaekjoonFormat(): Promise<void> {
  const formatText = await sendMessageToTab("getBaekjoonFormat");
  if (!formatText) {
    // showNotification("Failed to get format");
    return;
  }
  navigator.clipboard
    .writeText(formatText)
    .then(() => {
      // showNotification("Format Text copied to clipboard!");
    })
    .catch((err: Error) => {
      // showNotification(`Error: ${err.message}`);
    });
}

export async function getBaekjoonFormat() {
  /*
  # https://www.acmicpc.net/problem/1956
  import sys
  # sys.stdin = open('input.txt')
  def input():
      return sys.stdin.readline().rstrip()
  """
  """



  """
  현 시점 실버 1. 제출 950. 정답률 31.761 %
  """
  */

  const tierStr = getTierStr();
}

function getTierStr(): string {
  const tierElement = document.querySelector("img.solvedac-tier");
  if (!tierElement) {
    // showNotification("Failed to get tierElement");
    return null;
  }
  const src = tierElement.getAttribute("src");
  const match = src.match(/tier\/(\d+)\.svg/);
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
