<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div v-if="label" :class="[ui.label.wrapper, size]">
      <label :for="inputId" :class="[ui.label.base, required ? ui.label.required : '']">{{ label }}</label>
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
import { computed, defineComponent, provide, inject, ref } from 'vue'
import type { Ref, PropType } from 'vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { FormError, InjectedFormGroupValue, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { formGroup } from '#ui/ui.config'
import { uid } from '../../utils/uid'

const config = mergeConfig<typeof formGroup>(appConfig.ui.strategy, appConfig.ui.formGroup, formGroup)

export default defineComponent({
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: null
    },
    size: {
      type: String as PropType<keyof typeof config.size>,
      default: null,
      validator (value: string) {
        return Object.keys(config.size).includes(value)
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
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('formGroup', props.ui, config, { mergeWrapper: true })

    const formErrors = inject<Ref<FormError[]> | null>('form-errors', null)

    const error = computed(() => {
      return (props.error && typeof props.error === 'string') || typeof props.error === 'boolean'
        ? props.error
        : formErrors?.value?.find((error) => error.path === props.name)?.message
    })

    const size = computed(() => ui.value.size[props.size ?? config.default.size])
    const inputId = ref(uid())

    provide<InjectedFormGroupValue>('form-group', {
      error,
      inputId,
      name: computed(() => props.name),
      size: computed(() => props.size)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      inputId,
      // eslint-disable-next-line vue/no-dupe-keys
      size,
      // eslint-disable-next-line vue/no-dupe-keys
      error
    }
  }
})
</script>
