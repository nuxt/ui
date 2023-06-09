const colorsToExclude = [
  'inherit',
  'transparent',
  'current',
  'white',
  'black',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'cool'
]

const omit = (obj: object, keys: string[]) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  )
}

const kebabCase = (str: string) => {
  return str
    ?.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    ?.join('-')
}

const safelist = {
  avatar: (colorsAsRegex) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex}|gray)-500`)
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex}|gray)-400`),
    variants: ['dark']
  }],
  badge: (colorsAsRegex) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex})-50`)
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-400`),
    variants: ['dark']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-500`)
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-400`),
    variants: ['dark']
  }, {
    pattern: new RegExp(`ring-(${colorsAsRegex})-500`)
  }, {
    pattern: new RegExp(`ring-(${colorsAsRegex})-400`),
    variants: ['dark']
  }],
  button: (colorsAsRegex) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex})-50`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-100`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-400`),
    variants: ['dark', 'dark:disabled']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-500`),
    variants: ['disabled', 'dark:hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-600`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-900`),
    variants: ['dark:hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-950`),
    variants: ['dark', 'dark:hover']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-400`),
    variants: ['dark']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-500`),
    variants: ['dark:hover']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-600`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`outline-(${colorsAsRegex})-400`),
    variants: ['dark:focus-visible']
  }, {
    pattern: new RegExp(`outline-(${colorsAsRegex})-500`),
    variants: ['focus-visible']
  }, {
    pattern: new RegExp(`ring-(${colorsAsRegex})-400`),
    variants: ['dark:focus-visible']
  }, {
    pattern: new RegExp(`ring-(${colorsAsRegex})-500`),
    variants: ['focus-visible']
  }],
  input: (colorsAsRegex) => [{
    pattern: new RegExp(`ring-(${colorsAsRegex})-400`),
    variants: ['dark', 'dark:focus']
  }, {
    pattern: new RegExp(`ring-(${colorsAsRegex})-500`),
    variants: ['focus']
  }],
  notification: (colorsAsRegex) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex}|gray)-500`)
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex}|gray)-400`),
    variants: ['dark']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex}|gray)-500`)
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex}|gray)-400`),
    variants: ['dark']
  }]
}

const colorsAsRegex = (colors: string[]): string => colors.join('|')

export const excludeColors = (colors: object) => Object.keys(omit(colors, colorsToExclude)).map(color => kebabCase(color)) as string[]

const generateSafelistFor = (component, colors: string[], safelistColors?: { avatar?: string[], badge?: string[], button?: string[], input?: string[], notification?: string[] } | string[]) => {
  let colorsToInclude = [...colors]

  if (safelistColors) {
    if (typeof safelistColors === 'object' && Array.isArray(safelistColors[component])) {
      colorsToInclude = colorsToInclude.filter(color => color === 'primary' || safelistColors[component].includes(color))
    } else if (Array.isArray(safelistColors)) {
      colorsToInclude = colorsToInclude.filter(color => color === 'primary' || safelistColors.includes(color))
    }
  }

  return safelist[component](colorsAsRegex(colorsToInclude))
}

export const generateSafelist = (colors: string[], safelistColors?: { avatar?: string[], badge?: string[], button?: string[], input?: string[], notification?: string[] } | string[]) => {
  return ['avatar', 'badge', 'button', 'input', 'notification'].flatMap(component => generateSafelistFor(component, colors, safelistColors))
}
