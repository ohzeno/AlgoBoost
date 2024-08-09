import { createBaekjoonSection } from "./utils/baekjoonUtils";
import { createLeetcodeSection } from "./utils/leetcodeUtils";
import { createProgrammersSection } from "./utils/programmersUtils";

async function initializePopup(): Promise<void> {
  await createBaekjoonSection();
  await createLeetcodeSection();
  await createProgrammersSection();
}

initializePopup();
