import { fileURLToPath } from 'url'
import { resolve } from 'pathe'

export const distDir = resolve(typeof __dirname === 'undefined' ? fileURLToPath(import.meta.url) : __dirname)

const _makeResolve = (base: string) => {
  return (...p: string[]) => resolve(base, ...p)
}

export const runtimeDir = resolve(distDir, 'runtime')
export const resolveRuntimeDir = _makeResolve(runtimeDir)

export const componentsDir = resolve(distDir, 'components')
export const resolveComponentsDir = _makeResolve(componentsDir)
