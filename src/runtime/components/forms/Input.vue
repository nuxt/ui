<template>
  <div :class="wrapperClass">
    <input
      :id="labelFor"
      ref="input"
      :name="name"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      class="form-input"
      :class="inputClass"
      v-bind="attrs"
      @input="onInput"
      @blur="onBlur"
    >
    <slot />

    <span v-if="(isLeading && leadingIconName) || $slots.leading" :class="leadingWrapperIconClass">
      <slot name="leading" :disabled="disabled" :loading="loading">
        <UIcon :name="leadingIconName" :class="leadingIconClass" />
      </slot>
    </span>

    <span v-if="(isTrailing && trailingIconName) || $slots.trailing" :class="trailingWrapperIconClass">
      <slot name="trailing" :disabled="disabled" :loading="loading">
        <UIcon :name="trailingIconName" :class="trailingIconClass" />
      </slot>
    </span>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from '../../utils/lodash'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import { defuTwMerge } from '../../utils'
import { useFormGroup } from '../../composables/useFormGroup'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UIcon
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: null
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
    autofocus: {
      type: Boolean,
      default: false
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
    inputClass: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.input>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'blur'],
  setup (props, { emit, attrs, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.input>>(() => defuTwMerge({}, props.ui, appConfig.ui.input))

    const { emitFormBlur, emitFormInput, formGroup } = useFormGroup(props)
    const color = computed(() => formGroup?.error?.value ? 'red' : props.color)
    const size = computed(() => formGroup?.size?.value ?? props.size)
    const labelFor = formGroup?.labelFor

    const input = ref<HTMLInputElement | null>(null)

    const autoFocus = () => {
      if (props.autofocus) {
        input.value?.focus()
      }
    }

    const onInput = (event: InputEvent) => {
      emit('update:modelValue', (event.target as HTMLInputElement).value)
      emitFormInput()
    }

    const onBlur = (event: FocusEvent) => {
      emitFormBlur()
      emit('blur', event)
    }

    onMounted(() => {
      setTimeout(() => {
        autoFocus()
      }, 100)
    })

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    const inputClass = computed(() => {
      const variant = ui.value.color?.[color.value as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.rounded,
        ui.value.placeholder,
        ui.value.size[size.value],
        props.padded ? ui.value.padding[size.value] : 'p-0',
        variant?.replaceAll('{color}', color.value),
        (isLeading.value || slots.leading) && ui.value.leading.padding[size.value],
        (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]
      ), props.inputClass)
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
      return twJoin(
        ui.value.icon.leading.wrapper,
        ui.value.icon.leading.pointer,
        ui.value.icon.leading.padding[size.value]
      )
    })

    const leadingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll('{color}', color.value),
        ui.value.icon.size[size.value],
        props.loading && 'animate-spin'
      )
    })

    const trailingWrapperIconClass = computed(() => {
      return twJoin(
        ui.value.icon.trailing.wrapper,
        ui.value.icon.trailing.pointer,
        ui.value.icon.trailing.padding[size.value]
      )
    })

    const trailingIconClass = computed(() => {
      return twJoin(
        ui.value.icon.base,
        appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll('{color}', color.value),
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && 'animate-spin'
      )
    })

    return {
      labelFor,
      attrs: computed(() => omit(attrs, ['class', labelFor ? 'id' : null ])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      input,
      isLeading,
      isTrailing,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      onInput,
      onBlur
    }
  }
})
</script>
