<template>
  <div :class="ui.wrapper">
    <select
      :id="inputId"
      :name="name"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
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
import { computed, toRef, defineComponent } from 'vue'
import type { PropType, ComputedRef } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import { useUI } from '../../composables/useUI'
import { useFormGroup } from '../../composables/useFormGroup'
import { mergeConfig, get } from '../../utils'
import { useInjectButtonGroup } from '../../composables/useButtonGroup'
import type { SelectSize, SelectColor, SelectVariant, Strategy, DeepPartial } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { select } from '#ui/ui.config'

const config = mergeConfig<typeof select>(appConfig.ui.strategy, appConfig.ui.select, select)

export default defineComponent({
  components: {
    UIcon
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object] as PropType<string | number | object | null>,
      default: ''
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
      default: () => config.default.trailingIcon
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
      type: String as PropType<SelectSize>,
      default: null,
      validator(value: string) {
        return Object.keys(config.size).includes(value)
      }
    },
    color: {
      type: String as PropType<SelectColor>,
      default: () => config.default.color,
      validator(value: string) {
        return [...appConfig.ui.colors, ...Object.keys(config.color)].includes(value)
      }
    },
    variant: {
      type: String as PropType<SelectVariant>,
      default: () => config.default.variant,
      validator(value: string) {
        return [
          ...Object.keys(config.variant),
          ...Object.values(config.color).flatMap(value => Object.keys(value))
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
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const { ui, attrs } = useUI('select', toRef(props, 'ui'), config, toRef(props, 'class'))

    const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props })

    const { emitFormChange, inputId, color, size: sizeFormGroup, name } = useFormGroup(props, config)

    const size = computed(() => sizeButtonGroup.value ?? sizeFormGroup.value)

    const onInput = (event: Event) => {
      emit('update:modelValue', (event.target as HTMLInputElement).value)
    }

    const onChange = (event: Event) => {
      emit('change', (event.target as HTMLInputElement).value)
      emitFormChange()
    }

    const guessOptionValue = (option: any) => {
      return get(option, props.valueAttribute, '')
    }

    const guessOptionText = (option: any) => {
      return get(option, props.optionAttribute, '')
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

    const selectClass = computed(() => {
      const variant = ui.value.color?.[color.value as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return twMerge(twJoin(
        ui.value.base,
        ui.value.form,
        rounded.value,
        ui.value.size[size.value],
        props.padded ? ui.value.padding[size.value] : 'p-0',
        variant?.replaceAll('{color}', color.value),
        (isLeading.value || slots.leading) && ui.value.leading.padding[size.value],
        (isTrailing.value || slots.trailing) && ui.value.trailing.padding[size.value]
      ), props.placeholder && !props.modelValue && ui.value.placeholder, props.selectClass)
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
      normalizedOptionsWithPlaceholder,
      normalizedValue,
      isLeading,
      isTrailing,
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

<style scoped>
.form-select {
  background-image: none;
}
</style>
