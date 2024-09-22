export const GLOBAL_CONSTANTS = {
  BULLET_TYPES: {
    disc: "•",
    circle: "◦",
    square: "▪",
  },
  COMMANDS: {
    COPY: "copy",
  },
  RECIPIENTS: {
    BACKGROUND: "background",
    CONTENT: "content",
  },
  TEMPLATE_VAR: {
    URL: "{URL}",
    BASE_CODE: "{BASE_CODE}",
    CONSTRAINTS: "{CONSTRAINTS}",
    INPUTDATAS: "{INPUTDATAS}",
    PROBLEM_TAG: "{PROBLEM_TAG}",
    DIFFICULTY: "{DIFFICULTY}",
    SUBMISSIONS: "{SUBMISSIONS}",
    ACCEPTANCE_RATE: "{ACCEPTANCE_RATE}",
    TIER: "{TIER}",
    FINISHED_CNT: "{FINISHED_CNT}",
    PARAMETER: "{PARAMETER}",
  },
  PORT_NAMES: {
    GET_PROBLEM_INFO_TO_BACKGROUND: "get-problem-info-to-background",
    GET_PROBLEM_INFO_TO_CONTENT: "get-problem-info-to-content",
    GET_FORMAT_TO_CONTENT: "get-format-to-content",
  },
  REPLACE_DICT: {
    "\\": "＼",
    "/": "／",
    "|": "｜",
    "?": "？",
    '"': "“",
    "*": "＊",
    ":": "：",
    ".": "․",
    "<": "＜",
    ">": "＞",
  },
  LANGUAGES: {
    PYTHON: "Python",
    JAVA: "Java",
    JAVASCRIPT: "JavaScript",
    SQL: "SQL",
  },
};

export const BAEKJOON = {
  URLS: {
    BASE: "https://www.acmicpc.net",
  },
  REGEX: {
    problem: /^https:\/\/www\.acmicpc\.net\/problem\/(\d+)$/,
    solver:
      /^https:\/\/www\.acmicpc\.net\/(problem|short)\/status\/(\d+)(?:\/(\d+)\/(\d+))?$/,
    submit:
      /^https:\/\/www\.acmicpc\.net\/status\?(?=.*\bfrom_mine=\d+\b)(?=.*\bproblem_id=(\d+)\b)(?=.*\buser_id=[^&]+\b).*$/,
    tier: /tier\/(\d+)\.svg/,
  },
  LANG_CODES: {
    PYTHON: "1003",
    JAVA: "1002",
  },
  TIERS: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"],
  RANKS: ["V", "IV", "III", "II", "I"],
  TEMPLATES: {
    UPPER: `# ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}
import sys
# sys.stdin = open('input.txt')
def input():
    return sys.stdin.readline().rstrip()
"""
"""`,
    LOWER: `"""
현 시점 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.TIER}. 제출 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS}. 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE} %
"""`,
  },
  SELECTORS: {
    exampleElems: ".sampledata",
    tier: "img.solvedac-tier",
    problemInfoTable: "#problem-info",
  },
  COMMANDS: {
    GET_EXAMPLE: "getBaekjoonExample",
    GET_FORMAT: "getBaekjoonFormat",
  },
  TAB_TYPES: {
    SOLVED_USERS: "Solved Users",
    SHORT_CODING: "Short Coding",
  } as const,
};

export const LEETCODE = {
  URLS: {
    BASE: "https://leetcode.com",
  },
  REGEX: {
    problem: /^https:\/\/leetcode\.com\/problems\/.+/,
  },
  TEMPLATES: {
    UPPER: `# ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}
from typing import Optional, List

"""
constraints:
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
"""


${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}`,
    LOWER: `${GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS}

"""
LeetCode ${GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY}.
제출 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS}, 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE}

"""
import inspect

functions = [value for value in Solution.__dict__.values() if inspect.isfunction(value)]
my_func = functions[0]
sol = Solution()
for inputdata in inputdatas:
    data, ans = inputdata["data"], inputdata["answer"]
    res = my_func(sol, *data)
    if res == ans:
        print("pass")
    else:
        summary = "fail"
        for label, content in [("expected:", ans), ("got:", res)]:
            summary += f"\\n  {label}\\n"
            summary += f"    {content}\\n"
            summary = summary.rstrip()
        print(summary)`,
  },
  SELECTORS: {
    description: "#description_tabbar_outer",
    title: 'div[class*="text-title-large"] a',
    difficulty: 'div[class*="text-difficulty"]',
  },
  COMMANDS: {
    GET_FORMAT: "getLeetcodeFormat",
    GET_TITLE: "getLeetcodeTitle",
  },
};

export const PROGRAMMERS = {
  URLS: {
    BASE: "https://programmers.co.kr",
    SEARCH: `https://school.programmers.co.kr/learn/challenges?order=acceptance_desc&page=1&search=${GLOBAL_CONSTANTS.TEMPLATE_VAR.PARAMETER}`,
  },
  REGEX: {
    problem:
      /^https:\/\/school\.programmers\.co\.kr\/learn\/courses\/30\/lessons\/\d+$/,
  },
  TEMPLATES: {
    UPPER: `# ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}
"""
constraints:
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
"""


${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}


${GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS}`,
    LOWER: `"""
${GLOBAL_CONSTANTS.TEMPLATE_VAR.PROBLEM_TAG}
${GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY}. 현 시점 완료한 사람 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.FINISHED_CNT}, 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE}
"""

for inputdata in inputdatas:
    data, ans = inputdata["data"], inputdata["answer"]
    res = solution(*data)
    if res == ans:
        print("pass")
    else:
        summary = "fail"
        for label, content in [("expected:", ans), ("got:", res)]:
            summary += f"\\n  {label}\\n"
            summary += f"    {content}\\n"
            summary = summary.rstrip()
        print(summary)`,
  },
  SELECTORS: {
    title: "div.lesson-content",
    editor: 'textarea#code[name="code"]',
    problemTag: "ol.breadcrumb > li:nth-child(2) > a",
    resetBtn: "button.init-button",
    table: "table tbody",
    titleA: ".title div a",
    level: ".level span",
    finishedCnt: ".finished-count",
    acceptanceRate: ".acceptance-rate",
  },
  COMMANDS: {
    GET_FORMAT: "getProgrammersFormat",
    GET_TITLE: "getProgrammersTitle",
    GET_PROBLEM_INFO_REQUEST: "getProgrammersProblemInfoRequest",
    GET_PROBLEM_INFO_FROM_TAB: "getProgrammersProblemInfoFromTab",
    SEARCH_RESET: "programmersSearchReset",
  },
};
