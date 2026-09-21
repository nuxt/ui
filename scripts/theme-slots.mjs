// Classes in a theme's `variants` and `compoundVariants` are given per slot,
// `{ base: 'px-2' }`, never as a bare string or array: the engine ignores those.
// `v4` still writes them bare, where they meant the `base` slot, so this wraps
// what a sync brings back. Running it again is a no-op.
//
//   node scripts/theme-slots.mjs           rewrite in place
//   node scripts/theme-slots.mjs --check   list what would change, exit 1 if any
//
// A theme with a top-level `base` and no `slots` is a new single-element
// component: convert it by hand along with its `ui(...)` call site, the
// type-check points at it.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { glob } from 'node:fs/promises'
import ts from 'typescript'

const name = node => node.name?.getText()

/** A class value that names no slot: a non-empty string, a template or an array. */
function isBare(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text.trim() !== ''
  }
  return ts.isTemplateExpression(node) || ts.isArrayLiteralExpression(node)
}

function find(node, test) {
  let found
  const visit = (child) => {
    if (!found) {
      found = test(child) ? child : undefined
      if (!found) {
        ts.forEachChild(child, visit)
      }
    }
  }
  visit(node)
  return found
}

/**
 * The slot a bare class stood for. It was always `base`, which the layout
 * containers have since renamed to `root`. A theme that declares neither extends
 * one that has a `base` (Textarea over Input).
 */
function slotOf(file) {
  const slots = find(file, node => ts.isPropertyAssignment(node) && name(node) === 'slots' && ts.isObjectLiteralExpression(node.initializer))
  const keys = slots?.initializer.properties.map(name) ?? []
  return !keys.includes('base') && keys.includes('root') ? 'root' : 'base'
}

export function transform(source, filename) {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true)
  const bare = []

  const value = (node) => {
    if (isBare(node)) {
      bare.push(node)
    }
  }
  // `Object.fromEntries(colors.map(color => [color, VALUE]))`
  const entries = (node) => {
    if (ts.isArrayLiteralExpression(node) && node.elements.length === 2 && ts.isArrowFunction(ts.isParenthesizedExpression(node.parent) ? node.parent.parent : node.parent)) {
      value(node.elements[1])
      return
    }
    ts.forEachChild(node, entries)
  }
  const compounds = (node) => {
    if (ts.isPropertyAssignment(node) && name(node) === 'class') {
      value(node.initializer)
      return
    }
    ts.forEachChild(node, compounds)
  }

  const visit = (node) => {
    if (ts.isPropertyAssignment(node) && name(node) === 'variants' && ts.isObjectLiteralExpression(node.initializer)) {
      for (const group of node.initializer.properties) {
        if (!ts.isPropertyAssignment(group) || !ts.isObjectLiteralExpression(group.initializer)) {
          continue
        }
        for (const property of group.initializer.properties) {
          if (ts.isPropertyAssignment(property)) {
            value(property.initializer)
          } else if (ts.isSpreadAssignment(property)) {
            entries(property.expression)
          }
        }
      }
      return
    }
    if (ts.isPropertyAssignment(node) && name(node) === 'compoundVariants') {
      compounds(node.initializer)
      return
    }
    ts.forEachChild(node, visit)
  }
  visit(file)

  const slot = slotOf(file)
  const edits = bare.map(node => ({
    start: node.getStart(file),
    end: node.getEnd(),
    line: file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1
  }))

  let code = source
  for (const edit of edits.toSorted((a, b) => b.start - a.start)) {
    code = `${code.slice(0, edit.start)}{ ${slot}: ${code.slice(edit.start, edit.end)} }${code.slice(edit.end)}`
  }
  return { code, edits, slot }
}

// Also imported by `test/utils/theme-slots.spec.ts`, which only needs `transform`.
if (import.meta.url.startsWith('file:') && process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const check = process.argv.includes('--check')

  let total = 0
  for await (const filename of glob('src/theme/**/*.ts', { cwd: root })) {
    const { code, edits, slot } = transform(readFileSync(root + filename, 'utf8'), filename)
    total += edits.length
    if (check) {
      for (const edit of edits) {
        console.log(`${filename}:${edit.line} -> { ${slot}: ... }`)
      }
    } else if (edits.length) {
      writeFileSync(root + filename, code)
    }
  }

  console.log(`\n${total} bare class${total === 1 ? '' : 'es'} ${check ? 'to wrap' : 'wrapped'}`)
  if (check && total) {
    process.exit(1)
  }
}
