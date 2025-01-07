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

interface ProgrammersTemplateData1 {
  baseCode: string;
  constraints: string;
  examples: string;
}

interface ProgrammersTemplateData2 {
  problemTag: string;
  level: string;
  finCnt: string;
  accRate: string;
}

type LineNumberMap = Map<number, number>;
