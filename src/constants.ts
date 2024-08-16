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
  },
  TIERS: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"],
  RANKS: ["V", "IV", "III", "II", "I"],
  TEMPLATES: {
    UPPER: `# {URL}
import sys
# sys.stdin = open('input.txt')
def input():
    return sys.stdin.readline().rstrip()
"""
"""`,
    LOWER: `"""
현 시점 {TIER}. 제출 {SUBCNT}. 정답률 {ACCRATE} %
"""`,
  },
  SELECTORS: {
    exampleElems: ".sampledata",
    tier: "img.solvedac-tier",
    tdElems: "#problem-info > tbody > tr > td",
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
    UPPER: `# {URL}
from typing import Optional, List

"""
constraints:
{CONSTRAINTS}
"""


{BASE_CODE}`,
    LOWER: `{INPUTDATAS}

"""
LeetCode {DIFFICULTY}.
제출 {SUBMISSIONS}, 정답률 {ACCEPTANCERATE}%

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
    SEARCH:
      "https://school.programmers.co.kr/learn/challenges?order=acceptance_desc&page=1&search={PARAM}",
  },
  REGEX: {
    problem_list:
      /^https:\/\/school\.programmers\.co\.kr\/learn\/challenges(?:\/(?:beginner|training))?\?order=[^&]+(&.*)?$/,
    specilal_problem_list:
      /^https:\/\/school\.programmers\.co\.kr\/learn\/courses\/30\/parts\/\d+$/,
    problem:
      /^https:\/\/school\.programmers\.co\.kr\/learn\/courses\/30\/lessons\/\d+$/,
  },
  TEMPLATES: {
    UPPER: `# {URL}
"""
constraints:
{CONSTRAINTS}
"""


{BASE_CODE}


{INPUTDATAS}`,
    LOWER: `"""
{PROBLEM_TAG}
{DIFFICULTY}. 현 시점 완료한 사람 {COMPLETE_CNT}명, 정답률 {ACCEPTANCERATE}%
"""

for inputdata in inputdatas:
    data, ans = inputdata["data"], inputdata["answer"]
    res = solution(*data)
    if res == ans:
        print("pass")
    else:
        summary = "fail"
        for label, content in [("expected:", ans), ("got:", res)]:
            summary += f"\n  {label}\n"
            summary += f"    {content}\n"
            summary = summary.rstrip()
        print(summary)`,
  },
  SELECTORS: {
    title: "div.lesson-content",
    editor: 'textarea#code[name="code"]',
    problemTag: "ol.breadcrumb > li:nth-child(2) > a",
  },
  COMMANDS: {
    GET_FORMAT: "getProgrammersFormat",
    GET_TITLE: "getProgrammersTitle",
    GET_PROBLEM_INFO: "getProgrammersProblemInfo",
  },
};

export const GLOBAL_CONSTANTS = {
  BULLET_TYPES: {
    disc: "•",
    circle: "◦",
    square: "▪",
  },
  COMMANDS: {
    COPY: "copy",
  },
};
