import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import { fileURLToPath } from 'node:url'
import betterTailwindcss from 'eslint-plugin-better-tailwindcss'

/**
 * Flag bare prop references in templates of components that use
 * `useComponentProps`. Bare refs auto-resolve to the raw `defineProps` result
 * via Vue's compiler-generated `__props.X`, bypassing the proxy that resolves
 * `<UTheme :props>` and `app.config` defaults.
 *
 * Auto-fixes by rewriting `arrow` → `props.arrow`.
 *
 * In `<script setup>`, every free identifier in a template expression resolves
 * to either (a) a setup-scope binding or (b) `__props.X`. So if an identifier
 * isn't a known setup binding, slot-scoped variable, or JS global, it must be
 * a prop access — and therefore needs the `props.` prefix to flow through the
 * proxy. This catches inherited props (extended/picked from imported types)
 * that no static interface walk would find.
 */
const KNOWN_GLOBALS = new Set([
  'undefined', 'null', 'true', 'false', 'NaN', 'Infinity',
  'console', 'window', 'document', 'navigator', 'location', 'history',
  'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean',
  'Date', 'RegExp', 'Promise', 'Symbol', 'Error', 'Map', 'Set',
  'WeakMap', 'WeakSet', 'Proxy', 'Reflect',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'encodeURIComponent', 'decodeURIComponent'
])
const noBarePropRefs = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require `props.X` access in templates of components using `useComponentProps`'
    },
    fixable: 'code',
    schema: [],
    messages: {
      bareRef: 'Bare prop reference `{{ name }}` bypasses the `useComponentProps` proxy. Use `{{ propsVar }}.{{ name }}` so `<UTheme :props>` defaults flow through.'
    }
  },
  create(context) {
    const parserServices = context.sourceCode?.parserServices ?? context.parserServices
    if (!parserServices?.defineTemplateBodyVisitor) {
      return {}
    }

    let usesComponentProps = false
    let propsVar = 'props'
    let rawPropsVar = '_props'
    const setupBindings = new Set()

    function collectIdsFromPattern(pattern) {
      if (!pattern) return
      if (pattern.type === 'Identifier') {
        setupBindings.add(pattern.name)
      } else if (pattern.type === 'ObjectPattern') {
        for (const prop of pattern.properties) {
          if (prop.type === 'Property') collectIdsFromPattern(prop.value)
          else if (prop.type === 'RestElement') collectIdsFromPattern(prop.argument)
        }
      } else if (pattern.type === 'ArrayPattern') {
        for (const el of pattern.elements) {
          if (el) collectIdsFromPattern(el)
        }
      } else if (pattern.type === 'AssignmentPattern') {
        collectIdsFromPattern(pattern.left)
      } else if (pattern.type === 'RestElement') {
        collectIdsFromPattern(pattern.argument)
      }
    }

    return parserServices.defineTemplateBodyVisitor(
      {
        VExpressionContainer(node) {
          if (!usesComponentProps) return
          const refs = node.references ?? []
          for (const ref of refs) {
            if (ref.variable) continue
            const id = ref.id
            const name = id.name
            if (!name) continue
            if (name === propsVar || name === rawPropsVar) continue
            if (setupBindings.has(name)) continue
            if (KNOWN_GLOBALS.has(name)) continue
            if (name.startsWith('$') || name.startsWith('_')) continue
            // Skip PascalCase identifiers — they're TypeScript type references
            // inside `as TypeName` casts, generic params (`T`), or `keyof X`,
            // not runtime prop reads. Vue components / props are camelCase by
            // convention; type names are PascalCase.
            if (/^[A-Z]/.test(name)) continue
            context.report({
              node: id,
              messageId: 'bareRef',
              data: { name, propsVar },
              fix(fixer) {
                // Handle object literal shorthand: `{ to, target }` should
                // become `{ to: props.to, target: props.target }`, not the
                // syntactically-broken `{ props.to, props.target }`.
                const parent = id.parent
                if (
                  parent
                  && parent.type === 'Property'
                  && parent.shorthand
                  && parent.key === id
                ) {
                  return fixer.replaceText(parent, `${name}: ${propsVar}.${name}`)
                }
                return fixer.replaceText(id, `${propsVar}.${name}`)
              }
            })
          }
        }
      },
      {
        'Program > VariableDeclaration > VariableDeclarator'(node) {
          collectIdsFromPattern(node.id)
        },
        'Program > FunctionDeclaration'(node) {
          if (node.id?.type === 'Identifier') setupBindings.add(node.id.name)
        },
        'Program > ClassDeclaration'(node) {
          if (node.id?.type === 'Identifier') setupBindings.add(node.id.name)
        },
        ImportDeclaration(node) {
          for (const spec of node.specifiers) {
            if (spec.local?.type === 'Identifier') setupBindings.add(spec.local.name)
          }
        },
        'CallExpression[callee.name="useComponentProps"]'(node) {
          usesComponentProps = true
          const decl = node.parent?.type === 'VariableDeclarator' ? node.parent : null
          if (decl?.id?.type === 'Identifier') {
            propsVar = decl.id.name
          }
          const rawArg = node.arguments[1]
          if (rawArg?.type === 'Identifier') {
            rawPropsVar = rawArg.name
          }
        }
      }
    )
  }
}

/**
 * Flag reads of a `useFormField` / `useFieldGroup` ref that don't fall back to
 * the `useComponentProps` proxy.
 *
 * `size`, `color`, `highlight` and `disabled` come back holding only what the
 * wrapping `<UForm>` / `<UFormField>` / `<UFieldGroup>` supplied, so a bare
 * `size.value` silently drops `<UTheme :props>` and `app.config` defaults. The
 * fix is always the same shape, either inline or hoisted into a computed:
 *
 * ```ts
 * size: formFieldSize.value ?? props.size
 * const disabled = computed(() => formFieldDisabled.value ?? props.disabled)
 * ```
 *
 * So the rule allows a read only when it sits in a `??` chain that ends in a
 * `props.<key>` member access, and reports it everywhere else. Chaining two
 * refs (`fieldGroupSize.value ?? formFieldSize.value ?? props.size`) is fine.
 *
 * Templates are checked too, and more strictly: refs auto-unwrap there, so an
 * unresolved `:size="formFieldSize"` has no `.value` to key off and reads
 * exactly like the resolved `:size="size"`. Since the resolution always belongs
 * in setup anyway, any appearance of one of these refs in a template is
 * reported outright.
 *
 * Not auto-fixable: the right landing spot is often a shared computed rather
 * than the use site, and appending `?? props.x` to the wrong branch of a
 * ternary would change behaviour silently.
 */
const RESOLVABLE_FORM_FIELD_KEYS = new Set(['size', 'color', 'highlight', 'disabled'])
const noUnresolvedFormFieldRefs = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require `<ref>.value ?? props.X` when reading a `useFormField` / `useFieldGroup` ref'
    },
    schema: [],
    messages: {
      unresolved: 'Reading `{{ local }}` without a `?? {{ propsVar }}.{{ key }}` fallback drops `<UTheme :props>` and `app.config` defaults. Chain it, or read a computed that already does.',
      inTemplate: 'Binding the raw `{{ local }}` in the template drops `<UTheme :props>` and `app.config` defaults, and refs auto-unwrap here so it is indistinguishable from a resolved one. Resolve it in setup with `computed(() => {{ local }}.value ?? {{ propsVar }}.{{ key }})` and bind that.'
    }
  },
  create(context) {
    const parserServices = context.sourceCode?.parserServices ?? context.parserServices
    let propsVar = 'props'
    // local binding name -> the prop key it must fall back to
    const formFieldRefs = new Map()

    function isPropsAccess(node, key) {
      return !!node
        && node.type === 'MemberExpression'
        && !node.computed
        && node.object.type === 'Identifier'
        && node.object.name === propsVar
        && node.property.type === 'Identifier'
        && node.property.name === key
    }

    // `a ?? b ?? props.size` parses as `(a ?? b) ?? props.size`, so the fallback
    // can sit at any depth on either spine. Flatten the whole chain and accept
    // it if `props.<key>` shows up anywhere in it — that also covers the
    // `?? props.size ?? 'md'` shape used for virtualizer estimates.
    function chainOperands(node, out = []) {
      if (node.type === 'LogicalExpression' && node.operator === '??') {
        chainOperands(node.left, out)
        chainOperands(node.right, out)
      } else {
        out.push(node)
      }
      return out
    }

    const scriptVisitor = {
      'CallExpression[callee.name="useComponentProps"]'(node) {
        const decl = node.parent?.type === 'VariableDeclarator' ? node.parent : null
        if (decl?.id?.type === 'Identifier') {
          propsVar = decl.id.name
        }
      },
      ':matches(CallExpression[callee.name="useFormField"], CallExpression[callee.name="useFieldGroup"])'(node) {
        const decl = node.parent?.type === 'VariableDeclarator' ? node.parent : null
        if (decl?.id?.type !== 'ObjectPattern') return

        for (const prop of decl.id.properties) {
          if (prop.type !== 'Property' || prop.key.type !== 'Identifier') continue
          if (!RESOLVABLE_FORM_FIELD_KEYS.has(prop.key.name)) continue
          if (prop.value.type !== 'Identifier') continue
          formFieldRefs.set(prop.value.name, prop.key.name)
        }
      },
      // Matches `<local>.value`, the only way these refs are read in script.
      'MemberExpression[computed=false][property.name="value"]'(node) {
        if (node.object.type !== 'Identifier') return

        const key = formFieldRefs.get(node.object.name)
        if (!key) return

        // Climb to the outermost `??` so the whole chain is in scope, then look
        // for the `props.<key>` fallback in the operands that follow this read.
        // Only a fallback placed after it is a fallback: `props.size ?? size.value`
        // reads the other way round and would let a theme default win over the
        // wrapping FormField.
        let top = node
        while (top.parent?.type === 'LogicalExpression' && top.parent.operator === '??') {
          top = top.parent
        }

        const operands = chainOperands(top)
        const index = operands.indexOf(node)

        if (index !== -1 && operands.slice(index + 1).some(operand => isPropsAccess(operand, key))) {
          return
        }

        context.report({
          node,
          messageId: 'unresolved',
          data: { local: `${node.object.name}.value`, propsVar, key }
        })
      }
    }

    if (!parserServices?.defineTemplateBodyVisitor) {
      return scriptVisitor
    }

    // Template visitors run after the script is fully traversed, so
    // `formFieldRefs` is populated by the time this fires.
    return parserServices.defineTemplateBodyVisitor(
      {
        VExpressionContainer(node) {
          for (const ref of node.references ?? []) {
            const name = ref.id?.name
            if (!name) continue

            const key = formFieldRefs.get(name)
            if (!key) continue

            context.report({
              node: ref.id,
              messageId: 'inTemplate',
              data: { local: name, propsVar, key }
            })
          }
        }
      },
      scriptVisitor
    )
  }
}

/**
 * Namespace `data-slot` with the component name: every element styled by a
 * theme slot carries `data-slot="<component>-<slot>"`, and the outermost one
 * the component name alone (`card`, `card-header`, `button-leadingIcon`). Each
 * value is unique across the library, so a stylesheet can target one part of
 * one component.
 *
 * `<component>` is the `#build/ui/<path>` import in kebab-case, `<slot>` the
 * theme slot key as written. Both are derived from the `ui.<slot>()` call on
 * the tag rather than from the value already there, so the fix is idempotent
 * and re-applies whatever a `v4` sync brings back bare.
 *
 * Auto-fixes a wrong value, and adds the attribute where a styled tag has none
 * (before any `v-bind` spread, so a caller's `data-slot` still wins). A tag
 * whose `:class` picks between two slots, and a `:data-slot` expression, are
 * reported rather than guessed: their value is written by hand.
 */
const SLOT_CALL = /\bui(?:\.value)?\.(\w+)\(/g
// Our own `*Content` components label their root themselves, with the parent's
// namespace: `UContextMenuContent` renders `context-menu-content`.
const FORWARDED = new Set(['UContextMenuContent', 'UDropdownMenuContent'])

const dataSlotNamespace = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Namespace `data-slot` with the component name'
    },
    fixable: 'code',
    schema: [],
    messages: {
      wrong: 'This element is styled by `ui.{{ slot }}()`, so its `data-slot` is `{{ expected }}`.',
      missing: 'Add `data-slot="{{ expected }}"`: every element styled by a slot carries one, so it can be targeted from CSS.',
      ambiguous: 'This element is styled by {{ slots }}. Write its `data-slot` by hand, mirroring the condition.',
      stray: '`data-slot` can be {{ values }} here, expected `{{ namespace }}` or `{{ namespace }}-<slot>`.',
      unverifiable: 'This `:data-slot` holds no value this rule can read, so its markers go unchecked. Name them inline, as `condition ? \'{{ namespace }}-a\' : \'{{ namespace }}-b\'`, or through a `const` declared in this file.'
    }
  },
  create(context) {
    const parserServices = context.sourceCode.parserServices
    if (!parserServices?.defineTemplateBodyVisitor) {
      return {}
    }

    // Prose components emit no marker: one on every `<p>` and `<li>` of a
    // rendered document is weight nobody selects on.
    if (context.filename.replaceAll('\\', '/').includes('/prose/')) {
      return {}
    }

    let namespace
    const elements = []
    // Top-level `const`s, so a `:data-slot` naming one can be read back.
    const bindings = new Map()

    const attribute = (element, name) => element.startTag.attributes.find(attr => !attr.directive && attr.key.name === name)
    const directive = (element, name) => element.startTag.attributes.find(attr => attr.directive && attr.key.name.name === 'bind' && attr.key.argument?.name === name)
    const spread = element => element.startTag.attributes.find(attr => attr.directive && attr.key.name.name === 'bind' && !attr.key.argument)

    return parserServices.defineTemplateBodyVisitor(
      {
        VElement(element) {
          const klass = directive(element, 'class')
          const expression = klass?.value ? context.sourceCode.getText(klass.value).slice(1, -1).trim() : ''
          // `ui.root({ class: [ui.base(...), props.class] })`: one call wraps
          // the whole binding, the slots merged inside land on that element.
          const outer = expression.match(/^ui(?:\.value)?\.(\w+)\(/)
          const slots = outer && closesAt(expression, outer[0].length - 1) === expression.length - 1
            ? [outer[1]]
            : [...new Set([...expression.matchAll(SLOT_CALL)].map(match => match[1]))]

          elements.push({ element, slots, expression })
        },

        // The `<template>` element itself, once every child has been collected.
        'VElement:exit'(root) {
          if (root.parent.type !== 'VDocumentFragment' || !namespace) {
            return
          }

          const template = context.sourceCode.getText()
          // Every slot the component reads, `:class` or not
          const rendered = [...template.matchAll(SLOT_CALL)].map(match => match[1])
          const valid = new Set([namespace, ...rendered.map(slot => `${namespace}-${slot}`)])

          // The outermost element is the `root` slot, or the `base` that
          // `props.class` lands on when there is none. Overlays have neither:
          // their teleported content is `<component>-content` like any part.
          const outermost = /\bui(?:\.value)?\.root\(/.test(template)
            ? 'root'
            : (/\bui(?:\.value)?\.base\(\{[^}]*\bprops\.class\b/.test(template) ? 'base' : undefined)
          const valueFor = slot => slot === outermost ? namespace : `${namespace}-${slot}`

          for (const { element, slots } of elements) {
            const slot = slots.length === 1 ? slots[0] : undefined
            const literal = attribute(element, 'data-slot')
            const bound = directive(element, 'data-slot')

            if (literal) {
              if (slot) {
                const expected = valueFor(slot)
                if (literal.value?.value !== expected) {
                  context.report({
                    node: literal,
                    messageId: 'wrong',
                    data: { slot, expected },
                    fix: fixer => fixer.replaceText(literal, `data-slot="${expected}"`)
                  })
                }
              } else if (!valid.has(literal.value?.value)) {
                context.report({ node: literal, messageId: 'stray', data: { values: `"${literal.value?.value ?? ''}"`, namespace } })
              }
              continue
            }

            if (bound) {
              // `:data-slot="($attrs['data-slot'] as string | undefined) ?? 'root'"`:
              // the caller's value wins, ours is the fallback.
              const text = bound.value ? context.sourceCode.getText(bound.value).slice(1, -1) : ''
              const fallback = slot && text.match(/\?\?\s*'([\w-]+)'\s*$/)
              const expected = slot && valueFor(slot)
              if (fallback && fallback[1] !== expected) {
                const start = bound.value.range[0] + 1 + fallback.index + fallback[0].indexOf('\'') + 1
                context.report({
                  node: bound,
                  messageId: 'wrong',
                  data: { slot, expected },
                  fix: fixer => fixer.replaceTextRange([start, start + fallback[1].length], expected)
                })
                continue
              }
              // A ternary, or a `const` named here and declared in the script:
              // every value it can take has to be one this component renders.
              const identifier = text.trim()
              const source = /^[\w$]+$/.test(identifier) ? bindings.get(identifier) : text
              const values = source === undefined
                ? []
                : [...source.matchAll(/'([^']*)'/g)].map(match => match[1]).filter(value => value !== 'data-slot')
              if (!values.length) {
                // Reported rather than passed over: reading nothing would make
                // every value the expression can take look valid.
                context.report({ node: bound, messageId: 'unverifiable', data: { namespace } })
                continue
              }
              const wrong = values.filter(value => !valid.has(value))
              if (wrong.length) {
                context.report({ node: bound, messageId: 'stray', data: { values: wrong.map(value => `"${value}"`).join(', '), namespace } })
              }
              continue
            }

            if (slots.length > 1) {
              context.report({ node: element.startTag, messageId: 'ambiguous', data: { slots: slots.join(' / ') } })
              continue
            }
            if (!slot || FORWARDED.has(element.rawName)) {
              continue
            }

            const klass = directive(element, 'class')
            const spreadAttr = spread(element)
            // Before a `v-bind` spread, so a caller's `data-slot` still wins.
            const before = spreadAttr && spreadAttr.range[0] < klass.range[0] ? spreadAttr : klass
            const indent = context.sourceCode.getText().slice(context.sourceCode.getText().lastIndexOf('\n', before.range[0]) + 1, before.range[0])
            const separator = /^\s+$/.test(indent) ? `\n${indent}` : ' '
            context.report({
              node: element.startTag,
              messageId: 'missing',
              data: { expected: valueFor(slot) },
              fix: fixer => fixer.insertTextBeforeRange(before.range, `data-slot="${valueFor(slot)}"${separator}`)
            })
          }
        }
      },
      {
        'Program > VariableDeclaration > VariableDeclarator'(node) {
          if (node.id.type === 'Identifier' && node.init) {
            bindings.set(node.id.name, context.sourceCode.getText(node.init))
          }
        },
        ImportDeclaration(node) {
          const path = node.source.value?.match?.(/^#build\/ui\/([\w/-]+)$/)?.[1]
          if (path) {
            namespace = path.replace(/^content\//, '').replaceAll('/', '-')
          }
        }
      }
    )
  }
}

/** Index of the parenthesis closing the one at `open`. */
function closesAt(expression, open) {
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
 * Tailwind class checks for the apps in this repo (docs and playgrounds).
 * `src/theme` is not covered yet: the plugin skips `export default (options) => ({...})`
 * until https://github.com/schoero/eslint-plugin-better-tailwindcss/pull/397 ships.
 */
function betterTailwindcssConfig(files, entryPoint, ignore = []) {
  // Absolute so editor ESLint servers running from a subfolder resolve it too.
  entryPoint = fileURLToPath(new URL(entryPoint, import.meta.url))
  return {
    files,
    plugins: {
      'better-tailwindcss': betterTailwindcss
    },
    settings: {
      'better-tailwindcss': {
        entryPoint,
        attributes: [
          '^(v-bind:|:)?class$',
          ['^(v-bind:|:)?ui$', [{ match: 'objectValues' }]]
        ]
      }
    },
    rules: {
      ...betterTailwindcss.configs['correctness-error'].rules,
      'better-tailwindcss/no-unknown-classes': ['error', { ignore }],
      // Tailwind keeps the v3 names working, so nothing breaks until it doesn't.
      'better-tailwindcss/no-deprecated-classes': 'error'
    }
  }
}

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      commaDangle: 'never',
      braceStyle: '1tbs'
    }
  }
}).overrideRules({
  'import/first': 'off',
  'import/order': 'off',
  'vue/multi-word-component-names': 'off',
  'vue/max-attributes-per-line': ['error', { singleline: 5 }],
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off'
}).append({
  files: ['src/runtime/components/**/*.vue'],
  plugins: {
    'nuxt-ui': {
      rules: {
        'no-bare-prop-refs': noBarePropRefs,
        'no-unresolved-form-field-refs': noUnresolvedFormFieldRefs,
        'data-slot-namespace': dataSlotNamespace
      }
    }
  },
  rules: {
    'nuxt-ui/no-bare-prop-refs': 'error',
    'nuxt-ui/no-unresolved-form-field-refs': 'error',
    'nuxt-ui/data-slot-namespace': 'error'
  }
}).append(betterTailwindcssConfig(['docs/app/**/*.vue'], 'docs/app/assets/css/main.css', [
  // Hook classes styled in scoped `<style>` blocks or `main.css`, not Tailwind utilities.
  '^nuxi-', '^landing-', '^(nuxt|vue)-only$', '^(playground-)?wall$', '^horizon$', '^twinkle$',
  '^stars?$', '^star-layer$', '^dice-rolling$', '^squircle$', '^carbon$', '^example$', '^my-table-tbody$'
])).append(
  betterTailwindcssConfig(['playgrounds/nuxt/app/**/*.vue'], 'playgrounds/nuxt/app/assets/css/main.css')
).append(
  betterTailwindcssConfig(['playgrounds/vue/src/**/*.vue'], 'playgrounds/vue/src/assets/css/main.css')
).append({
  files: ['src/runtime/components/**/*.vue', 'src/runtime/composables/**/*.ts'],
  rules: {
    'no-restricted-imports': ['error', {
      paths: [
        { name: '../types', message: 'Import cross-component types from their source file (e.g. \'./Button.vue\') or a specific \'../types/*\' module, not the \'../types\' barrel: it re-exports every component, so one import eagerly loads the whole library into a consumer\'s type graph.' },
        { name: '../../types', message: 'Import cross-component types from their source file (e.g. \'./Button.vue\') or a specific \'../../types/*\' module, not the \'../../types\' barrel: it re-exports every component, so one import eagerly loads the whole library into a consumer\'s type graph.' }
      ]
    }]
  }
})
