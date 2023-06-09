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
    children = children.flatMap(c => {
      if (typeof c.type === 'symbol') {
        if (typeof c.children === 'string') {
          // `v-if="false"` or commented node
          return
        }
        return c.children
      } else if (c.type.name === 'ContentSlot') {
        return c.ctx.slots.default?.()
      }
      return c
    }).filter(Boolean)
  }
  return children
}
