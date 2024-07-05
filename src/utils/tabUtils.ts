export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

export async function createNewTabToRight(
  newUrl: string,
  index: number
): Promise<void> {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const rightTab = tabs.find((tab) => tab.index === index + 1);
  if (rightTab && rightTab.url === newUrl) {
    // showNotification("New tab is already opened");
    return;
  }
  await chrome.tabs.create({ url: newUrl, index: index + 1 });
}

function updateTabUrl(tabData: [string, chrome.tabs.Tab], curNum: string) {
  const [urlNum, tab] = tabData;
  const newUrl = tab.url.replace(urlNum, curNum);
  chrome.tabs.update(tab.id, { url: newUrl });
}

export async function updateTabsWithDelay(
  tabsToUpdate: [string, chrome.tabs.Tab][],
  delay: number,
  curNum: string
) {
  for (let tab of tabsToUpdate) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    updateTabUrl(tab, curNum);
  }
}
