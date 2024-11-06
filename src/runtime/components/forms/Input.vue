<template>
  <div :class="(type === 'hidden') ? 'hidden' : ui.wrapper">
    <input
      :id="inputId"
      ref="input"
      :name="name"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
      v-bind="type === 'file' ? attrs : { ...attrs, value: modelValue }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
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
import { ref, computed, toRef, onMounted, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import { defu } from 'defu'
import UIcon from '../elements/Icon.vue'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig, looseToNumber } from '../../utils'
import { useInjectButtonGroup } from '../../composables/useButtonGroup'
import type { InputSize, InputColor, InputVariant, Strategy, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { input } from '#ui/ui.config'

const config = mergeConfig<typeof input>(appConfig.ui.strategy, appConfig.ui.input, input)

export default defineComponent({
  components: {
    UIcon
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number] as PropType<string | number | null>,
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
    autofocusDelay: {
      type: Number,
      default: 100
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => config.default.loadingIcon
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
      type: String as PropType<InputSize>,
      default: null,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<InputColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<InputVariant>,
      default: () => config.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    inputClass: {
      type: String,
      default: null
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    },
    modelModifiers: {
      type: Object as PropType<{ trim?: boolean, lazy?: boolean, number?: boolean, nullify?: boolean }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'blur', 'change'],
  setup(props, { emit, slots }) {
    const { ui, attrs } = useUI('input', toRef(props, 'ui'), config, toRef(props, 'class'))

    const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props })

    const { emitFormBlur, emitFormInput, size: sizeFormGroup, color, inputId, name } = useFormGroup(props, config)

    const size = computed(() => sizeButtonGroup.value ?? sizeFormGroup.value)

    const modelModifiers = ref(defu({}, props.modelModifiers, { trim: false, lazy: false, number: false, nullify: false }))

    const input = ref<HTMLInputElement | null>(null)

    const autoFocus = () => {
      if (props.autofocus) {
        input.value?.focus()
      }
    }

    // Custom function to handle the v-model properties
    const updateInput = (value: string) => {
      if (modelModifiers.value.trim) {
        value = value.trim()
      }

      if (modelModifiers.value.number || props.type === 'number') {
        value = looseToNumber(value)
      }

      if (modelModifiers.value.nullify) {
        value ||= null
      }

      emit('update:modelValue', value)
      emitFormInput()
    }

    const onInput = (event: Event) => {
      if (!modelModifiers.value.lazy) {
        updateInput((event.target as HTMLInputElement).value)
      }
    }

    const onChange = (event: Event) => {
      if (props.type === 'file') {
        const value = (event.target as HTMLInputElement).files
        emit('change', value)
      } else {
        const value = (event.target as HTMLInputElement).value
        emit('change', value)
        if (modelModifiers.value.lazy) {
          updateInput(value)
        }
        // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
        if (modelModifiers.value.trim) {
          (event.target as HTMLInputElement).value = value.trim()
        }
      }
    }

    const onBlur = (event: FocusEvent) => {
      emitFormBlur()
      emit('blur', event)
    }

    onMounted(() => {
      setTimeout(() => {
        autoFocus()
      }, props.autofocusDelay)
    })

    const inputClass = computed(() => {
      const variant = ui.value.color?.[color.value as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.form,
        rounded.value,
        ui.value.placeholder,
        props.type === 'file' && ui.value.file.base,
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
        color.value && appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll('{color}', color.value),
        ui.value.icon.size[size.value],
        props.loading && ui.value.icon.loading
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
        color.value && appConfig.ui.colors.includes(color.value) && ui.value.icon.color.replaceAll('{color}', color.value),
        ui.value.icon.size[size.value],
        props.loading && !isLeading.value && ui.value.icon.loading
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      name,
      inputId,
      input,
      isLeading,
      isTrailing,
      // eslint-disable-next-line vue/no-dupe-keys
      inputClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      onInput,
      onChange,
      onBlur
    }
  }
})
</script>
