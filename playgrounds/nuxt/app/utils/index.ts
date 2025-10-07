import { splitByCase, upperFirst } from 'scule'

export function upperName(name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}
