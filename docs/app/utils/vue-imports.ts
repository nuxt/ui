const AUTO_IMPORTS: Record<string, string[]> = {
  'vue': [
    'ref',
    'shallowRef',
    'computed',
    'reactive',
    'watch',
    'watchEffect',
    'onMounted',
    'onUnmounted',
    'onBeforeMount',
    'onBeforeUnmount',
    'nextTick',
    'toRef',
    'toRefs',
    'h',
    'resolveComponent',
    'useTemplateRef',
    'provide',
    'inject',
    'defineModel',
    'useId'
  ],
  '@vueuse/core': [
    'useColorMode',
    'useLocalStorage',
    'useElementSize',
    'useClipboard',
    'useTimeAgo',
    'useInfiniteScroll',
    'useMediaQuery',
    'useDebounceFn',
    'refDebounced',
    'createReusableTemplate'
  ]
}

/**
 * Scans SFC source code for auto-imported API usage and injects missing import statements.
 * Handles both Vue core APIs and VueUse composables.
 */
export function addVueImports(code: string): string {
  const scriptMatch = code.match(/<script\s+setup[^>]*>([\s\S]*?)<\/script>/)
  if (!scriptMatch) return code

  const scriptContent = scriptMatch[1]!

  const existingImports = new Map<string, Set<string>>()
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g
  let m: RegExpExecArray | null
  while ((m = importRegex.exec(scriptContent)) !== null) {
    const names = new Set(m[1]!.split(',').map(s => s.trim()))
    const source = m[2]!
    if (existingImports.has(source)) {
      for (const name of names) existingImports.get(source)!.add(name)
    } else {
      existingImports.set(source, names)
    }
  }

  const newImports: { source: string, names: string[] }[] = []

  for (const [source, apis] of Object.entries(AUTO_IMPORTS)) {
    const alreadyImported = existingImports.get(source) ?? new Set()
    const needed: string[] = []

    for (const api of apis) {
      if (alreadyImported.has(api)) continue

      const pattern = new RegExp(`\\b${api}\\b(?!\\s*:)`)
      if (pattern.test(scriptContent)) {
        needed.push(api)
      }
    }

    if (!needed.length) continue

    if (alreadyImported.size) {
      const merged = [...alreadyImported, ...needed]
      const mergedImport = `import { ${merged.join(', ')} } from '${source}'`
      const existingPattern = new RegExp(`import\\s+\\{[^}]+\\}\\s+from\\s+['"]${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`)
      code = code.replace(existingPattern, mergedImport)
    } else {
      newImports.push({ source, names: needed })
    }
  }

  if (newImports.length) {
    const statements = newImports.map(({ source, names }) => `import { ${names.join(', ')} } from '${source}'`).join('\n')
    const hasExistingImports = /^\s*import\s/.test(scriptContent)
    const separator = hasExistingImports ? '\n' : '\n\n'
    code = code.replace(/(<script\s+setup[^>]*>\n?)/, `$1${statements}${separator}`)
  }

  return code
}
