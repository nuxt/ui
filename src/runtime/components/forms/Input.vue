<template>
  <div :class="wrapperClass">
    <input
      :id="name"
      ref="input"
      :name="name"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      :class="inputClass"
      @input="onInput($event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <slot />
    <div v-if="isLeading" :class="iconLeadingWrapperClass">
      <Icon :name="iconName" :class="iconClass" />
    </div>
    <div v-if="isTrailing" :class="iconTrailingWrapperClass">
      <Icon :name="iconName" :class="iconClass" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue'
import { ref, computed, onMounted } from 'vue'
import { classNames } from '../../utils'
import $ui from '#build/ui'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: null
  },
  spellcheck: {
    type: Boolean,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  loadingIcon: {
    type: String,
    default: () => $ui.input.icon.loading
  },
  trailing: {
    type: Boolean,
    default: false
  },
  leading: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator (value: string) {
      return Object.keys($ui.input.size).includes(value)
    }
  },
  wrapperClass: {
    type: String,
    default: () => $ui.input.wrapper
  },
  baseClass: {
    type: String,
    default: () => $ui.input.base
  },
  iconBaseClass: {
    type: String,
    default: () => $ui.input.icon.base
  },
  customClass: {
    type: String,
    default: null
  },
  appearance: {
    type: String,
    default: 'default',
    validator (value: string) {
      return Object.keys($ui.input.appearance).includes(value)
    }
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const input: Ref<HTMLInputElement> = ref(null)

const autoFocus = () => {
  if (props.autofocus) {
    input.value.focus()
  }
}

const onInput = (value: string) => {
  emit('update:modelValue', value)
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, 100)
})

const isLeading = computed(() => {
  return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing)
})

const isTrailing = computed(() => {
  return (props.icon && props.trailing) || (props.loading && props.trailing)
})

const inputClass = computed(() => {
  return classNames(
    props.baseClass,
    $ui.input.size[props.size],
    $ui.input.spacing[props.size],
    $ui.input.appearance[props.appearance],
    isLeading.value && $ui.input.leading.spacing[props.size],
    isTrailing.value && $ui.input.trailing.spacing[props.size],
    props.customClass
  )
})

const iconName = computed(() => {
  if (props.loading) {
    return props.loadingIcon
  }

  return props.icon
})

const iconClass = computed(() => {
  return classNames(
    props.iconBaseClass,
    $ui.input.icon.size[props.size],
    isLeading.value && $ui.input.icon.leading.spacing[props.size],
    isTrailing.value && $ui.input.icon.trailing.spacing[props.size],
    props.loading && 'animate-spin'
  )
})

const iconLeadingWrapperClass = $ui.input.icon.leading.wrapper
const iconTrailingWrapperClass = $ui.input.icon.trailing.wrapper
</script>

<script lang="ts">
export default { name: 'UInput' }
</script>
