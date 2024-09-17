import { GLOBAL_CONSTANTS } from "../constants";

export function sanitizeText(text: string): string {
  return text.replace(
    /[\\\/|?"*:.<>]/g,
    (char) => GLOBAL_CONSTANTS.REPLACE_DICT[char] || char
  );
}
