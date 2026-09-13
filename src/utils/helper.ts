// 将转义字符转换为原始字符
export const unescapeString = (str: string): string => {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\'/g, "\'")
    .replace(/\\"/g, '\"')
    .replace(/\\\\/g, '\\')
}
