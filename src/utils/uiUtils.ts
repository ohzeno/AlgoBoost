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

export function addFeatureToSection(
  section: HTMLElement,
  featureName: string,
  buttonText: string,
  buttonId: string
): void {
  const feature = document.createElement("div");
  feature.className = "feature";

  const nameSpan = document.createElement("span");
  nameSpan.className = "feature-name";
  nameSpan.textContent = featureName;

  feature.appendChild(nameSpan);

  const button = document.createElement("button");
  button.className = "feature-button";
  button.textContent = buttonText;
  button.id = buttonId;

  feature.appendChild(button);
  section.appendChild(feature);
}

export function handleAbleChange(
  event,
  targetElement: HTMLInputElement | HTMLButtonElement
) {
  targetElement.disabled = !event.target.checked;
}
