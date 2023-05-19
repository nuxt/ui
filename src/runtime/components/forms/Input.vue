<template>
  <div :class="ui.wrapper">
    <input
      :id="name"
      ref="input"
      :name="name"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :spellcheck="spellcheck"
      :class="inputClass"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <slot />
    <div v-if="isLeading && leadingIconName" :class="leadingIconClass">
      <UIcon :name="leadingIconName" :class="iconClass" />
    </div>
    <div v-if="isTrailing && trailingIconName" :class="trailingIconClass">
      <UIcon :name="trailingIconName" :class="iconClass" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import UIcon from '../elements/Icon.vue'
import { classNames } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UIcon
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
      type: Boolean,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => appConfig.ui.input.default.loadingIcon
    },
    leadingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: () => appConfig.ui.input.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.input.size).includes(value)
      }
    },
    appearance: {
      type: String,
      default: () => appConfig.ui.input.default.appearance,
      validator (value: string) {
        return Object.keys(appConfig.ui.input.appearance).includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.input>>,
      default: () => appConfig.ui.input
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.input>>(() => defu({}, props.ui, appConfig.ui.input))

    const input = ref<HTMLInputElement | null>(null)

    const autoFocus = () => {
      if (props.autofocus) {
        input.value?.focus()
      }
    }

    const onInput = (event: InputEvent) => {
      emit('update:modelValue', (event.target as any).value)
    }

    onMounted(() => {
      setTimeout(() => {
        autoFocus()
      }, 100)
    })

    const inputClass = computed(() => {
      return classNames(
        ui.value.base,
        ui.value.size[props.size],
        ui.value.padding[props.size],
        ui.value.appearance[props.appearance],
        isLeading.value && ui.value.leading.padding[props.size],
        isTrailing.value && ui.value.trailing.padding[props.size],
        ui.value.custom
      )
    })

    const isLeading = computed(() => {
      return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon
    })

    const isTrailing = computed(() => {
      return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon
    })

    const leadingIconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon
      }

      return props.leadingIcon || props.icon
    })

    const trailingIconName = computed(() => {
      if (props.loading && !isLeading.value) {
        return props.loadingIcon
      }

      return props.trailingIcon || props.icon
    })

    const iconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        ui.value.icon.size[props.size],
        props.loading && 'animate-spin'
      )
    })

    const leadingIconClass = computed(() => {
      return classNames(
        ui.value.icon.leading.wrapper,
        ui.value.icon.leading.padding[props.size]
      )
    })

    const trailingIconClass = computed(() => {
      return classNames(
        ui.value.icon.trailing.wrapper,
        ui.value.icon.trailing.padding[props.size]
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      input,
      isLeading,
      isTrailing,
      inputClass,
      iconClass,
      leadingIconName,
      leadingIconClass,
      trailingIconName,
      trailingIconClass,
      onInput
    }
  }
})
</script>
