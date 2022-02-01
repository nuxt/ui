import defu from 'defu'
import preset from './default'

const badge = {
  variant: {
    primary: 'bg-gray-800 text-white',
    secondary: 'bg-white text-gray-700'
  }
}

const button = {
  variant: {
    primary: 'border border-transparent text-white bg-gray-800 hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900',
    secondary: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900',
    link: 'border border-transparent text-gray-900 hover:underline focus:underline'
  }
}

const input = {
  appearance: {
    default: 'focus:ring-1 focus:ring-gray-900 focus:border-gray-900 border border-gray-300 rounded-md shadow-sm'
  }
}

const textarea = {
  ...input
}

const select = {
  ...input
}

const radio = {
  base: 'h-4 w-4 text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 u-border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
}

const checkbox = {
  base: `${radio.base} rounded`
}

const toggle = {
  base: 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
  active: 'bg-gray-800'
}

export default defu({
  badge,
  button,
  input,
  textarea,
  select,
  radio,
  checkbox,
  toggle
}, preset)
