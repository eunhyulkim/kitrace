export const fillZero = (value: number, length: number) => {
  const valueStr = String(value)

  if (valueStr.length >= length) {
    return valueStr.slice(0, length)
  }

  return new Array(length - valueStr.length)
    .fill('0')
    .join('')
    .concat(valueStr.slice(0, length))
}

export function checkLastCharHasJongSung(word: string) {
  if (typeof word !== 'string') return null

  const lastLetter = word[word.length - 1]
  const uni = lastLetter.charCodeAt(0)

  if (uni < 44032 || uni > 55203) return null

  return (uni - 44032) % 28 != 0
}

export function withHasJongSung(
  word: string,
  suffixWithHasJongSung: string,
  suffixWithHasNotJongSung: string
) {
  return `${word}${
    checkLastCharHasJongSung(word)
      ? suffixWithHasJongSung
      : suffixWithHasNotJongSung
  }`
}

export function replaceWithJongSung(
  centence: string,
  targetStr: string,
  replaceStr: string
) {
  return centence
    .replace(`${targetStr}은`, withHasJongSung(replaceStr, '은', '는'))
    .replace(`${targetStr}는`, withHasJongSung(replaceStr, '은', '는'))
    .replace(`${targetStr}을`, withHasJongSung(replaceStr, '을', '를'))
    .replace(`${targetStr}를`, withHasJongSung(replaceStr, '을', '를'))
    .replace(`${targetStr}이`, withHasJongSung(replaceStr, '이', '가'))
    .replace(`${targetStr}가`, withHasJongSung(replaceStr, '이', '가'))
    .replace(`${targetStr}과`, withHasJongSung(replaceStr, '과', '와'))
    .replace(`${targetStr}와`, withHasJongSung(replaceStr, '과', '와'))
    .replace(targetStr, replaceStr)
}
