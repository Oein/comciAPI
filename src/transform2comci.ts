import TRANS from "./TRANS";

const korean = /[ㄱ-ㅣ|가-힣]/;
const normalKorean = /[ㄱ-ㅣ]/;
export function transformChar2Comci(char: string) {
  if (!korean.test(char)) return char;
  if (normalKorean.test(char)) {
    const NUM = 0xa1 + char.charCodeAt(0) - 12593;
    return `%A4%${NUM.toString(16).toLocaleUpperCase()}`;
  }
  return TRANS[char] || char;
}
export function transfrom2Comci(str: string) {
  return str.split("").map(transformChar2Comci).join("");
}
