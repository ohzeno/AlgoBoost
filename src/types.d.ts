type baekjoonTabType = "Solved Users" | "Short Coding";

interface ExampleData {
  data: string;
  answer: string;
}

interface BaekjoonRegExpMatches {
  problemMatch: RegExpMatchArray | null;
  solverMatch: RegExpMatchArray | null;
  submitMatch: RegExpMatchArray | null;
}
