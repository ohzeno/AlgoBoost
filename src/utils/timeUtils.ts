export function calculateDelay(tabsLength: number): number {
  const maxDelay = 6000;
  const tmp = 1500 + 20 * (Math.floor(tabsLength / 2) + 1) ** 1.8;
  return Math.min(maxDelay, tmp);
}
