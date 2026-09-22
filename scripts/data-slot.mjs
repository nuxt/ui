// Namespaces every `data-slot` in `src/runtime/components` with its component:
// the outermost element says `data-slot="card"`, every other one
// `data-slot="card-header"`. The value is derived from the `ui.<slot>()` call
// on the same tag, never from the value already there, so running it again is
// a no-op and it can be replayed after a `v4` sync brings bare values back.
//
//   node scripts/data-slot.mjs           rewrite in place
//   node scripts/data-slot.mjs --check   list what would change, exit 1 if any
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parse } from 'vue/compiler-sfc'

const ELEMENT = 1
const ATTRIBUTE = 6
const DIRECTIVE = 7

// Our own `*Content` components label their root themselves, with the parent's
// namespace: `UContextMenuContent` renders `context-menu-content`.
const FORWARDED = new Set(['UContextMenuContent', 'UDropdownMenuContent'])

/** `#build/ui/prose/h1` -> `prose-h1`, `#build/ui/content/content-toc` -> `content-toc`. */
export function namespaceOf(source) {
  const path = source.match(/from '#build\/ui\/([\w/-]+)'/)?.[1]
  return path?.replace(/^content\//, '').replaceAll('/', '-')
}

/**
 * The slot a tag is styled by, read from its `:class="ui.<slot>(...)"`. A
 * binding that picks between two slots (`nested ? ui.itemWithChildren() :
 * ui.item()`) has no single answer: its marker has to mirror the condition.
 */
function slotsOf(element) {
  const bound = element.props.find(prop => prop.type === DIRECTIVE && prop.name === 'bind' && prop.arg?.content === 'class')
  const expression = bound?.exp?.content.trim() ?? ''
  // `ui.root({ class: [ui.base(...), props.class] })`: one call wraps the whole
  // binding, the slots merged inside it land on that same element.
  const outer = expression.match(/^ui(?:\.value)?\.(\w+)\(/)
  if (outer && closes(expression, outer[0].length - 1) === expression.length - 1) {
    return [outer[1]]
  }
  return [...new Set([...expression.matchAll(/\bui(?:\.value)?\.(\w+)\(/g)].map(match => match[1]))]
}

/** Index of the parenthesis closing the one at `open`. */
function closes(expression, open) {
  let depth = 0
  for (let index = open; index < expression.length; index++) {
    if (expression[index] === '(') {
      depth++
    } else if (expression[index] === ')' && --depth === 0) {
      return index
    }
  }
  return -1
}

/**
 * A marker the script can't write, a ternary or a computed, is still checked:
 * every value it can take has to be the component name or `<component>-<slot>`
 * for a slot the component renders. A bare identifier is looked up in the script.
 */
function strays(expression, source, valid) {
  const code = /^\w+$/.test(expression)
    ? source.match(new RegExp(`const ${expression} = computed\\(\\(\\) => ([\\s\\S]*?)\\)\\n`))?.[1] ?? ''
    : expression
  return [...code.matchAll(/'([^']*)'/g)].map(match => match[1]).filter(value => value !== 'data-slot' && !valid.has(value))
}

/**
 * The slot rendered outermost: `root` when the component has one, otherwise the
 * `base` that `props.class` lands on (Button, Select). Overlays have neither,
 * their content is teleported and keeps a prefixed name like any other part.
 */
function outermostSlot(template) {
  if (/\bui(?:\.value)?\.root\(/.test(template)) {
    return 'root'
  }
  return /\bui(?:\.value)?\.base\(\{[^}]*\bprops\.class\b/.test(template) ? 'base' : undefined
}

function* elements(node) {
  if (node.type === ELEMENT) {
    yield node
  }
  for (const child of node.children ?? []) {
    yield* elements(child)
  }
  // `v-if` / `v-for` wrap their element once the template is transformed, the
  // raw parse used here keeps them as plain children.
}

export function transform(source, file) {
  const namespace = namespaceOf(source)
  const { descriptor } = parse(source, { filename: file })
  const ast = descriptor.template?.ast
  if (!namespace || !ast) {
    return { code: source, edits: [], skipped: [] }
  }

  const outermost = outermostSlot(descriptor.template.content)
  const valueFor = slot => slot === outermost ? namespace : `${namespace}-${slot}`
  // Windows globs with `\\`
  const prose = file.replaceAll('\\', '/').includes('/prose/')
  const rendered = [...source.matchAll(/\bui(?:\.value)?\.(\w+)\(/g)].map(match => match[1])
  // `linkLeadingChipSize` sizes the child labelled `linkLeadingChip`, which has
  // no classes of its own
  const named = rendered.flatMap(slot => slot.endsWith('Size') ? [slot, slot.slice(0, -4)] : [slot])
  const valid = new Set([namespace, ...named.map(slot => `${namespace}-${slot}`)])
  const edits = []
  const skipped = []

  for (const element of elements(ast)) {
    const slots = slotsOf(element)
    const slot = slots.length === 1 ? slots[0] : undefined

    const literal = element.props.find(prop => prop.type === ATTRIBUTE && prop.name === 'data-slot')
    if (literal) {
      if (!slot) {
        if (!valid.has(literal.value?.content)) {
          skipped.push(`${file}:${literal.loc.start.line} data-slot="${literal.value?.content ?? ''}" is not \`${namespace}\` or \`${namespace}-<slot>\`, and its tag has no single ui.<slot>() to derive it from`)
        }
        continue
      }
      // `loc` spans the quotes
      edits.push({ start: literal.value.loc.start.offset + 1, end: literal.value.loc.end.offset - 1, value: valueFor(slot), line: literal.loc.start.line })
      continue
    }

    const bound = element.props.find(prop => prop.type === DIRECTIVE && prop.name === 'bind' && prop.arg?.content === 'data-slot')

    // A tag styled by a slot with no marker yet gets one. It goes before a
    // `v-bind="..."` spread so a caller's `data-slot` in `$attrs` still wins.
    // Prose stays bare: a marker on every `<p>` and `<li>` of a rendered
    // document is weight nobody selects on.
    if (!bound && slot && !prose && !FORWARDED.has(element.tag)) {
      const spread = element.props.find(prop => prop.type === DIRECTIVE && prop.name === 'bind' && !prop.arg)
      const klass = element.props.find(prop => prop.type === DIRECTIVE && prop.name === 'bind' && prop.arg?.content === 'class')
      const before = spread && spread.loc.start.offset < klass.loc.start.offset ? spread : klass
      // One attribute per line when the tag is already laid out that way.
      const indent = source.slice(source.lastIndexOf('\n', before.loc.start.offset) + 1, before.loc.start.offset)
      const separator = /^\s+$/.test(indent) ? `\n${indent}` : ' '
      edits.push({ start: before.loc.start.offset, end: before.loc.start.offset, value: `data-slot="${valueFor(slot)}"${separator}`, line: before.loc.start.line })
      continue
    }

    if (!bound && slots.length > 1 && !prose) {
      skipped.push(`${file}:${element.loc.start.line} <${element.tag}> is styled by ${slots.join(' / ')}, write its \`data-slot\` by hand, mirroring the condition if there is one`)
      continue
    }

    // `:data-slot="($attrs['data-slot'] as string | undefined) ?? 'root'"`: the
    // caller's value wins, ours is the fallback.
    const fallback = bound?.exp?.content.match(/\?\?\s*'([\w-]+)'\s*$/)
    if (bound && fallback && slot) {
      const start = bound.exp.loc.start.offset + fallback.index + fallback[0].indexOf('\'') + 1
      edits.push({ start, end: start + fallback[1].length, value: valueFor(slot), line: bound.loc.start.line })
    } else if (bound) {
      const wrong = strays(bound.exp?.content ?? '', source, valid)
      if (wrong.length) {
        skipped.push(`${file}:${bound.loc.start.line} :data-slot can be ${wrong.map(value => `"${value}"`).join(', ')}, expected \`${namespace}\` or \`${namespace}-<slot>\``)
      }
    }
  }

  // Offsets are relative to the file: the template AST is parsed in place.
  let code = source
  const changed = edits.filter(edit => edit.start === edit.end || source.slice(edit.start, edit.end) !== edit.value)
  for (const edit of changed.toSorted((a, b) => b.start - a.start)) {
    code = code.slice(0, edit.start) + edit.value + code.slice(edit.end)
  }
  return { code, edits: changed, skipped }
}

// Also imported by `test/components/DataSlot.spec.ts`, which only needs `transform`.
if (import.meta.url.startsWith('file:') && process.argv[1] === fileURLToPath(import.meta.url)) {
  // Node 22+, which only the CLI needs
  const { glob } = await import('node:fs/promises')
  const root = fileURLToPath(new URL('..', import.meta.url))
  const check = process.argv.includes('--check')
  let total = 0
  const notes = []
  for await (const file of glob('src/runtime/components/**/*.vue', { cwd: root })) {
    const source = readFileSync(root + file, 'utf8')
    const { code, edits, skipped } = transform(source, file)
    notes.push(...skipped)
    if (!edits.length) {
      continue
    }
    total += edits.length
    if (check) {
      for (const edit of edits) {
        console.log(`${file}:${edit.line} -> ${edit.value}`)
      }
    } else {
      writeFileSync(root + file, code)
    }
  }

  if (notes.length) {
    console.log(`\nLeft alone, check by hand (${notes.length}):\n${notes.join('\n')}`)
  }
  console.log(`\n${total} data-slot value${total === 1 ? '' : 's'} ${check ? 'to rewrite' : 'rewritten'}`)
  if (check && total) {
    process.exit(1)
  }
}
