<template>
  <div :class="ui.wrapper">
    <table :class="ui.container">
      <thead :class="ui.thead">
        <tr :class="ui.tr.base">
          <th v-if="modelValue" scope="col" class="pl-4">
            <UCheckbox :checked="indeterminate || selected.length === rows.length" :indeterminate="indeterminate" @change="selected = $event.target.checked ? rows : []" />
          </th>

          <th v-for="(column, index) in columns" :key="index" scope="col" :class="ui.th">
            <slot :name="`${column.key}-header`" :column="column" :sort="sort" :on-sort="onSort">
              <UButton
                v-if="column.sortable"
                v-bind="sortButton"
                :icon="(!sort.field || sort.field !== column.key) ? sortButton.icon : sort.direction === 'asc' ? sortAscIcon : sortDescIcon"
                :label="column[columnAttribute]"
                @click="onSort(column.key)"
              />
              <span v-else>{{ column[columnAttribute] }}</span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody :class="ui.tbody">
        <tr v-for="(row, index) in rows" :key="index" :class="[ui.tr.base, isSelected(row) && ui.tr.selected]">
          <td v-if="modelValue" class="pl-4">
            <UCheckbox v-model="selected" :value="row" />
          </td>

          <td v-for="(column, subIndex) in columns" :key="subIndex" :class="ui.td">
            <slot :name="`${column.key}-data`" :column="column" :row="row">
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
import { capitalize, orderBy } from 'lodash-es'
import { defu } from 'defu'
import type { Button } from '../../types/button'
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
    sortButton: {
      type: Object as PropType<Partial<Button>>,
      default: () => appConfig.ui.table.default.sortButton
    },
    sortAscIcon: {
      type: String,
      default: () => appConfig.ui.table.default.sortAscIcon
    },
    sortDescIcon: {
      type: String,
      default: () => appConfig.ui.table.default.sortDescIcon
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

    const sort = ref({ field: null, direction: null })

    const columns = computed(() => props.columns ?? Object.keys(props.rows[0] ?? {}).map((key) => ({ key, label: capitalize(key), sortable: false })))

    const rows = computed(() => {
      if (!sort.value?.field) {
        return props.rows
      }

      const { field, direction } = sort.value

      return orderBy(props.rows, field, direction)
    })

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

    function onSort (field: string, direction?: 'asc' | 'desc') {
      if (sort.value.field === field) {
        sort.value.direction = direction || sort.value.direction === 'asc' ? 'desc' : 'asc'
      } else {
        sort.value = { field, direction: direction || 'asc' }
      }
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      sort,
      // eslint-disable-next-line vue/no-dupe-keys
      columns,
      // eslint-disable-next-line vue/no-dupe-keys
      rows,
      selected,
      indeterminate,
      isSelected,
      onSort
    }
  }
})
</script>
