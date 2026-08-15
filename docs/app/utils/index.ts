import { splitByCase, upperFirst } from 'scule'

export function upperName(name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
