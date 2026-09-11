// Build-time Tailwind oracle → StyleX. Not a runtime import for components.
import { createHash } from 'node:crypto'
import { createOracleContext } from './oracle-loader.mjs'

const semanticDefault = token => /^(?:group|peer)(?:\/[\w-]+)?$/.test(token) || ['rn-mount', 'rn-semantic', 'ui-rolling-number'].includes(token)
const renameVars = text => text.replace(/--tw-([\w-]+)/g, '--ui-style-$1')
const camel = property => property.startsWith('--') ? renameVars(property) : property.replace(/^-(webkit|moz|ms|o)-/, (_, prefix) => `${prefix === 'ms' ? 'ms' : prefix[0].toUpperCase() + prefix.slice(1)}-`).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

function parts(value, separator = ' ') {
  let depth = 0, quote = '', escape = false, start = 0
  const result = []
  for (let i = 0; i < value.length; i++) {
    const ch = value[i]
    if (escape) { escape = false; continue }
    if (ch === '\\') { escape = true; continue }
    if (quote) { if (ch === quote) quote = ''; continue }
    if (ch === '"' || ch === "'") { quote = ch; continue }
    if (ch === '(' || ch === '[') depth++
    if (ch === ')' || ch === ']') depth--
    if (depth === 0 && (separator === ' ' ? /\s/.test(ch) : ch === separator)) {
      if (value.slice(start, i).trim()) result.push(value.slice(start, i).trim())
      start = i + 1
    }
  }
  if (value.slice(start).trim()) result.push(value.slice(start).trim())
  return result
}

function quad(values) { return [values[0], values[1] ?? values[0], values[2] ?? values[0], values[3] ?? values[1] ?? values[0]] }
export function normalizeDeclaration(property, value) {
  const tokens = parts(value)
  const sides = ['top', 'right', 'bottom', 'left']
  const four = new Set(['margin', 'padding', 'scroll-margin', 'scroll-padding', 'inset', 'border-width', 'border-style', 'border-color'])
  if (four.has(property) && tokens.length <= 4) {
    return quad(tokens).map((v, i) => [camel(property === 'inset' ? sides[i] : property.startsWith('border-') ? `border-${sides[i]}-${property.slice(7)}` : `${property}-${sides[i]}`), renameVars(v)])
  }
  // All box aliases share physical longhand keys. StyleX application-order
  // otherwise erases a physical default when a logical alias appears only in
  // a media condition. Keep RTL exact; vertical writing modes are rejected.
  const sideName = (prefix, side, suffix) => camel(`${prefix === 'inset' ? '' : prefix + '-'}${side}${suffix ? '-' + suffix : ''}`)
  const two = /^(margin|padding|scroll-margin|scroll-padding|inset|border)-(inline|block)(?:-(width|style|color))?$/.exec(property)
  if (two && tokens.length <= 2) {
    const values = [renameVars(tokens[0]), renameVars(tokens[1] ?? tokens[0])]
    if (two[2] === 'block') return ['top', 'bottom'].map((side, i) => [sideName(two[1], side, two[3]), values[i]])
    if (values[0] === values[1]) return ['left', 'right'].map(side => [sideName(two[1], side, two[3]), values[0]])
    return ['ltr', 'rtl'].flatMap(dir => ['left', 'right'].map((side, i) => [sideName(two[1], side, two[3]), values[dir === 'ltr' ? i : 1 - i], [`:dir(${dir})`]]))
  }
  const logicalSide = /^(margin|padding|scroll-margin|scroll-padding|inset|border)-(inline|block)-(start|end)(?:-(width|style|color))?$/.exec(property)
  if (logicalSide) {
    const [, prefix, axis, position, suffix] = logicalSide
    if (axis === 'block') return [[sideName(prefix, position === 'start' ? 'top' : 'bottom', suffix), renameVars(value)]]
    return ['ltr', 'rtl'].map(dir => [sideName(prefix, (position === 'start') === (dir === 'ltr') ? 'left' : 'right', suffix), renameVars(value), [`:dir(${dir})`]])
  }
  const logicalCorner = /^border-(start|end)-(start|end)-radius$/.exec(property)
  if (logicalCorner) return ['ltr', 'rtl'].map(dir => [`border${logicalCorner[1] === 'start' ? 'Top' : 'Bottom'}${(logicalCorner[2] === 'start') === (dir === 'ltr') ? 'Left' : 'Right'}Radius`, renameVars(value), [`:dir(${dir})`]])
  if (property === 'gap' && tokens.length <= 2) return [['rowGap', renameVars(tokens[0])], ['columnGap', renameVars(tokens[1] ?? tokens[0])]]
  if (property === 'overflow' && tokens.length <= 2) return [['overflowX', renameVars(tokens[0])], ['overflowY', renameVars(tokens[1] ?? tokens[0])]]
  if (property === 'border-radius') {
    const [horizontal, vertical = horizontal] = parts(value, '/')
    if (horizontal && parts(horizontal).length <= 4 && parts(vertical).length <= 4) {
      const x = quad(parts(horizontal)), y = quad(parts(vertical))
      return ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map((corner, i) => [`border${corner}Radius`, renameVars(x[i] === y[i] ? x[i] : `${x[i]} ${y[i]}`)])
    }
  }
  return [[camel(property), renameVars(value)]]
}

function combineSelectors(parser, parents, selector) {
  const children = parser().astSync(selector).nodes
  if (!parents.length) return children.map(node => node.toString())
  const results = []
  for (const parent of parents) for (const original of children) {
    const child = original.clone(), parentAst = parser().astSync(parent).nodes[0]
    let replaced = false
    child.walkNesting(node => { replaced = true; node.replaceWith(...parentAst.nodes.map(n => n.clone())) })
    results.push(replaced ? child.toString() : `${parent} ${child}`)
  }
  return results
}

function collectRules(tree, parser) {
  const events = []
  function walk(container, selectors = [], conditions = []) {
    for (const node of container.nodes ?? []) {
      if (node.type === 'decl' && selectors.length) events.push({ selectors, conditions, property: node.prop, value: node.value, important: node.important, raw: node.toString() })
      else if (node.type === 'rule') walk(node, combineSelectors(parser, selectors, node.selector), conditions)
      else if (node.type === 'atrule' && node.nodes && !['property', 'keyframes', '-webkit-keyframes'].includes(node.name)) walk(node, selectors, [...conditions, { name: node.name, params: node.params }])
    }
  }
  walk(tree)
  return events
}

function nativeSelector(parser, selector, anchor) {
  const ast = parser().astSync(selector).nodes[0]
  const matches = ast.nodes.filter(node => node.type === 'class' && node.value === anchor)
  if (matches.length !== 1) return { reason: 'non-self-selector' }
  matches[0].remove()
  if (ast.nodes.some(node => node.type === 'combinator')) return { reason: 'descendant-or-sibling-selector' }
  let reason, pseudoElement
  // A combinator inside :is/:where/:has still conditions the current element;
  // it does not change which element owns the declaration. Current StyleX
  // accepts these native nested conditions, including semantic marker classes.
  // Only top-level combinators above need an external descendant CSS contract.
  for (const node of ast.nodes) {
    if (node.type === 'pseudo' && node.value.startsWith('::')) {
      if (pseudoElement) reason ??= 'multiple-pseudo-elements'
      pseudoElement = node.toString()
      node.remove()
    } else if (!['pseudo', 'attribute', 'class', 'id', 'tag', 'universal', 'comment'].includes(node.type)) reason ??= 'unsupported-self-selector'
  }
  if (reason) return { reason }
  const condition = ast.toString().trim()
  // Wrap an ordinary compound self selector in :is(), a valid native StyleX
  // condition. Existing semantic classes/ids remain DOM contracts.
  return { pseudoElement, condition: condition ? (condition.startsWith(':') ? condition : `:is(${condition})`) : undefined }
}

function assignValue(object, property, conditions, value) {
  // Native condition-first StyleX authoring gives defaults and conditional
  // overrides independent compiler keys. Property-first {default:null,...}
  // groups them and removes the previous default when passed as an override.
  // This form is compiler- and browser-verified in StyleX 0.19 for all three
  // resolution modes; the product explicitly uses application-order.
  let current = object
  const rank = condition => condition.startsWith('@media') ? 0 : condition.startsWith('@supports') ? 1 : condition.startsWith('@container') ? 2 : 3
  const normalized = [...conditions].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
  for (const condition of normalized) current = (current[condition] ??= {})
  current[property] = value
}

function cssRule(selector, event) {
  let css = `${selector} { ${renameVars(event.raw)}; }`
  for (const at of [...event.conditions].reverse()) css = `@${at.name}${at.params ? ` ${at.params}` : ''} { ${css} }`
  return css
}

function contractName(id, classes) {
  const slug = String(id).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 65) || 'leaf'
  return `ui-style-${slug}-${createHash('sha256').update(classes).digest('hex').slice(0, 8)}`
}

export async function createOracle(options = {}) {
  if (options.writingMode && options.writingMode !== 'horizontal-tb') throw new Error('Box alias normalization currently requires horizontal-tb; vertical writing modes need an explicit conversion strategy.')
  const context = await createOracleContext(options)
  const parser = context.require('postcss-selector-parser')
  const semanticToken = options.isSemanticClass ?? semanticDefault
  async function convertLeaves(inputs) {
    if (!Array.isArray(inputs)) throw new TypeError('convertLeaves expects an array of { id, classes }')
    const ids = new Set()
    for (const input of inputs) {
      if (!input || typeof input.id !== 'string' || !input.id || ['__proto__', 'constructor', 'prototype'].includes(input.id)) throw new TypeError('Each style leaf needs a nonempty, safe string id')
      if (ids.has(input.id)) throw new Error(`Duplicate style leaf id: ${input.id}`)
      if (typeof input.classes !== 'string') throw new TypeError(`Style leaf ${input.id} must contain a literal string; expand factories/branches before conversion`)
      ids.add(input.id)
    }
    const tokenSet = new Set(inputs.flatMap(input => input.classes.trim().split(/\s+/).filter(Boolean)))
    const tokens = [...tokenSet], candidateCss = context.designSystem.candidatesToCss(tokens)
    const known = new Set(tokens.filter((token, i) => candidateCss[i]))
    const leaves = inputs.map((input, index) => {
      const parts = input.classes.trim().split(/\s+/).filter(Boolean)
      const unknown = parts.filter(token => !known.has(token) && !semanticToken(token))
      return { id: input.id, classes: input.classes, anchor: `ui-oracle-leaf-${index}`, contractClass: contractName(input.id, input.classes), semanticClasses: parts.filter(semanticToken), styleObject: {}, exceptions: [], diagnostics: unknown.map(token => ({ code: 'unknown-token', token, message: 'Exact oracle generates no CSS for this token; classify semantic/no-op or correct authoring explicitly.' })), stats: { oracleDeclarations: 0, nativeDeclarations: 0, exceptionDeclarations: 0 }, validTokens: parts.filter(token => known.has(token)) }
    })
    const rawCss = await context.compile(leaves.filter(leaf => leaf.validTokens.length).map(leaf => `.${leaf.anchor} { @apply ${leaf.validTokens.join(' ')}; }`).join('\n'))
    const tree = context.postcss.parse(rawCss)
    const byAnchor = new Map(leaves.map(leaf => [leaf.anchor, leaf]))
    const nativeCss = [], dependencies = new Set(), animationValues = []
    const events = collectRules(tree, parser)
    for (const event of events) for (const selector of event.selectors) {
      const anchors = [...selector.matchAll(/\.((?:ui-oracle-leaf-)\d+)\b/g)].map(match => match[1])
      for (const anchor of new Set(anchors)) {
        const leaf = byAnchor.get(anchor)
        if (!leaf) continue
        if (event.property === 'writing-mode' && event.value !== 'horizontal-tb') throw new Error(`Style leaf ${leaf.id} changes writing-mode to ${event.value}; horizontal box normalization cannot preserve it. Convert this context explicitly before continuing.`)
        leaf.stats.oracleDeclarations++
        const info = nativeSelector(parser, selector, anchor)
        const unsupportedAt = event.conditions.find(at => !['media', 'supports', 'container'].includes(at.name))
        // Current StyleX compiles animation shorthand natively. `all` is kept
        // explicit: the compiler accepted our probe but emitted no CSS for it.
        const unsupportedProperty = event.property === 'all'
        // CSS !important cannot be modeled as ordinary StyleX precedence.
        const reason = info.reason ?? (unsupportedAt ? `unsupported-at-rule:${unsupportedAt.name}` : undefined) ?? (unsupportedProperty ? `unsupported-shorthand:${event.property}` : undefined) ?? (event.important ? 'important-declaration' : undefined)
        for (const variable of renameVars(event.value).matchAll(/var\((--[\w-]+)/g)) dependencies.add(variable[1])
        if (/^animation(?:-|$)/.test(event.property)) animationValues.push(event.value)
        if (reason) {
          const outSelector = selector.replaceAll(`.${anchor}`, `.${leaf.contractClass}`)
          const css = cssRule(outSelector, event)
          leaf.exceptions.push({ reason, selector, conditions: event.conditions, property: event.property, value: renameVars(event.value), important: event.important, css })
          nativeCss.push(css)
          leaf.stats.exceptionDeclarations++
          continue
        }
        const target = info.pseudoElement ? (leaf.styleObject[info.pseudoElement] ??= {}) : leaf.styleObject
        const conditions = [...event.conditions.map(at => `@${at.name}${at.params ? ` ${at.params}` : ''}`), ...(info.condition ? [info.condition] : [])]
        for (const [property, value, directionConditions = []] of normalizeDeclaration(event.property, event.value)) assignValue(target, property, [...conditions, ...directionConditions], value)
        leaf.stats.nativeDeclarations++
      }
    }
    // Keep the exact typed, non-inheriting defaults for native composition
    // variables. Without these, a ring color can leak from parent to child and
    // optional shadow/filter terms can make the whole property invalid.
    const support = []
    for (const node of tree.nodes) {
      if (node.type === 'atrule' && node.name === 'property' && node.params.startsWith('--tw-')) support.push(renameVars(node.toString()))
      if (node.type === 'atrule' && node.name === 'layer' && node.params === 'properties') support.push(renameVars(node.toString()) + (node.nodes ? '' : ';'))
    }
    const definitions = new Map(), frames = new Map()
    tree.walkDecls(decl => {
      if (decl.prop.startsWith('--')) definitions.set(decl.prop, [...(definitions.get(decl.prop) ?? []), decl.value])
    })
    tree.walkAtRules(/^(?:-webkit-)?keyframes$/, rule => frames.set(rule.params.replace(/^['"]|['"]$/g, ''), rule.toString()))
    const expandedAnimationValues = new Set(animationValues), pending = [...animationValues]
    for (let index = 0; index < pending.length; index++) {
      for (const match of pending[index].matchAll(/var\((--[\w-]+)/g)) for (const value of definitions.get(match[1]) ?? []) {
        if (!expandedAnimationValues.has(value)) { expandedAnimationValues.add(value); pending.push(value) }
      }
    }
    const animationWords = new Set([...expandedAnimationValues].flatMap(value => value.match(/[\w-]+/g) ?? []))
    const requiredKeyframes = [...frames.keys()].filter(name => animationWords.has(name))
    const diagnostics = leaves.flatMap(leaf => leaf.diagnostics.map(diagnostic => ({ id: leaf.id, ...diagnostic })))
    for (const leaf of leaves) {
      if (leaf.exceptions.length) leaf.semanticClasses.push(leaf.contractClass)
      delete leaf.validTokens
      leaf.semanticClasses = [...new Set(leaf.semanticClasses)]
    }
    return { leaves, nativeCss: nativeCss.join('\n'), supportCss: support.join('\n'), keyframesCss: requiredKeyframes.map(name => frames.get(name)).join('\n'), requiredKeyframes, dependencies: [...dependencies].sort(), diagnostics, assumptions: { writingMode: 'horizontal-tb', direction: 'ltr and rtl supported', conditionForm: 'native condition-first', overrideSemantics: 'independent property/state keys with application-order; semantic native CSS conflicts still require review' }, oracleCss: rawCss, oracle: { version: '4.3.3', cssPath: context.cssPath }, stats: leaves.reduce((sum, leaf) => Object.fromEntries(Object.keys(sum).map(key => [key, sum[key] + leaf.stats[key]])), { oracleDeclarations: 0, nativeDeclarations: 0, exceptionDeclarations: 0 }) }
  }
  return { convertLeaves, convert: async (classes, { id = 'leaf' } = {}) => convertLeaves([{ id, classes }]), context }
}

export function emitStylexModule(leaves, { exportName = 'styles', importSource = '@stylexjs/stylex', typescript = true } = {}) {
  if (!/^[A-Za-z_$][\w$]*$/.test(exportName)) throw new Error('exportName must be a JS identifier')
  if (new Set(leaves.map(leaf => leaf.id)).size !== leaves.length) throw new Error('Cannot emit duplicate style leaf ids')
  const styles = Object.fromEntries(leaves.map(leaf => [leaf.id, leaf.styleObject]))
  const contracts = Object.fromEntries(leaves.filter(leaf => leaf.semanticClasses.length).map(leaf => [leaf.id, leaf.semanticClasses]))
  return `import * as stylex from ${JSON.stringify(importSource)}\n\nexport const ${exportName} = stylex.create(${JSON.stringify(styles, null, 2)})\n\nexport const nativeClasses = ${JSON.stringify(contracts, null, 2)}${typescript ? ' as const' : ''}\n`
}
