<template>
  <component
    :is="$attrs.onSubmit ? 'form': 'div'"
    :class="[ui.base, ui.rounded, ui.divide, ui.shadow, ui.background]"
    v-bind="$attrs"
  >
    <div v-if="$slots.header" :class="[ui.header.spacing, ui.header.background]">
      <slot name="header" />
    </div>
    <div :class="[ui.body.spacing, ui.body.background]">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="[ui.footer.spacing, ui.footer.background]">
      <slot name="footer" />
    </div>
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
// TODO: Remove
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.card>>,
      default: () => appConfig.ui.card
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.card>>(() => defu({}, props.ui, appConfig.ui.card))

    return {
      ui
    }
  }
})
</script>
