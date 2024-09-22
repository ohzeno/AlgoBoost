import { GLOBAL_CONSTANTS } from "../constants";
import { getStoredLanguage, setStoredLanguage } from "./storageUtils";

export async function createSection(title: string): Promise<HTMLElement> {
  const section = document.createElement("div");
  section.className = "section";

  const headerContainer = document.createElement("div");
  headerContainer.className = "section-header";

  const titleElement = document.createElement("div");
  titleElement.className = "section-title";
  titleElement.textContent = title;

  const languageSelector = await createLanguageSelector();

  headerContainer.appendChild(titleElement);
  headerContainer.appendChild(languageSelector);
  section.appendChild(headerContainer);

  const body = document.body;
  body.appendChild(section);
  return section;
}

export function createFeatureBtn(
  section: HTMLElement,
  featureName: string,
  onClick: () => void
): void {
  const button = document.createElement("button");
  button.className = "feature-button";
  button.textContent = featureName;
  button.addEventListener("click", onClick);

  section.appendChild(button);
}

async function createLanguageSelector(): Promise<HTMLSelectElement> {
  const languageSelector = document.createElement("select");
  languageSelector.className = "language-select";
  const storedLanguage = await getStoredLanguage();
  for (const [key, value] of Object.entries(GLOBAL_CONSTANTS.LANGUAGES)) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    if (value === storedLanguage) option.selected = true;
    languageSelector.appendChild(option);
  }

  languageSelector.addEventListener("change", (event) => {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    setStoredLanguage(selectedLanguage);
  });

  return languageSelector;
}
