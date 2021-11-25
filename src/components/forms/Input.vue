<template>
  <div :class="wrapperClass">
    <div
      v-if="isLeading"
      class="absolute inset-y-0 left-0 flex items-center pointer-events-none"
    >
      <Icon
        :name="iconName"
        class="u-text-gray-400"
        :class="iconClass"
      />
    </div>
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
      :class="[baseClass, sizeClass, paddingClass, appearanceClass, customClass]"
      @input="onInput($event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <slot />
    <div
      v-if="isTrailing"
      class="absolute inset-y-0 right-0 flex items-center pointer-events-none"
    >
      <Icon
        :name="iconName"
        class="u-text-gray-400"
        :class="iconClass"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Icon from '../elements/Icon'
import { classNames } from '../../utils'
import $ui from '#build/ui'

export default {
  components: {
    Icon
  },
  props: {
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
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: 'heroicons-outline:refresh'
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
      validator (value) {
        return ['', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    wrapperClass: {
      type: String,
      default: 'relative'
    },
    baseClass: {
      type: String,
      default: () => $ui.input.base
    },
    customClass: {
      type: String,
      default: null
    },
    appearance: {
      type: String,
      default: 'default',
      validator (value) {
        return ['default', 'none'].includes(value)
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    const input = ref(null)

    const autoFocus = () => {
      if (props.autofocus) {
        input.value.focus()
      }
    }

    const onInput = (value) => {
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

    const sizeClass = computed(() => $ui.input.size[props.size])

    const appearanceClass = computed(() => $ui.input.appearance[props.appearance])

    const paddingClass = computed(() => {
      return classNames(
        $ui.input.padding[props.size],
        isLeading.value && $ui.input.leading[props.size],
        isTrailing.value && $ui.input.trailing[props.size]
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
        $ui.input.icon.size[props.size],
        isLeading.value && $ui.input.icon.leading[props.size],
        isTrailing.value && $ui.input.icon.trailing[props.size],
        props.loading && 'animate-spin'
      )
    })

    return {
      input,
      onInput,
      sizeClass,
      paddingClass,
      appearanceClass,
      iconClass,
      iconName,
      isLeading,
      isTrailing
    }
  }
}
</script>
