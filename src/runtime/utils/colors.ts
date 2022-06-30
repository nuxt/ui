import { omit, kebabCase } from './index'

export const colorsToExclude = [
  'inherit',
  'transparent',
  'current',
  'white',
  'black',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone'
]

export const excludeColors = (colors: object) => Object.keys(omit(colors, colorsToExclude)).map(color => kebabCase(color))

export const colorsAsRegex = (colors: string[]) => colors.join('|')
