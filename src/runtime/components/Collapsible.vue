<script lang="ts">
import { tv } from 'tailwind-variants'
import type { CollapsibleRootProps, CollapsibleRootEmits } from 'radix-vue'
import appConfig from '#build/app.config'
import theme from '#build/ui/collapsible'

const collapsible = tv({ extend: tv(theme), ...(appConfig.ui?.collapsible || {}) })

export interface CollapsibleProps extends Omit<CollapsibleRootProps, 'as' | 'asChild'> {
  content?: string
  class?: any
  ui?: Partial<typeof collapsible.slots>
}

export interface CollapsibleEmits extends CollapsibleRootEmits {}

export interface CollapsibleSlots {
  default(): any
  content(): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

defineOptions({ inheritAttrs: false })

const props = defineProps<CollapsibleProps>()
const emits = defineEmits<CollapsibleEmits>()
const slots = defineSlots<CollapsibleSlots>()

const forwardRoot = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'disabled'), emits)

// FIXME: Cannot extend multiple times
// const ui = computed(() => tv({ extend: collapsible, slots: props.ui })())
// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => collapsible())
</script>

<template>
  <CollapsibleRoot v-bind="forwardRoot">
    <CollapsibleTrigger as-child>
      <slot />
    </CollapsibleTrigger>

    <CollapsibleContent v-bind="$attrs" :class="ui.content({ class: props.class })">
      <slot name="content">
        {{ content }}
      </slot>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>

<style>
@keyframes collapsibleSlideDown {
  from {
    height: 0;
  }
  to {
    height: var(--radix-collapsible-content-height);
  }
}

@keyframes collapsibleSlideUp {
  from {
    height: var(--radix-collapsible-content-height);
  }
  to {
    height: 0;
  }
}
</style>