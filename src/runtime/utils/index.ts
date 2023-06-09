export function classNames (...classes: any[string]) {
  return classes.filter(Boolean).join(' ')
}

export const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : null
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
