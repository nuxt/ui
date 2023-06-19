<template>
  <Popover v-slot="{ open, close }" :class="ui.wrapper">
    <Float v-bind="{ ...float, ...ui.transition }">
      <PopoverButton as="template" :disabled="disabled">
        <slot :open="open" :close="close" :disabled="disabled">
          <button :disabled="disabled">
            Open
          </button>
        </slot>
      </PopoverButton>

      <PopoverPanel :class="[ui.base, ui.background, ui.ring, ui.rounded, ui.shadow, ui.width]">
        <slot name="panel" :open="open" :close="close" />
      </PopoverPanel>
    </Float>
  </Popover>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Float, FloatReference, FloatContent, FloatProps } from '@headlessui-float/vue'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    Float,
    FloatReference,
    FloatContent,
    Popover,
    PopoverButton,
    PopoverPanel
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    float: {
      type: Object as PropType<FloatProps>,
      default: () => ({})
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.popover>>,
      default: () => appConfig.ui.popover
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.popover>>(() => defu({}, props.ui, appConfig.ui.popover))

    const float = computed<FloatProps>(() => defu({}, props.float, ui.value.float as FloatProps))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      // eslint-disable-next-line vue/no-dupe-keys
      float
    }
  }
})
</script>
