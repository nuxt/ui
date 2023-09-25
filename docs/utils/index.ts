export function trimArray <T> (array: Array<T | false | null | undefined>, { deep = false } = {}): Array<T> {
  return (deep
    ? array.map((item) => {
      if (Array.isArray(item)) {
        return trimArray(item, { deep })
      } else {
        return item
      }
    })
    : array).filter(item => !!item && (!Array.isArray(item) || item.length)) as Array<T>
}
