import colors from 'tailwindcss/colors.js'
import { without, kebabCase } from 'lodash-es'

export const safeColors = without(Object.keys(colors).map(kebabCase), 'inherit', 'current', 'transparent', 'black', 'white', 'gray')

export const safeColorsAsRegex = safeColors.join('|')
