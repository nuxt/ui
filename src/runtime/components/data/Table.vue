<template>
  <div :class="ui.wrapper">
    <table :class="[ui.base, ui.divide]">
      <thead :class="ui.thead">
        <tr :class="ui.tr.base">
          <th v-if="modelValue" scope="col" class="pl-4">
            <UCheckbox :checked="indeterminate || selected.length === rows.length" :indeterminate="indeterminate" @change="selected = $event.target.checked ? rows : []" />
          </th>

          <th v-for="(column, index) in columns" :key="index" scope="col" :class="[ui.th.base, ui.th.padding, ui.th.color, ui.th.font, ui.th.size]">
            <slot :name="`${column.key}-header`" :column="column" :sort="sort" :on-sort="onSort">
              <UButton
                v-if="column.sortable"
                v-bind="{ ...ui.default.sortButton, ...sortButton }"
                :icon="(!sort.column || sort.column !== column.key) ? sortButton.icon : sort.direction === 'asc' ? sortAscIcon : sortDescIcon"
                :label="column[columnAttribute]"
                @click="onSort(column)"
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

          <td v-for="(column, subIndex) in columns" :key="subIndex" :class="[ui.td.base, ui.td.padding, ui.td.color, ui.td.font, ui.td.size]">
            <slot :name="`${column.key}-data`" :column="column" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>

        <tr v-if="loadingState && loading">
          <td :colspan="columns.length">
            <slot name="loading-state">
              <div :class="ui.loadingState.wrapper">
                <UIcon v-if="loadingState.icon" :name="loadingState.icon" :class="ui.loadingState.icon" aria-hidden="true" />
                <p :class="ui.loadingState.label">
                  {{ loadingState.label }}
                </p>
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else-if="emptyState && !rows.length">
          <td :colspan="columns.length">
            <slot name="empty-state">
              <div :class="ui.emptyState.wrapper">
                <UIcon v-if="emptyState.icon" :name="emptyState.icon" :class="ui.emptyState.icon" aria-hidden="true" />
                <p :class="ui.emptyState.label">
                  {{ emptyState.label }}
                </p>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, toRaw } from 'vue'
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
    sort: {
      type: Object as PropType<{ column: string, direction: 'asc' | 'desc' }>,
      default: () => ({})
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
    loading: {
      type: Boolean,
      default: false
    },
    loadingState: {
      type: Object as PropType<{ icon: string, label: string }>,
      default: () => appConfig.ui.table.default.loadingState
    },
    emptyState: {
      type: Object as PropType<{ icon: string, label: string }>,
      default: () => appConfig.ui.table.default.emptyState
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

    const columns = computed(() => props.columns ?? Object.keys(props.rows[0] ?? {}).map((key) => ({ key, label: capitalize(key), sortable: false })))

    const sort = ref(defu({}, props.sort, { column: null, direction: 'asc' }))

    const rows = computed(() => {
      if (!sort.value?.column) {
        return props.rows
      }

      const { column, direction } = sort.value

      return orderBy(props.rows, column, direction)
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

    const emptyState = computed(() => ({ ...ui.value.default.emptyState, ...props.emptyState }))

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

    function onSort (column) {
      if (sort.value.column === column.key) {
        sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
      } else {
        sort.value = { column: column.key, direction: column.direction || 'asc' }
      }
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      sort,
      // eslint-disable-next-line vue/no-dupe-keys
      columns,
      // eslint-disable-next-line vue/no-dupe-keys
      rows,
      selected,
      indeterminate,
      // eslint-disable-next-line vue/no-dupe-keys
      emptyState,
      isSelected,
      onSort
    }
  }
})
</script>
