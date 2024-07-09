export function divMod(dividend: number, divisor: number): [number, number] {
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  return [quotient, remainder];
}
