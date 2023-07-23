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
