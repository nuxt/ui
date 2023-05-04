<template>
  <div :class="ui.wrapper">
    <div v-if="label || $slots.label" :class="ui.labelWrapper">
      <label :for="name" :class="ui.label">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" :class="ui.required">*</span>
      </label>
      <span v-if="$slots.hint || hint" :class="ui.hint">
        <slot name="hint">{{ hint }}</slot>
      </span>
    </div>
    <p v-if="description" :class="ui.description">
      {{ description }}
    </p>
    <div :class="!!label && ui.container">
      <slot />
      <p v-if="help" :class="ui.help">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
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
    hint: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.inputGroup>>,
      default: () => appConfig.ui.inputGroup
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.inputGroup>>(() => defu({}, props.ui, appConfig.ui.inputGroup))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui
    }
  }
})
</script>
