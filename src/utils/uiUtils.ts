export function createSection(title: string): HTMLElement {
  const section = document.createElement("div");
  section.className = "section";

  const titleElement = document.createElement("div");
  titleElement.className = "section-title";
  titleElement.textContent = title;

  section.appendChild(titleElement);
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
