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

export async function getPageUrl(): Promise<string> {
  const activeTab = await getActiveTab();
  return activeTab.url;
}

export async function getProgrammersSearchUrlTab(
  searchUrl: string
): Promise<chrome.tabs.Tab | null> {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      const targetTab = tabs.find((tab) => tab.url?.includes(searchUrl));
      resolve(targetTab || null);
    });
  });
}
