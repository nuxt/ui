<template>
  <div :class="wrapperClass" v-bind="attrs">
    <label>
      <div v-if="label || $slots.label" :class="[ui.label.wrapper, size]">
        <p :class="[ui.label.base, required ? ui.label.required : '']">
          <slot v-if="$slots.label" name="label" v-bind="{ error, label, name, hint, description, help }" />
          <template v-else>{{ label }}</template>
        </p>
        <span v-if="hint || $slots.hint" :class="[ui.hint]">
          <slot v-if="$slots.hint" name="hint" v-bind="{ error, label, name, hint, description, help }" />
          <template v-else>{{ hint }}</template>
        </span>
      </div>

      <p v-if="description || $slots.description" :class="[ui.description, size]">
        <slot v-if="$slots.description" name="description" v-bind="{ error, label, name, hint, description, help }" />
        <template v-else>{{ description }}</template>
      </p>

      <div :class="[label ? ui.container : '']" @click="$event.preventDefault()">
        <slot v-bind="{ error }" />

        <p v-if="error && typeof error !== 'boolean'" :class="[ui.error, size]">
          <slot v-if="$slots.error" name="error" v-bind="{ error, label, name, hint, description, help }" />
          <template v-else>{{ error }}</template>
        </p>
        <p v-else-if="help || $slots.help" :class="[ui.help, size]">
          <slot v-if="$slots.help" name="help" v-bind="{ error, label, name, hint, description, help }" />
          <template v-else>{{ help }}</template>
        </p>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide, inject } from 'vue'
import type { PropType } from 'vue'
import { omit } from '../../utils/lodash'
import { twMerge } from 'tailwind-merge'
import type { FormError } from '../../types/form'
import { defuTwMerge } from '../../utils'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

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

    provide('form-group', {
      error,
      name: computed(() => props.name),
      size: computed(() => props.size)
    })

    return {
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
