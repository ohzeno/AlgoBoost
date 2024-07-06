import { createBaekjoonSection } from "./utils/baekjoonUtils";

async function initializePopup(): Promise<void> {
  await createBaekjoonSection();
}

initializePopup();
