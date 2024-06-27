<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { ComponentMeta } from 'vue-component-meta'
import * as theme from '#build/ui'

const route = useRoute()

const camelName = camelCase(route.params.slug[route.params.slug.length - 1])
const name = `U${upperFirst(camelName)}`

const componentTheme = theme[camelName]
const componentMeta = await useComponentMeta(name as any)

const meta: ComputedRef<ComponentMeta> = computed(() => {
  const meta = componentMeta.value.meta

  if (meta.props?.length) {
    meta.props = meta.props.map((prop) => {
      prop.default = prop.default ?? componentTheme.defaultVariants?.[prop.name]
      return prop
    })
  }

  return meta
})

const { data: ast } = await useAsyncData(`${name}-api`, () => parseMarkdown(`
## API

${section('props')}
${section('slots')}
${section('events')}
`))

function section(type: string) {
  const columns = {
    props: [{ key: 'name', label: 'Prop' }, { key: 'default', label: 'Default' }, { key: 'type', addKey: 'description', label: 'Type' }],
    slots: [{ key: 'name', label: 'Slot' }, { key: 'type', addKey: 'description', label: 'Type' }],
    events: [{ key: 'name', label: 'Event' }, { key: 'type', addKey: 'description', label: 'Type' }]
  }

  const items = meta.value[type]
  if (!items?.length) {
    return ''
  }

  return `
### ${upperFirst(type)}

${table(items, columns[type])}
`
}

function table(items: any[], columns?: { key: string, addKey?: string, label: string }[], align: string = 'left') {
  let table = ''
  const separator = {
    left: ':---',
    right: '---:',
    center: '---'
  }

  // Generate columns
  const cols = columns?.length ? columns : Object.keys(items[0]).map(key => ({ key, label: upperFirst(key) }))

  // Generate table headers
  table += cols.map(col => col.label).join(' | ')
  table += '\r\n'

  // Generate table separator
  table += cols.map(() => {
    return separator[align] || separator.center
  }).join(' | ')
  table += '\r\n'

  // Generate table body
  items.forEach((item) => {
    table += cols.map((col) => {
      let code = item[col.key] ? `<code>${item[col.key].replaceAll('|', '&#124;')}</code>` : ''

      if (col.addKey) {
        code += item[col.addKey] ? `<p class="!mt-2">${item[col.addKey].replaceAll('\n\n', '<br>').replaceAll('\n', '<br>')}</p>` : ''
      }

      return code
    }).join(' | ') + '\r\n'
  })

  return table
}
</script>

<template>
  <MDCRenderer v-if="ast && (meta.props?.length || meta.slots?.length || meta.events?.length)" :body="ast.body" :data="ast.data" />
</template>
