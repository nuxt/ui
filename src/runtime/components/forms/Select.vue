<template>
  <div :class="ui.wrapper">
    <select
      :id="name"
      :name="name"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :class="selectClass"
      @input="onInput"
    >
      <template v-for="(option, index) in normalizedOptionsWithPlaceholder">
        <optgroup
          v-if="option.children"
          :key="`${option[valueAttribute]}-optgroup-${index}`"
          :value="option[valueAttribute]"
          :label="option[textAttribute]"
        >
          <option
            v-for="(childOption, index2) in option.children"
            :key="`${childOption[valueAttribute]}-${index}-${index2}`"
            :value="childOption[valueAttribute]"
            :selected="childOption[valueAttribute] === normalizedValue"
            :disabled="childOption.disabled"
            v-text="childOption[textAttribute]"
          />
        </optgroup>
        <option
          v-else
          :key="`${option[valueAttribute]}-${index}`"
          :value="option[valueAttribute]"
          :selected="option[valueAttribute] === normalizedValue"
          :disabled="option.disabled"
          v-text="option[textAttribute]"
        />
      </template>
    </select>

    <div v-if="icon" :class="leadingIconClass">
      <UIcon :name="icon" :class="iconClass" />
    </div>

    <span v-if="trailingIcon" :class="trailingIconClass">
      <UIcon :name="trailingIcon" :class="iconClass" aria-hidden="true" />
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType, ComputedRef } from 'vue'
import { get } from 'lodash-es'
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
    trailingIcon: {
      type: String,
      default: () => appConfig.ui.select.default.trailingIcon
    },
    options: {
      type: Array,
      default: () => []
    },
    padded: {
      type: Boolean,
      default: true
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
    textAttribute: {
      type: String,
      default: 'text'
    },
    valueAttribute: {
      type: String,
      default: 'value'
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.select>>,
      default: () => appConfig.ui.select
    }
  },
  emits: ['update:modelValue', 'focus', 'blur'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.select>>(() => defu({}, props.ui, appConfig.ui.select))

    const onInput = (event: InputEvent) => {
      emit('update:modelValue', (event.target as any).value)
    }

    const guessOptionValue = (option: any) => {
      return get(option, props.valueAttribute, get(option, props.textAttribute))
    }

    const guessOptionText = (option: any) => {
      return get(option, props.textAttribute, get(option, props.valueAttribute))
    }

    const normalizeOption = (option: any) => {
      if (['string', 'number', 'boolean'].includes(typeof option)) {
        return {
          [props.valueAttribute]: option,
          [props.textAttribute]: option
        }
      }

      return {
        ...option,
        [props.valueAttribute]: guessOptionValue(option),
        [props.textAttribute]: guessOptionText(option)
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
          [props.textAttribute]: props.placeholder,
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
      const variant = ui.value.color?.[props.color as string]?.[props.variant as string] || ui.value.variant[props.variant]

      return classNames(
        ui.value.base,
        ui.value.rounded,
        ui.value.size[props.size],
        props.padded && ui.value.padding[props.size],
        variant?.replaceAll('{color}', props.color),
        !!props.icon && ui.value.leading.padding[props.size],
        ui.value.trailing.padding[props.size],
        ui.value.custom
      )
    })

    const iconClass = computed(() => {
      return classNames(
        ui.value.icon.base,
        appConfig.ui.colors.includes(props.color) && ui.value.icon.color.replaceAll('{color}', props.color),
        ui.value.icon.size[props.size]
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
      normalizedOptionsWithPlaceholder,
      normalizedValue,
      selectClass,
      iconClass,
      leadingIconClass,
      trailingIconClass,
      onInput
    }
  }
})
</script>
