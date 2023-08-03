<template>
  <label :class="[ui.wrapper]">
    <div v-if="label" :class="[ui.label.wrapper, ui.size[size]]">
      <p :class="[ui.label.base, required ? ui.label.required : '']">{{ label }}</p>
      <span v-if="hint" :class="[ui.hint]">{{ hint }}</span>
    </div>
    <p v-if="description" :class="[ui.description, ui.size[size]]">{{ description }}</p>
    <div :class="[label ? ui.container : '']">
      <slot v-bind="{ error: errorMessage }" />
      <p v-if="errorMessage" :class="[ui.error, ui.size[size]]">{{ errorMessage }}</p>
      <p v-else-if="help" :class="[ui.help, ui.size[size]]">{{ help }}</p>
    </div>
  </label>
</template>

<script lang="ts">
import { computed, defineComponent, provide, inject } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import type { FormError } from '../../types'

// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
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
      default: () => appConfig.ui.formGroup
    }
  },
  setup (props) {
    const appConfig = useAppConfig()
    const ui = computed<Partial<typeof appConfig.ui.formGroup>>(() => defu({}, props.ui, appConfig.ui.formGroup))

    const formErrors = inject<Ref<FormError[]> | null>('form-errors', null)
    const errorMessage = computed(() => {
      return props.error && typeof props.error === 'string'
        ? props.error
        : formErrors?.value?.find((error) => error.path === props.name)?.message
    })

    const size = computed(() => props.size ?? appConfig.ui.input.default.size)
    provide('form-group', {
      size,
      name: computed(() => props.name),
      error: errorMessage
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      size,
      errorMessage
    }
  }
})
</script>
