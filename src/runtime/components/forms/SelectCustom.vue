<template>
  <Combobox
    v-slot="{ open }"
    :model-value="modelValue"
    :multiple="multiple"
    :nullable="nullable"
    as="div"
    :class="wrapperClass"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <input :value="modelValue" :required="required" class="absolute inset-0 w-px opacity-0 cursor-default" tabindex="-1">

    <ComboboxButton ref="trigger" as="div">
      <slot :open="open">
        <button :class="selectCustomClass">
          <slot name="label">
            <span v-if="modelValue" class="block truncate">{{ modelValue[textAttribute] }}</span>
            <span v-else class="block truncate u-text-gray-400">{{ placeholder }}</span>
          </slot>
          <slot name="icon">
            <span :class="iconWrapperClass">
              <Icon :name="icon" :class="iconClass" aria-hidden="true" />
            </span>
          </slot>
        </button>
      </slot>
    </ComboboxButton>

    <div v-if="open" ref="container" :class="listContainerClass">
      <transition appear leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ComboboxOptions static :class="listBaseClass">
          <ComboboxInput
            v-if="searchable"
            :display-value="() => query"
            name="q"
            placeholder="Search..."
            autofocus
            autocomplete="off"
            :class="listInputClass"
            @change="query = $event.target.value"
          />
          <ComboboxOption
            v-for="(option, index) in filteredOptions"
            v-slot="{ active, selected, disabled }"
            :key="index"
            as="template"
            :value="option"
            :disabled="option.disabled"
          >
            <li :class="resolveOptionClass({ active, selected, disabled })">
              <div :class="listOptionContainerClass">
                <slot name="option" :option="option" :active="active" :selected="selected">
                  <span class="block truncate">{{ option[textAttribute] }}</span>
                </slot>
              </div>

              <span v-if="selected" :class="resolveOptionIconClass({ active })">
                <Icon :name="listOptionIcon" :class="listOptionIconSizeClass" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>

          <ComboboxOption v-if="queryOption" v-slot="{ active, selected }" :value="queryOption" as="template">
            <li :class="resolveOptionClass({ active, selected })">
              <div :class="listOptionContainerClass">
                <slot name="option-create" :option="queryOption" :active="active" :selected="selected">
                  <span class="block truncate">Create "{{ queryOption[textAttribute] }}"</span>
                </slot>
              </div>
            </li>
          </ComboboxOption>
          <p v-else-if="searchable && query" :class="listOptionEmptyClass">
            <slot name="option-empty" :query="query">
              No results found for "{{ query }}".
            </slot>
          </p>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  ComboboxInput
} from '@headlessui/vue'
import Icon from '../elements/Icon'
import { classNames, usePopper } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Array],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placement: {
    type: String,
    default: 'bottom-end',
    validator: (value: string) => {
      return ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'].includes(value)
    }
  },
  strategy: {
    type: String,
    default: 'absolute',
    validator: (value: string) => {
      return ['absolute', 'fixed'].includes(value)
    }
  },
  required: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  nullable: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  creatable: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return Object.keys($ui.selectCustom.size).includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default: () => $ui.selectCustom.wrapper
  },
  baseClass: {
    type: String,
    default: () => $ui.selectCustom.base
  },
  icon: {
    type: String,
    default: () => 'heroicons-solid:selector'
  },
  iconBaseClass: {
    type: String,
    default: () => $ui.selectCustom.icon.base
  },
  customClass: {
    type: String,
    default: null
  },
  appearance: {
    type: String,
    default: 'default',
    validator (value: string) {
      return Object.keys($ui.selectCustom.appearance).includes(value)
    }
  },
  listBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.base
  },
  listContainerClass: {
    type: String,
    default: () => $ui.selectCustom.list.container
  },
  listInputClass: {
    type: String,
    default: () => $ui.selectCustom.list.input
  },
  listOptionBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.base
  },
  listOptionContainerClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.container
  },
  listOptionActiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.active
  },
  listOptionInactiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.inactive
  },
  listOptionSelectedClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.selected
  },
  listOptionUnselectedClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.unselected
  },
  listOptionDisabledClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.disabled
  },
  listOptionEmptyClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.empty
  },
  listOptionIcon: {
    type: String,
    default: () => 'heroicons-solid:check'
  },
  listOptionIconBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.base
  },
  listOptionIconActiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.active
  },
  listOptionIconInactiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.inactive
  },
  listOptionIconSizeClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.icon.size
  },
  textAttribute: {
    type: String,
    default: 'text'
  },
  searchAttributes: {
    type: Array,
    default: null
  }
})

defineEmits(['update:modelValue'])

const [trigger, container] = usePopper({
  placement: props.placement,
  strategy: props.strategy,
  modifiers: [{
    name: 'offset',
    options: {
      offset: 0
    }
  },
  {
    name: 'computeStyles',
    options: {
      gpuAcceleration: false,
      adaptive: false
    }
  },
  {
    name: 'preventOverflow',
    options: {
      padding: 8
    }
  }]
})

const query = ref('')

const selectCustomClass = computed(() => {
  return classNames(
    props.baseClass,
    $ui.selectCustom.size[props.size],
    $ui.selectCustom.spacing[props.size],
    $ui.selectCustom.appearance[props.appearance],
    $ui.selectCustom.trailing.spacing[props.size],
    props.customClass
  )
})

const iconClass = computed(() => {
  return classNames(
    props.iconBaseClass,
    $ui.selectCustom.icon.size[props.size],
    'mr-2'
  )
})

const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((option: any) => {
      return (props.searchAttributes?.length ? props.searchAttributes : [props.textAttribute]).some((searchAttribute: any) => {
        return option[searchAttribute] && option[searchAttribute].search(new RegExp(query.value, 'i')) !== -1
      })
    })
)

const queryOption = computed(() => {
  if (!props.creatable) {
    return null
  }
  if (!query.value) {
    return null
  }

  return query.value === '' ? null : { [props.textAttribute]: query.value }
})

const iconWrapperClass = classNames(
  $ui.selectCustom.icon.trailing.wrapper
)

function resolveOptionClass ({ active, selected, disabled }: { active: boolean, selected: boolean, disabled?: boolean }) {
  return classNames(
    props.listOptionBaseClass,
    active ? props.listOptionActiveClass : props.listOptionInactiveClass,
    selected ? props.listOptionSelectedClass : props.listOptionUnselectedClass,
    disabled && props.listOptionDisabledClass
  )
}

function resolveOptionIconClass ({ active }: { active: boolean }) {
  return classNames(
    props.listOptionIconBaseClass,
    active ? props.listOptionIconActiveClass : props.listOptionIconInactiveClass
  )
}
</script>

<script lang="ts">
export default { name: 'USelectCustom' }
</script>
