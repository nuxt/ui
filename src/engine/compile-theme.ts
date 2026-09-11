import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'pathe'
import type { PluginItem } from '@babel/core'

const scalarSlots = new Set([
  'avatarSize',
  'itemLeadingAvatarSize',
  'itemLeadingChipSize',
  'itemTrailingKbdsSize',
  'kbdsSize',
  'leadingAvatarSize',
  'linkLeadingAvatarSize',
  'linkLeadingChipSize',
  'linkTrailingBadgeSize',
  'trailingBadgeSize'
])

const skipKeys = new Set(['color', 'variant', 'size', 'orientation', 'side', 'align', 'position'])

type Leaf = { id: string, classes: string, path: Array<string | number> }

const stylexRules: unknown[] = []
const nativeCssChunks: string[] = []
const hashProps = new Map<string, string[]>()
const classCache = new Map<string, string>()
let oraclePromise: Promise<any> | undefined
let compileQueue: Promise<void> = Promise.resolve()
let runtimeCssPromise: Promise<string> | undefined
let compiledCssCache: string | undefined
let queuedLeaves: Leaf[] = []
let queuedWaiters: Array<{ resolve: () => void, reject: (error: unknown) => void }> = []
let scheduledFlush: Promise<void> | undefined

const BABEL_CHUNK = 400
const uiConfigSkip = new Set(['colors', 'icons', 'prefix', 'tv', 'engine'])

// Literal class names still emitted at runtime via `prefix(...)` in SFCs.
// StyleX does not hash these, so the oracle CSS must keep the original selectors.
const runtimeUtilityTokens = [
  'hidden',
  'dark:hidden',
  'dark:inline-block',
  'dark:block',
  'lg:hidden',
  'lg:flex',
  'sm:block',
  'focus:outline-none',
  'absolute',
  'inset-0'
]

function atlasKeysFromLtr(classname: string, ltr: string) {
  if (!ltr || ltr.includes('@property')) return []
  const rules = [...ltr.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
  const last = rules.at(-1)
  if (!last || last.index == null) return []
  const selector = last[1]!.trim()
  const decls = last[2]!
  const escaped = classname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const remainder = selector.replace(new RegExp(`\\.${escaped}`, 'g'), '').replace(/\s+/g, '')
  const prefix = ltr.slice(0, last.index).replace(/[{}]/g, '').trim()
  const props = [...decls.matchAll(/(?:^|;)\s*([\w-]+):/g)]
    .map(match => match[1]!)
    .filter(prop => prop !== 'syntax' && prop !== 'inherits' && prop !== 'initial-value')
  return props.map(prop => `${prefix}${remainder}|${prop}`)
}

function recordAtlas(rules: any[]) {
  for (const rule of rules) {
    const classname = rule?.[0]
    const ltr = rule?.[1]?.ltr
    if (typeof classname !== 'string' || typeof ltr !== 'string') continue
    const keys = atlasKeysFromLtr(classname, ltr)
    if (!keys.length) continue
    hashProps.set(classname, [...new Set([...(hashProps.get(classname) ?? []), ...keys])])
  }
}

function isSizeValue(value: string) {
  return /^(?:[23]x[sl]|xs|sm|md|lg|xl)$/.test(value.trim())
}

function collect(value: unknown, path: Array<string | number>, leaves: Leaf[], context: string[] = []) {
  if (typeof value === 'string') {
    const key = String(path[path.length - 1] ?? '')
    if (!value || scalarSlots.has(key) || (key.endsWith('Size') && isSizeValue(value))) return
    if (context.includes('defaultVariants')) return
    const compound = context.includes('compoundVariants') || context.includes('compoundSlots')
    const underClass = context.includes('class') || context.includes('className')
    if (compound && key !== 'class' && key !== 'className' && !underClass) return
    if (skipKeys.has(key) && !compound && !underClass) return
    leaves.push({ id: `l${leaves.length}_${createHash('sha256').update(value).digest('hex').slice(0, 8)}`, classes: value, path })
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, [...path, index], leaves, context))
    return
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      collect(item, [...path, key], leaves, [...context, key])
    }
  }
}

function setPath(target: any, path: Array<string | number>, next: string) {
  let current = target
  for (let i = 0; i < path.length - 1; i++) current = current[path[i]!]
  current[path[path.length - 1]!] = next
}

function classNamesFromCompiled(style: Record<string, unknown>): string {
  const names: string[] = []
  function walk(node: unknown) {
    if (!node || typeof node !== 'object') return
    for (const [key, item] of Object.entries(node as Record<string, unknown>)) {
      if (key === '$$css') continue
      if (typeof item === 'string') names.push(item)
      else walk(item)
    }
  }
  walk(style)
  return names.join(' ')
}

function findUiRoot() {
  let dir = dirname(fileURLToPath(import.meta.url))
  while (true) {
    const pkgFile = join(dir, 'package.json')
    if (existsSync(pkgFile)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'))
        if (pkg.name === '@nuxt/ui') return dir
      } catch {
        // keep walking
      }
    }
    const parent = dirname(dir)
    if (parent === dir) throw new Error('Cannot resolve @nuxt/ui package root')
    dir = parent
  }
}

function resolveEngineDir() {
  const here = dirname(fileURLToPath(import.meta.url))
  const root = findUiRoot()
  const candidates = [
    here,
    join(root, 'src/engine'),
    join(root, 'dist/engine')
  ]
  for (const dir of candidates) {
    if (existsSync(join(dir, 'oracle.css')) && existsSync(join(dir, 'convert.mjs'))) return dir
  }
  throw new Error('Cannot find StyleX oracle.css')
}

function evalCompiledModule(code: string) {
  const cjs = code
    .replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"][^'"]+['"];?/g, 'const $1 = {};')
    .replace(/import\s+(\w+)\s+from\s+['"][^'"]+['"];?/g, 'const $1 = {};')
    .replace(/export\s+const\s+(\w+)\s*=/g, 'exports.$1 =')
    .replace(/export\s+\{([^}]+)\}/g, (_, names: string) => names.split(',').map((part) => {
      const [local, exported] = part.trim().split(/\s+as\s+/).map(name => name.trim())
      return `exports.${exported || local} = ${local};`
    }).join('\n'))
  const module = { exports: {} as { styles?: Record<string, Record<string, unknown>>, nativeClasses?: Record<string, string[]> } }
  new Function('exports', 'module', cjs)(module.exports, module)
  return module.exports
}

async function getOracle() {
  if (!oraclePromise) {
    oraclePromise = (async () => {
      const engineDir = resolveEngineDir()
      const { createOracle } = await import(pathToFileURL(join(engineDir, 'convert.mjs')).href)
      return createOracle({
        appRoot: findUiRoot(),
        cssPath: join(engineDir, 'oracle.css')
      })
    })()
  }
  return oraclePromise
}

async function takeRuntimeCss() {
  if (!runtimeCssPromise) {
    runtimeCssPromise = (async () => {
      const oracle = await getOracle()
      const chunks = oracle.context.designSystem.candidatesToCss(runtimeUtilityTokens)
      return chunks.filter(Boolean).join('\n').replace(/--tw-/g, '--ui-style-')
    })()
  }
  return runtimeCssPromise
}

export function takeStylexAtlas() {
  return Object.fromEntries(hashProps)
}

function mediaMinPx(node: { type: string, name?: string, params?: string }) {
  if (node.type !== 'atrule' || node.name !== 'media' || !node.params) return null
  const match = node.params.match(/width\s*>=\s*(\d+(?:\.\d+)?)(rem|px|em)?/)
    || node.params.match(/min-width:\s*(\d+(?:\.\d+)?)(rem|px|em)?/)
  if (!match) return null
  const n = Number.parseFloat(match[1]!)
  const unit = match[2] || 'px'
  return n * (unit === 'rem' || unit === 'em' ? 16 : 1)
}

async function sortMinWidthMedia(css: string) {
  const oracle = await getOracle()
  const root = oracle.context.postcss.parse(css)

  function sortIn(parent: { nodes?: any[], append: (node: any) => void }) {
    if (!parent.nodes?.length) return
    for (const node of parent.nodes) sortIn(node)
    const extracted: any[] = []
    for (const node of [...parent.nodes]) {
      if (mediaMinPx(node) == null) continue
      extracted.push(node)
      node.remove()
    }
    if (extracted.length < 2) {
      for (const node of extracted) parent.append(node)
      return
    }
    extracted.sort((a, b) => (mediaMinPx(a) ?? 0) - (mediaMinPx(b) ?? 0))
    for (const node of extracted) parent.append(node)
  }

  sortIn(root)
  return root.toString()
}

export async function takeCompiledCss() {
  if (compiledCssCache) return compiledCssCache
  const stylexPlugin = (await import('@stylexjs/babel-plugin')).default
  const stylexCss = stylexRules.length
    ? stylexPlugin.processStylexRules(stylexRules as any, true)
    : ''
  const css = [stylexCss, ...nativeCssChunks, await takeRuntimeCss()].filter(Boolean).join('\n')
  compiledCssCache = await sortMinWidthMedia(css)
  return compiledCssCache
}

function stableLeafId(classes: string) {
  return `c${createHash('sha256').update(classes).digest('hex').slice(0, 16)}`
}

function markCssDirty() {
  compiledCssCache = undefined
}

async function compilePending(prefix: string, pending: Leaf[]) {
  if (!pending.length) return
  const oracle = await getOracle()
  const result = await oracle.convertLeaves(pending.map(leaf => ({ id: leaf.id, classes: leaf.classes })))
  const { emitStylexModule } = await import(pathToFileURL(join(resolveEngineDir(), 'convert.mjs')).href)
  const babel = await import('@babel/core')
  const stylexPlugin = (await import('@stylexjs/babel-plugin')).default
  const plugin = [stylexPlugin, { dev: false, runtimeInjection: false, styleResolution: 'application-order' }]

  for (let index = 0; index < result.leaves.length; index += BABEL_CHUNK) {
    const chunk = result.leaves.slice(index, index + BABEL_CHUNK)
    const source = emitStylexModule(chunk, { typescript: false })
    const transformed = babel.transformSync(source, {
      filename: `${prefix}-${index}.stylex.js`,
      babelrc: false,
      configFile: false,
      plugins: [plugin as PluginItem]
    })
    if (!transformed?.code) throw new Error(`StyleX compilation failed for ${prefix}`)
    const exports = evalCompiledModule(transformed.code)
    const styles = exports.styles ?? {}
    const nativeClasses = exports.nativeClasses ?? {}
    const rules = transformed.metadata?.stylex ?? []
    if (rules.length) {
      stylexRules.push(...rules)
      recordAtlas(rules)
    }
    for (const leaf of chunk) {
      const compiled = classNamesFromCompiled(styles[leaf.id] ?? {})
      const semantic = (nativeClasses[leaf.id] ?? (leaf as { semanticClasses?: string[] }).semanticClasses ?? []).join(' ')
      classCache.set(leaf.classes, [compiled, semantic].filter(Boolean).join(' '))
    }
  }

  const extras = [result.nativeCss, result.supportCss, result.keyframesCss].filter(Boolean).join('\n')
  if (extras) nativeCssChunks.push(extras)
  markCssDirty()
}

async function flushQueuedLeaves() {
  const waiters = queuedWaiters
  const leaves = queuedLeaves
  queuedWaiters = []
  queuedLeaves = []
  scheduledFlush = undefined
  try {
    const unique: Leaf[] = []
    const seen = new Set<string>()
    for (const leaf of leaves) {
      if (classCache.has(leaf.classes) || seen.has(leaf.classes)) continue
      seen.add(leaf.classes)
      unique.push({ ...leaf, id: stableLeafId(leaf.classes) })
    }
    if (unique.length) {
      const run = compileQueue.then(() => compilePending('batch', unique))
      compileQueue = run.then(() => {}, () => {})
      await run
    }
    for (const waiter of waiters) waiter.resolve()
  } catch (error) {
    for (const waiter of waiters) waiter.reject(error)
  }
}

function enqueueLeaves(leaves: Leaf[]) {
  queuedLeaves.push(...leaves)
  const waiter = new Promise<void>((resolve, reject) => {
    queuedWaiters.push({ resolve, reject })
  })
  scheduledFlush ??= Promise.resolve().then(flushQueuedLeaves)
  return waiter
}

export async function compileThemeLeaves(themes: Array<{ value: unknown, prefix: string }>) {
  const pending: Leaf[] = []
  for (const { value, prefix } of themes) {
    const leaves: Leaf[] = []
    collect(value, [prefix], leaves)
    for (const leaf of leaves) {
      if (!classCache.has(leaf.classes)) pending.push(leaf)
    }
  }
  if (!pending.length) return
  await enqueueLeaves(pending)
}

function applyCachedClasses<T>(theme: T, prefix: string): T {
  const leaves: Leaf[] = []
  collect(theme, [prefix], leaves)
  const next = structuredClone(theme)
  for (const leaf of leaves) setPath(next, leaf.path.slice(1), classCache.get(leaf.classes) ?? '')
  return next
}

export async function compileThemeClasses<T>(theme: T, prefix: string): Promise<T> {
  await compileThemeLeaves([{ value: theme, prefix }])
  return applyCachedClasses(theme, prefix)
}

export async function compileUiConfigLeaves(ui?: Record<string, any>) {
  if (!ui) return
  await compileThemeLeaves(
    Object.entries(ui)
      .filter(([key, value]) => !uiConfigSkip.has(key) && value && typeof value === 'object')
      .map(([key, value]) => ({ value, prefix: `appConfig_${key}` }))
  )
}

export async function compileUiConfig<T extends Record<string, any>>(ui: T): Promise<T> {
  if (!ui) return ui
  await compileUiConfigLeaves(ui)
  const next: Record<string, any> = { ...ui }
  for (const [key, value] of Object.entries(ui)) {
    if (uiConfigSkip.has(key) || !value || typeof value !== 'object') continue
    next[key] = applyCachedClasses(value, `appConfig_${key}`)
  }
  return next as T
}
