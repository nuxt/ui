export function classNames (...classes: any[string]) {
  return classes.filter(Boolean).join(' ')
}

export const kebabCase = (str: string) => {
  return str
    ?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    ?.join('-')
}

export const omit = (obj: object, keys: string[]) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  )
}

export const getSlotsChildren = (slots: any) => {
  let children = slots.default?.()
  if (children.length) {
    if (typeof children[0].type === 'symbol') {
      // @ts-ignore-next
      children = children[0].children
      // @ts-ignore-next
    } else if (children[0].type.name === 'ContentSlot') {
      // @ts-ignore-next
      children = children[0].ctx.slots.default?.()
    }
  }
  return children
}
