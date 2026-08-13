import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

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

        // Climb to the outermost `??` so the whole chain is in scope, then
        // check every operand for the `props.<key>` fallback.
        let top = node
        while (top.parent?.type === 'LogicalExpression' && top.parent.operator === '??') {
          top = top.parent
        }

        if (top !== node && chainOperands(top).some(operand => isPropsAccess(operand, key))) {
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
        'no-unresolved-form-field-refs': noUnresolvedFormFieldRefs
      }
    }
  },
  rules: {
    'nuxt-ui/no-bare-prop-refs': 'error',
    'nuxt-ui/no-unresolved-form-field-refs': 'error'
  }
}).append({
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
