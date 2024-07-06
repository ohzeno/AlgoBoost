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
  button.textContent = featureName; // 버튼 안에 기능 이름 넣기
  button.addEventListener("click", onClick); // 클릭 이벤트 추가

  section.appendChild(button); // 버튼을 섹션에 추가
}

export function handleAbleChange(
  event,
  targetElement: HTMLInputElement | HTMLButtonElement
) {
  targetElement.disabled = !event.target.checked;
}
