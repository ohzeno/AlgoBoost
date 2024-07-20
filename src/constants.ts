export const BAEKJOON = {
  BASE_URL: "https://www.acmicpc.net",
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
  TEMPLATE: {
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
  SELECTOR: {
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
  BASE_URL: "https://leetcode.com",
  REGEX: {
    problem: /^https:\/\/leetcode\.com\/problems\/.+/,
  },
  TEMPLATE: {},
  SELECTOR: {},
};
