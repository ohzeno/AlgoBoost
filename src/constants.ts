export const BAEKJOON = {
  BASE_URL: "https://www.acmicpc.net",
  REGEX: {
    problem: /^https:\/\/www\.acmicpc\.net\/problem\/(\d+)$/,
    solver:
      /^https:\/\/www\.acmicpc\.net\/(problem|short)\/status\/(\d+)(?:\/(\d+)\/(\d+))?$/,
    submit:
      /^https:\/\/www\.acmicpc\.net\/status\?(?=.*\bfrom_mine=\d+\b)(?=.*\bproblem_id=(\d+)\b)(?=.*\buser_id=[^&]+\b).*$/,
  },
  LANG_CODES: {
    PYTHON: "1003",
  },
  TIERS: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"],
  RANKS: ["V", "IV", "III", "II", "I"],
};
