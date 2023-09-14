<template>
  <div :class="wrapperClass" v-bind="attrs">
    <div v-if="label" :class="[ui.label.wrapper, size]">
      <label :for="labelFor" :class="[ui.label.base, required ? ui.label.required : '']">{{ label }}</label>
      <span v-if="hint" :class="[ui.hint]">{{ hint }}</span>
    </div>
    <p v-if="description" :class="[ui.description, size]">
      {{ description }}
    </p>
    <div :class="[label ? ui.container : '']">
      <slot v-bind="{ error }" />
      <p v-if="typeof error === 'string' && error" :class="[ui.error, size]">
        {{ error }}
      </p>
      <p v-else-if="help" :class="[ui.help, size]">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, inject } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-es'
import { twMerge } from 'tailwind-merge'
import type { FormError } from '../../types/form'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

let increment = 0

export default defineComponent({
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null,
      validator (value: string) {
        return Object.keys(appConfig.ui.formGroup.size).includes(value)
      }
    },
    label: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: null
    },
    error: {
      type: [String, Boolean],
      default: null
    },
    hint: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.formGroup>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.formGroup>>(() => defuTwMerge({}, props.ui, appConfig.ui.formGroup))

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    const formErrors = inject<Ref<FormError[]> | null>('form-errors', null)

    const error = computed(() => {
      return (props.error && typeof props.error === 'string') || typeof props.error === 'boolean'
        ? props.error
        : formErrors?.value?.find((error) => error.path === props.name)?.message
    })

    const size = computed(() => ui.value.size[props.size ?? appConfig.ui.input.default.size])

    const labelFor = `label-for-${increment = increment < 1000000 ? increment + 1 : 0}`

    provide('form-group', {
      error,
      labelFor,
      name: computed(() => props.name),
      size: computed(() => props.size)
    })

    return {
      labelFor,
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      wrapperClass,
      // eslint-disable-next-line vue/no-dupe-keys
      size,
      // eslint-disable-next-line vue/no-dupe-keys
      error
    }
  }
})
</script>
