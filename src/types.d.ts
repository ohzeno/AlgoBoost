type baekjoonTabType = "Solved Users" | "Short Coding";

interface BaekjoonExampleData {
  data: string;
  answer: string;
}

interface BaekjoonRegExpMatches {
  problemMatch: RegExpMatchArray | null;
  solverMatch: RegExpMatchArray | null;
  submitMatch: RegExpMatchArray | null;
}

interface BaekjoonProblemStats {
  subCnt: string;
  accRate: string;
}
