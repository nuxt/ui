<template>
  <div :class="ui.wrapper">
    <div :class="[ui.base, ui.divide, ui.breakpoint]">
      <div :class="ui.thead">
        <ol :class="[ui.tr.base, ui.tr.heading]">
          <li v-if="modelValue" class="ps-4">
            <UCheckbox :checked="indeterminate || selected.length === rows.length" :indeterminate="indeterminate" @change="onChange" />
          </li>

          <li v-for="(column, index) in columns" :key="index" :class="[ui.th.base, ui.th.padding, ui.th.color, ui.th.font, ui.th.size, column.class]">
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
          </li>
        </ol>
      </div>

      <ol :class="ui.tbody">
        <li v-if="loadingState && loading">
          <div>
            <slot name="loading-state">
              <div :class="ui.loadingState.wrapper">
                <UIcon v-if="loadingState.icon" :name="loadingState.icon" :class="ui.loadingState.icon" aria-hidden="true" />
                <p :class="ui.loadingState.label">
                  {{ loadingState.label }}
                </p>
              </div>
            </slot>
          </div>
        </li>

        <li v-else-if="emptyState && !rows.length">
          <slot name="empty-state">
            <div :class="ui.emptyState.wrapper">
              <UIcon v-if="emptyState.icon" :name="emptyState.icon" :class="ui.emptyState.icon" aria-hidden="true" />
              <p :class="ui.emptyState.label">
                {{ emptyState.label }}
              </p>
            </div>
          </slot>
        </li>

        <template v-else>
          <li v-for="(row, index) in rows"
              :key="index"
              :class="[ui.tr.base, ui.tr.item, isSelected(row) && ui.tr.selected, $attrs.onSelect && ui.tr.active]" @click="() => onSelect(row)">
            <div v-if="modelValue" class="ps-4">
              <UCheckbox v-model="selected" :value="row" @click.stop />
            </div>

            <div v-for="(column, subIndex) in columns"
                 :key="subIndex"
                 :class="[ui.td.base, ui.td.padding, ui.td.color, ui.td.font, ui.td.size]">
              <slot :name="`${column.key}-data`" :column="column" :row="row" :index="index" :get-row-data="(defaultValue) => getRowData(row, column.key, defaultValue)">
                {{ getRowData(row, column.key) }}
              </slot>
            </div>
          </li>
        </template>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, toRaw } from 'vue'
import type { PropType } from 'vue'
import { capitalize, orderBy, omit, get } from 'lodash-es'
import { defu } from 'defu'
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
  props: {
    modelValue: {
      type: Array,
      default: null
    },
    by: {
      type: [String, Function],
      default: () => defaultComparator
    },
    items: {
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
      default: () => appConfig.ui.list.default.sortButton
    },
    sortAscIcon: {
      type: String,
      default: () => appConfig.ui.list.default.sortAscIcon
    },
    sortDescIcon: {
      type: String,
      default: () => appConfig.ui.list.default.sortDescIcon
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingState: {
      type: Object as PropType<{ icon: string, label: string }>,
      default: () => appConfig.ui.list.default.loadingState
    },
    emptyState: {
      type: Object as PropType<{ icon: string, label: string }>,
      default: () => appConfig.ui.list.default.emptyState
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.list>>,
      default: () => appConfig.ui.list
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit, attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.list>>(() => defu({}, props.ui, appConfig.ui.list))

    const columns = computed(() => props.columns ?? Object.keys(omit(props.items[0] ?? {}, ['click'])).map((key) => ({ key, label: capitalize(key), sortable: false })))

    const sort = ref(defu({}, props.sort, { column: null, direction: 'asc' }))

    const rows = computed(() => {
      if (!sort.value?.column) {
        return props.items
      }

      const { column, direction } = sort.value

      return orderBy(props.items, column, direction)
    })

    const selected = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const indeterminate = computed(() => selected.value && selected.value.length > 0 && selected.value.length < props.items.length)

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
      props.items.forEach((row) => {
        // If the row is already selected, don't select it again
        if (selected.value.some((item) => compare(toRaw(item), toRaw(row)))) {
          return
        }

        onSelect(row)
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
      onSort,
      onSelect,
      onChange,
      getRowData
    }
  }
})
</script>
