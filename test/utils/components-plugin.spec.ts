import { describe, it, expect, vi } from 'vitest'
import { join } from 'pathe'
import ComponentImportPlugin from '../../src/plugins/components'

const runtimeDir = join(process.cwd(), 'src/runtime')

// `src/unplugin` resolves `runtimeDir` from `import.meta.url`, which is not a file url under happy-dom.
vi.mock('../../src/unplugin', () => ({ runtimeDir: join(process.cwd(), 'src/runtime') }))

function resolveId(id: string, importer?: string, options: Record<string, any> = {}) {
  const [plugin] = ComponentImportPlugin({ prefix: 'U', components: false, ...options } as any, { framework: 'vite' } as any)
  return (plugin!.resolveId as any).call({}, id, importer)
}

describe('nuxt:ui:components', () => {
  it('overrides relative imports inside the runtime', () => {
    expect(resolveId('./Icon.vue', join(runtimeDir, 'components/Button.vue'))).toBe(join(runtimeDir, 'vue/components/Icon.vue'))
  })

  it('overrides explicit package imports', () => {
    expect(resolveId('@nuxt/ui/components/Icon.vue', '/app/src/App.tsx')).toBe(join(runtimeDir, 'vue/components/Icon.vue'))
    expect(resolveId('@nuxt/ui/runtime/components/Link.vue', '/app/src/App.tsx')).toBe(join(runtimeDir, 'vue/overrides/vue-router/Link.vue'))
    expect(resolveId('@nuxt/ui/components/color-mode/ColorModeSwitch.vue', '/app/src/App.tsx', { colorMode: true })).toBe(join(runtimeDir, 'vue/components/color-mode/ColorModeSwitch.vue'))
  })

  it('overrides absolute path imports', () => {
    expect(resolveId(join(runtimeDir, 'components/Icon.vue'), '/app/src/App.tsx')).toBe(join(runtimeDir, 'vue/components/Icon.vue'))
    expect(resolveId('/app/node_modules/@nuxt/ui/dist/runtime/components/Icon.vue', '/app/src/App.tsx')).toBe(join(runtimeDir, 'vue/components/Icon.vue'))
    expect(resolveId('C:\\app\\node_modules\\@nuxt\\ui\\dist\\runtime\\components\\Link.vue', 'C:/app/src/App.tsx')).toBe(join(runtimeDir, 'vue/overrides/vue-router/Link.vue'))
    expect(resolveId(join(runtimeDir, 'components/Button.vue'), '/app/src/App.tsx')).toBeUndefined()
  })

  it('leaves other package imports alone', () => {
    expect(resolveId('@nuxt/ui/components/Button.vue', '/app/src/App.tsx')).toBeUndefined()
    expect(resolveId('@nuxt/ui/components/prose/Icon.vue', '/app/src/App.tsx')).toBeUndefined()
  })
})
