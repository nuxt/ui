import { fileURLToPath } from 'url'
import { resolve } from 'pathe'

export const distDir = resolve(typeof __dirname === 'undefined' ? fileURLToPath(import.meta.url) : __dirname)

const _makeResolve = (base: string) => {
  return (...p: string[]) => resolve(base, ...p)
}

export const presetsDir = resolve(distDir, 'presets')
export const resolvePresetsDir = _makeResolve(presetsDir)
