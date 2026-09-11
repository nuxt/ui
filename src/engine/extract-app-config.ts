import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { createJiti } from 'jiti'

const defineAppConfigPrelude = 'const defineAppConfig = (config) => config\n'

function uiFromModule(mod: unknown): Record<string, unknown> | null {
  const config = (mod as { default?: unknown })?.default ?? mod
  if (!config || typeof config !== 'object') return null
  const ui = (config as { ui?: unknown }).ui
  if (!ui || typeof ui !== 'object' || Array.isArray(ui)) return null
  return ui as Record<string, unknown>
}

export async function extractUiFromAppConfigFile(file: string): Promise<Record<string, unknown> | null> {
  try {
    const jiti = createJiti(pathToFileURL(file).href)
    try {
      const imported = await jiti.import(file)
      const fromFile = uiFromModule(imported)
      if (fromFile) return fromFile
    } catch {
      // `defineAppConfig` is a Nuxt auto-import; evaluate with a local identity.
    }

    return uiFromModule(jiti.evalModule(
      `${defineAppConfigPrelude}${readFileSync(file, 'utf8')}`,
      { filename: file }
    ))
  } catch {
    return null
  }
}
