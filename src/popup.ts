import { createBaekjoonSection } from "./utils/baekjoonUtils";
import { createLeetcodeSection } from "./utils/leetcodeUtils";

async function initializePopup(): Promise<void> {
  await createBaekjoonSection();
  await createLeetcodeSection();
}

initializePopup();
