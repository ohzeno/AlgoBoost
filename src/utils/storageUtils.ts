const LANGUAGE_KEY = "selectedLanguage";

export async function getStoredLanguage(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(LANGUAGE_KEY, (result) => {
      resolve(result[LANGUAGE_KEY] || "PYTHON");
    });
  });
}

export function setStoredLanguage(language: string): void {
  chrome.storage.sync.set({ [LANGUAGE_KEY]: language });
}
