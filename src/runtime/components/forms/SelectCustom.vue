<template>
  <Listbox
    v-slot="{ open }"
    :model-value="modelValue"
    :multiple="multiple"
    as="div"
    :class="wrapperClass"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <input :value="modelValue" :required="required" class="absolute inset-0 w-px opacity-0 cursor-default" tabindex="-1">

    <ListboxButton ref="trigger" as="div">
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
    </ListboxButton>

    <div v-if="open" ref="container" :class="listContainerClass">
      <transition appear leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions static :class="listBaseClass">
          <ListboxOption
            v-for="(option, index) in options"
            v-slot="{ active, selected, disabled }"
            :key="index"
            as="template"
            :value="option"
            :disabled="option.disabled"
          >
            <li :class="resolveOptionClass({ active, disabled })">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                <slot name="option" :option="option" :active="active" :selected="selected">
                  {{ option[textAttribute] }}
                </slot>
              </span>

              <span v-if="selected" :class="resolveOptionIconClass({ active })">
                <Icon :name="listOptionIcon" :class="listOptionIconSizeClass" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
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
  listOptionBaseClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.base
  },
  listOptionActiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.active
  },
  listOptionInactiveClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.inactive
  },
  listOptionDisabledClass: {
    type: String,
    default: () => $ui.selectCustom.list.option.disabled
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

const iconWrapperClass = classNames(
  $ui.selectCustom.icon.trailing.wrapper
)

function resolveOptionClass ({ active, disabled }: { active: boolean, disabled: boolean }) {
  return classNames(
    props.listOptionBaseClass,
    active ? props.listOptionActiveClass : props.listOptionInactiveClass,
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
