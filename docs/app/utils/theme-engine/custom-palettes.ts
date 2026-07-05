import type { Shade } from './types'

/**
 * Studio-only palettes, mirrored from the docs' `@theme static` block in
 * main.css. They aren't part of tailwind, so exports referencing them must
 * inline the ramp — a consumer's build has no `--color-sand-*` to resolve.
 */
export const CUSTOM_PALETTES: Record<string, Record<Shade, string>> = {
  sand: {
    50: '#FAF8F4',
    100: '#F3EFE7',
    200: '#E6DFD1',
    300: '#D4C9B4',
    400: '#B7A88D',
    500: '#9A8B6F',
    600: '#7E7059',
    700: '#665A48',
    800: '#52483A',
    900: '#443C31',
    950: '#26211A'
  },
  sage: {
    50: '#F6F8F5',
    100: '#EBF0EA',
    200: '#D8E1D6',
    300: '#BCCBBA',
    400: '#97AB95',
    500: '#778C75',
    600: '#5F725E',
    700: '#4D5C4C',
    800: '#3F4B3E',
    900: '#343E34',
    950: '#1B221B'
  },
  ash: {
    50: '#F5F6F8',
    100: '#E9EBEF',
    200: '#D3D7DF',
    300: '#B0B7C4',
    400: '#848EA1',
    500: '#646F84',
    600: '#4F586A',
    700: '#404755',
    800: '#363C47',
    900: '#2C313A',
    950: '#16181E'
  },
  cocoa: {
    50: '#FAF6F2',
    100: '#F2E9E1',
    200: '#E3D2C2',
    300: '#CFB49D',
    400: '#B58F6F',
    500: '#966F4C',
    600: '#7C5A3C',
    700: '#654931',
    800: '#533C2A',
    900: '#453325',
    950: '#251A12'
  },
  marine: {
    50: '#F2F6FB',
    100: '#E2ECF7',
    200: '#C6D9EF',
    300: '#9DBDE2',
    400: '#6C9AD0',
    500: '#467BBB',
    600: '#33619E',
    700: '#2B4F80',
    800: '#274268',
    900: '#243A57',
    950: '#182636'
  }
}
