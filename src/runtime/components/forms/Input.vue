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

    <div v-if="(isLeading && leadingIconName) || $slots.leading" :class="leadingWrapperIconClass">
      <slot name="leading" :disabled="disabled" :loading="loading">
        <UIcon :name="leadingIconName" :class="leadingIconClass" />
      </slot>
    </div>

    <div v-if="(isTrailing && trailingIconName) || $slots.trailing" :class="trailingWrapperIconClass">
      <slot name="trailing" :disabled="disabled" :loading="loading">
        <UIcon :name="trailingIconName" :class="trailingIconClass" />
      </slot>
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
      default: null
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
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: () => appConfig.ui.input.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.input.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.input.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.input.color)].includes(value)
      }
    },
    variant: {
      type: String,
      default: () => appConfig.ui.input.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(appConfig.ui.input.variant),
          ...Object.values(appConfig.ui.input.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.input>>,
      default: () => appConfig.ui.input
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit, slots }) {
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
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return classNames(
        ui.value.base,
        ui.value.rounded,
        ui.value.placeholder,
        ui.value.size[props.size],
        props.padded && ui.value.padding[props.size],
        variant?.replaceAll('{color}', props.color),
        (isLeading.value || slots.leading) && ui.value.leading.padding[props.size],
        (isTrailing.value || slots.trailing) && ui.value.trailing.padding[props.size],
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

    const leadingWrapperIconClass = computed(() => {
      return classNames(
        ui.value.icon.leading.wrapper,
        ui.value.icon.leading.padding[props.size],
        slots.leading && '!pointer-events-auto'
      )
    })

    const leadingIconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        appConfig.ui.colors.includes(props.color) && ui.value.icon.color.replaceAll('{color}', props.color),
        ui.value.icon.size[props.size],
        props.loading && 'animate-spin'
      )
    })

    const trailingWrapperIconClass = computed(() => {
      return classNames(
        ui.value.icon.trailing.wrapper,
        ui.value.icon.trailing.padding[props.size],
        slots.trailing && '!pointer-events-auto'
      )
    })

    const trailingIconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        appConfig.ui.colors.includes(props.color) && ui.value.icon.color.replaceAll('{color}', props.color),
        ui.value.icon.size[props.size],
        props.loading && !isLeading.value && 'animate-spin'
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      input,
      isLeading,
      isTrailing,
      inputClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      onInput
    }
  }
})
</script>
