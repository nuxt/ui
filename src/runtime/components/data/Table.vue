<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <table :class="[ui.base, ui.divide]">
      <slot v-if="$slots.caption || caption" name="caption">
        <caption :class="ui.caption">
          {{ caption }}
        </caption>
      </slot>
      <thead :class="ui.thead">
        <tr :class="ui.tr.base">
          <th v-if="expand" scope="col" :class="ui.tr.base">
            <span class="sr-only">Expand</span>
          </th>
          <th
            v-for="(column, index) in columns"
            :key="index"
            scope="col"
            :class="[ui.th.base, ui.th.padding, ui.th.color, ui.th.font, ui.th.size, column.key === 'select' && ui.checkbox.padding, column.class]"
            :aria-sort="getAriaSort(column)"
          >
            <slot v-if="!singleSelect && modelValue && (column.key === 'select' || shouldRenderColumnInFirstPlace(index, 'select'))" name="select-header" :indeterminate="indeterminate" :checked="isAllRowChecked" :change="onChange">
              <UCheckbox
                :model-value="isAllRowChecked"
                :indeterminate="indeterminate"
                v-bind="ui.default.checkbox"
                aria-label="Select all"
                @change="onChange"
              />
            </slot>

            <slot v-else :name="`${column.key}-header`" :column="column" :sort="sort" :on-sort="onSort">
              <UButton
                v-if="column.sortable"
                v-bind="{ ...(ui.default.sortButton || {}), ...sortButton }"
                :icon="(!sort.column || sort.column !== column.key) ? (sortButton.icon || ui.default.sortButton.icon) : sort.direction === 'asc' ? sortAscIcon : sortDescIcon"
                :label="column[columnAttribute]"
                @click="onSort(column)"
              />
              <span v-else>{{ column[columnAttribute] }}</span>
            </slot>
          </th>
        </tr>

        <tr v-if="loading && progress">
          <td :colspan="0" :class="ui.progress.wrapper">
            <UProgress v-bind="{ ...(ui.default.progress || {}), ...progress }" size="2xs" />
          </td>
        </tr>
      </thead>
      <tbody :class="ui.tbody">
        <tr v-if="loadingState && loading && !rows.length">
          <td :colspan="columns.length + (modelValue ? 1 : 0) + (expand ? 1 : 0)">
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
          <td :colspan="columns.length + (modelValue ? 1 : 0) + (expand ? 1 : 0)">
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
          <template v-for="(row, index) in rows" :key="index">
            <tr :class="[ui.tr.base, isSelected(row) && ui.tr.selected, isExpanded(row) && ui.tr.expanded, $attrs.onSelect && ui.tr.active, row?.class]" @click="() => onSelect(row)" @contextmenu="(event) => onContextmenu(event, row)">
              <td
                v-if="expand"
                :class="[ui.td.base, ui.td.padding, ui.td.color, ui.td.font, ui.td.size]"
              >
                <template v-if="$slots['expand-action']">
                  <slot name="expand-action" :row="row" :is-expanded="isExpanded(row)" :toggle="() => toggleOpened(row)" />
                </template>
                <UButton
                  v-else
                  :disabled="row.disabledExpand"
                  v-bind="{ ...(ui.default.expandButton || {}), ...expandButton }"
                  :ui="{ icon: { base: [ui.expand.icon, isExpanded(row) && 'rotate-180'].join(' ') } }"
                  @click.capture.stop="toggleOpened(row)"
                />
              </td>
              <td v-for="(column, subIndex) in columns" :key="subIndex" :class="[ui.td.base, ui.td.padding, ui.td.color, ui.td.font, ui.td.size, column?.rowClass, row[column.key]?.class, column.key === 'select' && ui.checkbox.padding]">
                <slot v-if="modelValue && (column.key === 'select' || shouldRenderColumnInFirstPlace(subIndex, 'select')) " name="select-data" :checked="isSelected(row)" :change="(ev: boolean) => onChangeCheckbox(ev, row)">
                  <UCheckbox
                    :model-value="isSelected(row)"
                    v-bind="ui.default.checkbox"
                    aria-label="Select row"
                    @change="onChangeCheckbox($event, row)"
                    @click.capture.stop="() => onSelect(row)"
                  />
                </slot>

                <slot
                  v-else
                  :key="retriggerSlot"
                  :name="`${column.key}-data`"
                  :column="column"
                  :row="row"
                  :index="index"
                  :get-row-data="(defaultValue) => getRowData(row, column.key, defaultValue)"
                >
                  {{ getRowData(row, column.key) }}
                </slot>
              </td>
            </tr>
            <tr v-if="isExpanded(row)">
              <td colspan="100%">
                <slot
                  name="expand"
                  :row="row"
                  :index="index"
                />
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRaw, toRef, watch } from 'vue'
import type { PropType, AriaAttributes } from 'vue'
import { upperFirst } from 'scule'
import { defu } from 'defu'
import { useVModel } from '@vueuse/core'
import { isEqual } from 'ohash'
import UIcon from '../elements/Icon.vue'
import UButton from '../elements/Button.vue'
import UProgress from '../elements/Progress.vue'
import UCheckbox from '../forms/Checkbox.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, get } from '../../utils'
import type { TableRow, TableColumn, Strategy, Button, ProgressColor, ProgressAnimation, DeepPartial, Expanded } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { table } from '#ui/ui.config'

const config = mergeConfig<typeof table>(appConfig.ui.strategy, appConfig.ui.table, table)

function defaultComparator<T>(a: T, z: T): boolean {
  return isEqual(a, z)
}

function defaultSort(a: any, b: any, direction: 'asc' | 'desc') {
  if (a === b) {
    return 0
  }

  if (direction === 'asc') {
    return a < b ? -1 : 1
  } else {
    return a > b ? -1 : 1
  }
}

function getStringifiedSet(arr: TableRow[]) {
  return new Set(arr.map(item => JSON.stringify(item)))
}

function accessor<T extends Record<string, any>>(key: string) {
  return (obj: T) => get(obj, key)
}

export default defineComponent({
  components: {
    UIcon,
    UButton,
    UProgress,
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
      type: Array as PropType<TableRow[]>,
      default: () => []
    },
    columns: {
      type: Array as PropType<TableColumn[]>,
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
    sortMode: {
      type: String as PropType<'manual' | 'auto'>,
      default: 'auto'
    },
    sortButton: {
      type: Object as PropType<Button>,
      default: () => config.default.sortButton as Button
    },
    sortAscIcon: {
      type: String,
      default: () => config.default.sortAscIcon
    },
    sortDescIcon: {
      type: String,
      default: () => config.default.sortDescIcon
    },
    expandButton: {
      type: Object as PropType<Button>,
      default: () => config.default.expandButton as Button
    },
    expand: {
      type: Object as PropType<Expanded<TableRow>>,
      default: () => null
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingState: {
      type: Object as PropType<{ icon: string, label: string } | null>,
      default: () => config.default.loadingState
    },
    emptyState: {
      type: Object as PropType<{ icon: string, label: string }>,
      default: () => config.default.emptyState
    },
    caption: {
      type: String,
      default: null
    },
    progress: {
      type: Object as PropType<{ color: ProgressColor, animation: ProgressAnimation }>,
      default: () => config.default.progress
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    },
    multipleExpand: {
      type: Boolean,
      default: true
    },
    singleSelect: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'update:sort', 'update:expand', 'select:all'],
  setup(props, { emit, attrs: $attrs }) {
    const { ui, attrs } = useUI('table', toRef(props, 'ui'), config, toRef(props, 'class'))

    const columns = computed(() => props.columns ?? Object.keys(props.rows[0] ?? {}).map(key => ({ key, label: upperFirst(key), sortable: false, class: undefined, sort: defaultSort }) as TableColumn))

    const sort = useVModel(props, 'sort', emit, { passive: true, defaultValue: defu({}, props.sort, { column: null, direction: 'asc' }) })
    const expand = useVModel(props, 'expand', emit, {
      passive: true,
      defaultValue: defu({}, props.expand, {
        openedRows: [],
        row: null
      })
    })

    const retriggerSlot = ref(null)

    const savedSort = { column: sort.value.column, direction: null }

    const rows = computed(() => {
      if (!sort.value?.column || props.sortMode === 'manual') {
        return props.rows
      }

      const { column, direction } = sort.value

      return props.rows.slice().sort((a, b) => {
        const aValue = get(a, column)
        const bValue = get(b, column)

        const sort = columns.value.find(col => col.key === column)?.sort ?? defaultSort

        return sort(aValue, bValue, direction)
      })
    })

    const selected = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const totalRows = computed(() => props.rows.length)

    const countCheckedRow = computed(() => {
      const selectedData = getStringifiedSet(selected.value)
      const rowsData = getStringifiedSet(props.rows)

      return Array.from(selectedData).filter(item => rowsData.has(item)).length
    })

    const indeterminate = computed(() => {
      if (!selected.value || !props.rows) return false
      return countCheckedRow.value > 0 && countCheckedRow.value < totalRows.value
    })

    const isAllRowChecked = computed(() => countCheckedRow.value === totalRows.value)

    const emptyState = computed(() => {
      if (props.emptyState === null) return null
      return { ...ui.value.default.emptyState, ...props.emptyState }
    })

    const loadingState = computed(() => {
      if (props.loadingState === null) return null
      return { ...ui.value.default.loadingState, ...props.loadingState }
    })

    function compare(a: any, z: any) {
      if (typeof props.by === 'string') {
        const accesorFn = accessor(props.by)
        return accesorFn(a) === accesorFn(z)
      }
      return props.by(a, z)
    }

    function isSelected(row: TableRow) {
      if (!props.modelValue) {
        return false
      }

      return selected.value.some(item => compare(toRaw(item), toRaw(row)))
    }

    function onSort(column: { key: string, direction?: 'asc' | 'desc' }) {
      if (sort.value.column === column.key) {
        const direction = !column.direction || column.direction === 'asc' ? 'desc' : 'asc'

        if (sort.value.direction === direction) {
          sort.value = defu({}, savedSort, { column: null, direction: 'asc' })
        } else {
          sort.value = { column: sort.value.column, direction: sort.value.direction === 'asc' ? 'desc' : 'asc' }
        }
      } else {
        sort.value = { column: column.key, direction: column.direction || 'asc' }
      }
    }

    function onSelect(row: TableRow) {
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) {
        return
      }

      if (!$attrs.onSelect) {
        return
      }

      // @ts-ignore
      $attrs.onSelect(row)
    }

    function onContextmenu(event, row) {
      if (!$attrs.onContextmenu) {
        return
      }

      // @ts-ignore
      $attrs.onContextmenu(event, row)
    }

    function selectAllRows() {
      // Create a new array to ensure reactivity
      const newSelected = [...selected.value]

      // If the row is not already selected, add it to the newSelected array
      props.rows.forEach((row) => {
        if (!isSelected(row)) {
          newSelected.push(row)
        }
      })

      // Reassign the array to trigger Vue's reactivity
      selected.value = newSelected
    }

    function onChange(checked: boolean) {
      if (checked) {
        selectAllRows()
      } else {
        selected.value = []
      }
      emit('select:all', checked)
    }

    function onChangeCheckbox(checked: boolean, row: TableRow) {
      if (checked) {
        selected.value = props.singleSelect ? [row] : [...selected.value, row]
      } else {
        const index = selected.value.findIndex(item => compare(item, row))
        selected.value.splice(index, 1)
      }
    }

    function getRowData(row: TableRow, rowKey: string | string[], defaultValue: any = '') {
      return get(row, rowKey, defaultValue)
    }

    function isExpanded(row: TableRow) {
      return expand.value?.openedRows ? expand.value.openedRows.some(openedRow => compare(openedRow, row)) : false
    }

    function shouldRenderColumnInFirstPlace(index: number, key: string) {
      if (!props.columns) {
        return index === 0
      }
      return index === 0 && !props.columns.find(col => col.key === key)
    }

    function toggleOpened(row: TableRow) {
      expand.value = {
        openedRows: isExpanded(row) ? expand.value.openedRows.filter(v => !compare(v, row)) : props.multipleExpand ? [...expand.value.openedRows, row] : [row],
        row
      }
    }

    function getAriaSort(column: TableColumn): AriaAttributes['aria-sort'] {
      if (!column.sortable) {
        return undefined
      }

      if (sort.value.column !== column.key) {
        return 'none'
      }

      if (sort.value.direction === 'asc') {
        return 'ascending'
      }

      if (sort.value.direction === 'desc') {
        return 'descending'
      }

      return undefined
    }

    watch(rows, () => {
      retriggerSlot.value = new Date()
    }, {
      deep: true
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
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
      isAllRowChecked,
      onChangeCheckbox,
      isSelected,
      onSort,
      onSelect,
      onContextmenu,
      onChange,
      getRowData,
      toggleOpened,
      getAriaSort,
      isExpanded,
      shouldRenderColumnInFirstPlace,
      retriggerSlot
    }
  }
})
</script>
