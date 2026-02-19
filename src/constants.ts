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
    DATA: "{DATA}",
    ANSWER: "{ANSWER}",
    FUNCTION_NAME: "{FUNCTION_NAME}",
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
    RUST: "Rust",
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
    JAVASCRIPT: "17",
  },
  TIERS: ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"],
  RANKS: ["V", "IV", "III", "II", "I"],
  TEMPLATES: {
    PYTHON: {
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
    JAVASCRIPT: {
      UPPER: `// ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}
const realFile = process.platform === "linux" ? "/dev/stdin" : "input.txt";
const realCodeLines = require("fs").readFileSync(realFile).toString().trim().split("\n");
let realCodeLineIdx = 0;
const input = () => realCodeLines[realCodeLineIdx++];
/*
constraints:
*/`,
      LOWER: `/*
현 시점 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.TIER}. 제출 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS}. 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE} %
*/`,
    },
    JAVA: {
      UPPER: `// ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}

import java.io.*;
import java.util.*;

/*

 */


public class Main {
//    static String INPUT = "input.txt";
    static BufferedReader br;

    public static void main(String[] args) throws IOException {
//        br = new BufferedReader(new FileReader(INPUT));
        br = new BufferedReader(new InputStreamReader(System.in));

    }
}`,
      LOWER: `/*
현 시점 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.TIER}. 제출 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS}. 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE} %
*/`,
    },
  },
  LANGUAGE_SPACES: {
    PYTHON: 4,
    JAVA: 3,
  },
  SELECTORS: {
    exampleElems: ".sampledata",
    tier: "img.solvedac-tier",
    problemInfoTable: "#problem-info",
    title: "#problem_title",
  },
  COMMANDS: {
    GET_EXAMPLE: "getBaekjoonExample",
    GET_FORMAT: "getBaekjoonFormat",
    GET_TITLE: "getBaekjoonTitle",
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
    PYTHON: {
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
            summary += f"    {content}"
            summary = summary.rstrip()
        print(summary)`,
    },
    JAVASCRIPT: {
      UPPER: `// ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}

/*
constraints:
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
*/


${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}`,
      LOWER: `${GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS}

/*
LeetCode ${GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY}.
제출 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS}, 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE}
*/

for (let i = 0; i < inputDatas.length; i++) {
    const {data, answer} = inputDatas[i];
    const res = ${GLOBAL_CONSTANTS.TEMPLATE_VAR.FUNCTION_NAME}(...data);
    if (JSON.stringify(res) === JSON.stringify(answer)) {
        console.log("pass");
    } else {
        let summary = "fail";
        for (const [label, content] of [["expected:", answer], ["got:", res]]) {
            summary += \`\\n  \${label}\\n\`;
            summary += \`    \${content}\`;
            summary = summary.trimEnd();
        }
        console.log(summary);
    }
}`,
    },
    RUST: {
      UPPER: `// ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}
struct Solution;

/*
constraints:
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
*/

${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}

#[macro_export]
macro_rules! run_judge {
    (
        $func:path, 
        [ $( { data: ( $($arg:expr),* ), answer: $ans:expr } ),* $(,)? ]
    ) => {
        $(
            let result = $func($($arg),*);
            let expected = $ans;            
            if result == expected {
                println!("pass");
            } else {
                let mut summary = String::from("fail");
                for (label, content) in [("expected:", &expected), ("got:", &result)] {
                    summary.push_str(&format!("\n  {}\n", label));
                    summary.push_str(&format!("    {:?}", content));
                }
                summary = summary.trim_end().to_string();
                println!("{}", summary);
            }
        )*
    };
}

#[allow(unused_macros)]
macro_rules! svec {
    ($($x:expr),* $(,)?) => {
        vec![$($x.to_string()),*]
    };
}`,
      LOWER: `fn main() {
    run_judge!(
        Solution::${GLOBAL_CONSTANTS.TEMPLATE_VAR.FUNCTION_NAME},
        ${GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS}
    );
}

/*
LeetCode ${GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY}.
제출 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.SUBMISSIONS}, 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE}
*/`,
    },
    EXAMPLES: {
      PYTHON: {
        start: "inputdatas = [",
        item: `    {"data": [${GLOBAL_CONSTANTS.TEMPLATE_VAR.DATA}], "answer": ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ANSWER}}`,
        end: "]",
      },
      JAVASCRIPT: {
        start: "const inputDatas = [",
        item: `    {data: [${GLOBAL_CONSTANTS.TEMPLATE_VAR.DATA}], answer: ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ANSWER}}`,
        end: "];",
      },
      RUST: {
        start: "[",
        item: `            {data: (${GLOBAL_CONSTANTS.TEMPLATE_VAR.DATA}), answer: ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ANSWER}}`,
        end: "        ]",
      },
    },
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
    problem: `https://school.programmers.co.kr/learn/courses/30/lessons`,
  },
  REGEX: {
    problem:
      /^https:\/\/school\.programmers\.co\.kr\/learn\/courses\/30\/lessons\/(\d+)(\?language=([a-zA-Z0-9]+))?$/,
  },
  TEMPLATES: {
    PYTHON: `# ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}
"""
constraints:
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
"""


${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}


${GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS}


"""
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
            summary += f"    {content}"
            summary = summary.rstrip()
        print(summary)
`,
    JAVA: `// ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}

import java.util.*;

/*
constraints:
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
*/

${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}

/*
${GLOBAL_CONSTANTS.TEMPLATE_VAR.PROBLEM_TAG}
${GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY}. 현 시점 완료한 사람 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.FINISHED_CNT}, 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE}
*/

public class Main {
    public static void main(String[] args) {
${GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS}

        Solution solution = new Solution();

        for (Map<String, Object> inputdata : inputdatas) {
            Object data = inputdata.get("data");
            Object ans = inputdata.get("answer");

            Object res = solution.solution((List<Object>) data);

            if (res.equals(ans)) {
                System.out.println("pass");
            } else {
                String summary = "fail";
                summary += "\\n  expected:\\n";
                summary += "    " + ans;
                summary += "\\n  got:\\n";
                summary += "    " + res;
                System.out.println(summary);
            }
        }
    }
}
`,
    JAVASCRIPT: `// ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}

/*
constraints:
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
*/


${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}


${GLOBAL_CONSTANTS.TEMPLATE_VAR.INPUTDATAS}

/*
${GLOBAL_CONSTANTS.TEMPLATE_VAR.PROBLEM_TAG}
${GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY}. 현 시점 완료한 사람 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.FINISHED_CNT}, 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE}
*/

for (let i = 0; i < inputDatas.length; i++) {
    const {data, answer} = inputDatas[i];
    const res = solution(...data);
    if (JSON.stringify(res) === JSON.stringify(answer)) {
        console.log("pass");
    } else {
        let summary = "fail";
        for (const [label, content] of [["expected:", answer], ["got:", res]]) {
            summary += \`\\n  \${label}\\n\`;
            summary += \`    \${content}\`;
            summary = summary.trimEnd();
        }
        console.log(summary);
    }
}
`,
    SQL: `# ${GLOBAL_CONSTANTS.TEMPLATE_VAR.URL}
/*
${GLOBAL_CONSTANTS.TEMPLATE_VAR.CONSTRAINTS}
*/


${GLOBAL_CONSTANTS.TEMPLATE_VAR.BASE_CODE}


/*
${GLOBAL_CONSTANTS.TEMPLATE_VAR.PROBLEM_TAG}
${GLOBAL_CONSTANTS.TEMPLATE_VAR.DIFFICULTY}. 현 시점 완료한 사람 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.FINISHED_CNT}, 정답률 ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ACCEPTANCE_RATE}
*/
`,
    EXAMPLES: {
      PYTHON: {
        start: "inputdatas = [",
        item: `    {"data": [${GLOBAL_CONSTANTS.TEMPLATE_VAR.DATA}], "answer": ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ANSWER}}`,
        end: "]",
      },
      JAVA: {
        start: "        List<Map<String, Object>> inputdatas = List.of(",
        item: `                Map.of("data", List.of(${GLOBAL_CONSTANTS.TEMPLATE_VAR.DATA}), "answer", ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ANSWER})`,
        end: "        );",
      },
      JAVASCRIPT: {
        start: "const inputDatas = [",
        item: `    {data: [${GLOBAL_CONSTANTS.TEMPLATE_VAR.DATA}], answer: ${GLOBAL_CONSTANTS.TEMPLATE_VAR.ANSWER}}`,
        end: "];",
      },
    },
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
