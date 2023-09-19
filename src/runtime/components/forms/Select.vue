<template>
  <div :class="wrapperClass">
    <select
      :name="name"
      :value="modelValue"
      :required="required"
      :disabled="disabled || loading"
      class="form-select"
      :class="selectClass"
      v-bind="attrs"
      @input="onInput"
      @change="onChange"
    >
      <template v-for="(option, index) in normalizedOptionsWithPlaceholder">
        <optgroup
          v-if="option.children"
          :key="`${option[valueAttribute]}-optgroup-${index}`"
          :value="option[valueAttribute]"
          :label="option[optionAttribute]"
        >
          <option
            v-for="(childOption, index2) in option.children"
            :key="`${childOption[valueAttribute]}-${index}-${index2}`"
            :value="childOption[valueAttribute]"
            :selected="childOption[valueAttribute] === normalizedValue"
            :disabled="childOption.disabled"
            v-text="childOption[optionAttribute]"
          />
        </optgroup>
        <option
          v-else
          :key="`${option[valueAttribute]}-${index}`"
          :value="option[valueAttribute]"
          :selected="option[valueAttribute] === normalizedValue"
          :disabled="option.disabled"
          v-text="option[optionAttribute]"
        />
      </template>
    </select>

    <span v-if="(isLeading && leadingIconName) || $slots.leading" :class="leadingWrapperIconClass">
      <slot name="leading" :disabled="disabled" :loading="loading">
        <UIcon :name="leadingIconName" :class="leadingIconClass" />
      </slot>
    </span>

    <span v-if="(isTrailing && trailingIconName) || $slots.trailing" :class="trailingWrapperIconClass">
      <slot name="trailing" :disabled="disabled" :loading="loading">
        <UIcon :name="trailingIconName" :class="trailingIconClass" aria-hidden="true" />
      </slot>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType, ComputedRef } from 'vue'
import { get, omit } from '../../utils/lodash'
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
      type: [String, Number, Object],
      default: ''
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
      default: () => appConfig.ui.select.default.trailingIcon
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
    options: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: () => appConfig.ui.select.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.select.size).includes(value)
      }
    },
    color: {
      type: String,
      default: () => appConfig.ui.select.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, ...Object.keys(appConfig.ui.select.color)].includes(value)
      }
    },
    variant: {
      type: String,
      default: () => appConfig.ui.select.default.variant,
      validator (value: string) {
        return [
          ...Object.keys(appConfig.ui.select.variant),
          ...Object.values(appConfig.ui.select.color).flatMap(value => Object.keys(value))
        ].includes(value)
      }
    },
    optionAttribute: {
      type: String,
      default: 'label'
    },
    valueAttribute: {
      type: String,
      default: 'value'
    },
    selectClass: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.select>>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit, attrs, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.select>>(() => defuTwMerge({}, props.ui, appConfig.ui.select))

    const { emitFormChange, formGroup } = useFormGroup()
    const color = computed(() => formGroup?.error?.value ? 'red' : props.color)
    const size = computed(() => formGroup?.size?.value ?? props.size)


    const onInput = (event: InputEvent) => {
      emit('update:modelValue', (event.target as HTMLInputElement).value)
    }

    const onChange = (event: Event) => {
      emitFormChange()
      emit('change', event)
    }

    const guessOptionValue = (option: any) => {
      return get(option, props.valueAttribute, get(option, props.optionAttribute))
    }

    const guessOptionText = (option: any) => {
      return get(option, props.optionAttribute, get(option, props.valueAttribute))
    }

    const normalizeOption = (option: any) => {
      if (['string', 'number', 'boolean'].includes(typeof option)) {
        return {
          [props.valueAttribute]: option,
          [props.optionAttribute]: option
        }
      }

      return {
        ...option,
        [props.valueAttribute]: guessOptionValue(option),
        [props.optionAttribute]: guessOptionText(option)
      }
    }

    const normalizedOptions = computed(() => {
      return props.options.map(option => normalizeOption(option))
    })

    const normalizedOptionsWithPlaceholder: ComputedRef<{ disabled?: boolean, children: { disabled?: boolean }[] }[]> = computed(() => {
      if (!props.placeholder) {
        return normalizedOptions.value
      }

      return [
        {
          [props.valueAttribute]: '',
          [props.optionAttribute]: props.placeholder,
          disabled: true
        },
        ...normalizedOptions.value
      ]
    })

    const normalizedValue = computed(() => {
      const normalizeModelValue = normalizeOption(props.modelValue)
      const foundOption = normalizedOptionsWithPlaceholder.value.find(option => option[props.valueAttribute] === normalizeModelValue[props.valueAttribute])
      if (!foundOption) {
        return ''
      }

      return foundOption[props.valueAttribute]
    })

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    const selectClass = computed(() => {
      const variant = ui.value.color?.[color.value as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.rounded,
        ui.value.size[size.value],
        props.padded ? ui.value.padding[size.value] : 'p-0',
        variant?.replaceAll('{color}', color.value),
        (isLeading.value || slots.leading) && ui.value.leading.padding[size.value],
        (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]
      ), props.selectClass)
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
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      normalizedOptionsWithPlaceholder,
      normalizedValue,
      isLeading,
      isTrailing,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      selectClass,
      leadingIconName,
      leadingIconClass,
      leadingWrapperIconClass,
      trailingIconName,
      trailingIconClass,
      trailingWrapperIconClass,
      onInput,
      onChange
    }
  }
})
</script>
