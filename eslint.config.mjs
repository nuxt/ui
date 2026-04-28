import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

/**
 * Flag bare prop references in templates of components that use
 * `useComponentProps`. Bare refs auto-resolve to the raw `defineProps` result
 * via Vue's compiler-generated `__props.X`, bypassing the proxy that resolves
 * `<UTheme :props>` and `app.config` defaults.
 *
 * Auto-fixes by rewriting `arrow` → `props.arrow`.
 *
 * Heuristic for "is this identifier a prop?":
 *   1. Property signatures of any `interface *Props` declared in the same file.
 *   2. Members accessed as `_props.X` or `props.X` anywhere in the script.
 */
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
    const propNames = new Set()
    const setupBindings = new Set()

    function collectInterfaceProps(node) {
      if (!node || node.type !== 'TSInterfaceDeclaration') return
      if (!node.id?.name?.endsWith('Props')) return
      for (const member of node.body.body) {
        if (member.type === 'TSPropertySignature' && member.key?.type === 'Identifier') {
          propNames.add(member.key.name)
        }
      }
    }

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
            if (!name || !propNames.has(name)) continue
            if (name === propsVar || name === rawPropsVar) continue
            if (setupBindings.has(name)) continue
            context.report({
              node: id,
              messageId: 'bareRef',
              data: { name, propsVar },
              fix(fixer) {
                return fixer.replaceText(id, `${propsVar}.${name}`)
              }
            })
          }
        }
      },
      {
        TSInterfaceDeclaration(node) {
          collectInterfaceProps(node)
        },
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
        },
        MemberExpression(node) {
          if (node.object?.type !== 'Identifier') return
          if (node.object.name !== rawPropsVar && node.object.name !== propsVar) return
          if (node.property?.type === 'Identifier' && !node.computed) {
            propNames.add(node.property.name)
          }
        }
      }
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
        'no-bare-prop-refs': noBarePropRefs
      }
    }
  },
  rules: {
    'nuxt-ui/no-bare-prop-refs': 'error'
  }
})
