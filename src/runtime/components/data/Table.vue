<template>
  <div :class="wrapperClass" v-bind="attrs">
    <table :class="[ui.base, ui.divide]">
      <thead :class="ui.thead">
        <tr :class="ui.tr.base">
          <th v-if="modelValue" scope="col" :class="ui.checkbox.padding">
            <UCheckbox :checked="indeterminate || selected.length === rows.length" :indeterminate="indeterminate" aria-label="Select all" @change="onChange" />
          </th>

          <th v-for="(column, index) in columns" :key="index" scope="col" :class="[ui.th.base, ui.th.padding, ui.th.color, ui.th.font, ui.th.size, column.class]">
            <slot :name="`${column.key}-header`" :column="column" :sort="sort" :on-sort="onSort">
              <UButton
                v-if="column.sortable"
                v-bind="{ ...ui.default.sortButton, ...sortButton }"
                :icon="(!sort.column || sort.column !== column.key) ? (sortButton.icon || ui.default.sortButton.icon) : sort.direction === 'asc' ? sortAscIcon : sortDescIcon"
                :label="column[columnAttribute]"
                @click="onSort(column)"
              />
              <span v-else>{{ column[columnAttribute] }}</span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody :class="ui.tbody">
        <tr v-if="loadingState && loading">
          <td :colspan="columns.length + (modelValue ? 1 : 0)">
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
          <td :colspan="columns.length + (modelValue ? 1 : 0)">
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

        <template v-else>
          <tr v-for="(row, index) in rows" :key="index" :class="[ui.tr.base, isSelected(row) && ui.tr.selected, $attrs.onSelect && ui.tr.active]" @click="() => onSelect(row)">
            <td v-if="modelValue" :class="ui.checkbox.padding">
              <UCheckbox v-model="selected" :value="row" aria-label="Select row" @click.stop />
            </td>

            <td v-for="(column, subIndex) in columns" :key="subIndex" :class="[ui.td.base, ui.td.padding, ui.td.color, ui.td.font, ui.td.size]">
              <slot :name="`${column.key}-data`" :column="column" :row="row" :index="index" :get-row-data="(defaultValue) => getRowData(row, column.key, defaultValue)">
                {{ getRowData(row, column.key) }}
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, toRaw } from 'vue'
import type { PropType } from 'vue'
import { omit, capitalize, orderBy, get } from 'lodash-es'
import { defu } from 'defu'
import { twMerge } from 'tailwind-merge'
import { defuTwMerge } from '../../utils'
import UButton from '../elements/Button.vue'
import UIcon from '../elements/Icon.vue'
import UCheckbox from '../forms/Checkbox.vue'
import type { Button } from '../../types/button'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

function defaultComparator<T> (a: T, z: T): boolean {
  return a === z
}

export default defineComponent({
  components: {
    UButton,
    UIcon,
    UCheckbox
  },
  inheritAttrs: false,
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
      type: Array as PropType<{ [key: string]: any, click?: Function }[]>,
      default: () => []
    },
    columns: {
      type: Array as PropType<{ key: string, sortable?: boolean, direction?: 'asc' | 'desc', class?: string, [key: string]: any }[]>,
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
      type: Object as PropType<Button>,
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
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit, attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.table>>(() => defuTwMerge({}, props.ui, appConfig.ui.table))

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    const columns = computed(() => props.columns ?? Object.keys(omit(props.rows[0] ?? {}, ['click'])).map((key) => ({ key, label: capitalize(key), sortable: false })))

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

    const emptyState = computed(() => {
      if (props.emptyState === null) return null
      return { ...ui.value.default.emptyState, ...props.emptyState }
    })

    const loadingState = computed(() => {
      if (props.loadingState === null) return null
      return { ...ui.value.default.loadingState, ...props.loadingState }
    })

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

    function onSort (column: { key: string, direction?: 'asc' | 'desc' }) {
      if (sort.value.column === column.key) {
        const direction = !column.direction || column.direction === 'asc' ? 'desc' : 'asc'

        if (sort.value.direction === direction) {
          sort.value = defu({}, props.sort, { column: null, direction: 'asc' })
        } else {
          sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
        }
      } else {
        sort.value = { column: column.key, direction: column.direction || 'asc' }
      }
    }

    function onSelect (row) {
      if (!attrs.onSelect) {
        return
      }

      // @ts-ignore
      attrs.onSelect(row)
    }

    function selectAllRows () {
      props.rows.forEach((row) => {
        // If the row is already selected, don't select it again
        if (selected.value.some((item) => compare(toRaw(item), toRaw(row)))) {
          return
        }

        // @ts-ignore
        attrs.onSelect ? attrs.onSelect(row) : selected.value.push(row)
      })
    }

    function onChange (event: any) {
      if (event.target.checked) {
        selectAllRows()
      } else {
        selected.value = []
      }
    }

    function getRowData (row: Object, rowKey: string | string[], defaultValue: any = 'Failed to get cell value') {
      return get(row, rowKey, defaultValue)
    }

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      wrapperClass,
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
      // eslint-disable-next-line vue/no-dupe-keys
      loadingState,
      isSelected,
      onSort,
      onSelect,
      onChange,
      getRowData
    }
  }
})
</script>
