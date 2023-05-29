<template>
  <div :class="ui.wrapper">
    <table :class="ui.container">
      <thead :class="ui.thead">
        <tr :class="ui.tr.base">
          <th v-if="modelValue" scope="col" class="pl-4">
            <UCheckbox :checked="indeterminate || selected.length === rows.length" :indeterminate="indeterminate" @change="selected = $event.target.checked ? rows : []" />
          </th>

          <th v-for="(column, index) in columns" :key="index" scope="col" :class="ui.th">
            {{ column[columnAttribute] }}
          </th>
        </tr>
      </thead>
      <tbody :class="ui.tbody">
        <tr v-for="(row, index) in rows" :key="index" :class="[ui.tr.base, isSelected(row) && ui.tr.selected]">
          <td v-if="modelValue" class="pl-4">
            <UCheckbox v-model="selected" :value="row" />
          </td>

          <td v-for="(column, subIndex) in columns" :key="subIndex" :class="ui.td">
            <slot :name="`${column.key}-column`" :column="column" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRaw } from 'vue'
import type { PropType } from 'vue'
import { capitalize } from 'lodash-es'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

function defaultComparator<T>(a: T, z: T): boolean {
  return a === z
}

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: null
    },
    by: {
      type: [String, Function],
      default: () => defaultComparator
    },
    rows: {
      type: Array as PropType<{ [key: string]: any }[]>,
      default: () => []
    },
    columns: {
      type: Array as PropType<{ key: string, sortable?: boolean, [key: string]: any }[]>,
      default: null
    },
    columnAttribute: {
      type: String,
      default: 'label'
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.table>>,
      default: () => appConfig.ui.table
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.table>>(() => defu({}, props.ui, appConfig.ui.table))

    const columns = computed(() => props.columns ?? Object.keys(props.rows[0] ?? {}).map((key) => ({ key, label: capitalize(key) })))

    const selected = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const indeterminate = computed(() => selected.value && selected.value.length > 0 && selected.value.length < props.rows.length)

    function compare (a: any, z: any) {
      if (typeof props.by === 'string') {
        const property = props.by as unknown as any
        return a?.[property] === z?.[property]
      }
      return props.by(a, z)
    }

    function isSelected (row) {
      if (!props.modelValue) {
        return false
      }

      return selected.value.some((item) => compare(toRaw(item), toRaw(row)))
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      columns,
      selected,
      indeterminate,
      isSelected
    }
  }
})
</script>
