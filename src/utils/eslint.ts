// The options of `@nuxt/ui/eslint`, apart from it so the module's types don't import `eslint`

export type Severity = 'off' | 'warn' | 'error'

export interface NuxtUIESLintOptions {
  /**
   * The stylesheet that imports `tailwindcss` and `@nuxt/ui`, so the classes
   * it adds (semantic tokens, color aliases, your own `@theme`) are known.
   */
  entryPoint: string
  /**
   * The files to lint.
   * @defaultValue ['**\/*.vue', '**\/*.{js,mjs,ts,mts,jsx,tsx}']
   */
  files?: string[]
  /**
   * The palette each color alias points at, `{ error: 'red' }`, on top of the defaults.
   * The Nuxt module reads them from the `ui.colors` of your `app.config.ts`.
   */
  colors?: Record<string, string>
  /**
   * Classes `no-unknown-classes` leaves alone, as regular expressions.
   */
  ignore?: string[]
  rules?: {
    /**
     * Classes the stylesheet doesn't generate. Off by default: classes styled in
     * `<style>` blocks or your own CSS are unknown too, list them in `ignore`.
     * @defaultValue 'off'
     */
    'no-unknown-classes'?: Severity
    /** Raw palette colors (`text-gray-500`) and hardcoded colors (`bg-[#000]`). */
    'no-palette-colors'?: Severity
    /** Classes that set the same property in the same list (`p-2 p-4`), where the stylesheet order decides which wins. */
    'no-conflicting-classes'?: Severity
    /**
     * Physical classes on the inline axis (`ml-2`, `left-0`, `text-left`), for apps that support RTL.
     * @defaultValue 'off'
     */
    'enforce-logical-properties'?: Severity
  }
}

/**
 * The `ui.colors` written in an `app.config.ts`, `{ primary: 'blue' }`. The file is
 * only evaluated at runtime, so a value that isn't a string literal is left out.
 */
export function readAppConfigColors(code: string): Record<string, string> {
  const block = code.replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '').match(/\bcolors\s*:\s*\{([^{}]*)\}/)?.[1]
  const colors: Record<string, string> = {}
  for (const [, alias, palette] of block?.matchAll(/([\w-]+)\s*:\s*["'`]([a-z]+)["'`]/g) ?? []) {
    colors[alias!] = palette!
  }
  return colors
}
