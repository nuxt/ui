<script lang="ts">
import { tv } from 'tailwind-variants'
import type { CollapsibleRootProps, CollapsibleRootEmits } from 'radix-vue'
import _appConfig from '#build/app.config'
import theme from '#build/ui/collapsible'
import type { AppConfig } from '@nuxt/schema'

const appConfig = _appConfig as AppConfig & { ui: { collapsible: Partial<typeof theme> } }

const collapsible = tv({ extend: tv(theme), ...(appConfig.ui?.collapsible || {}) })

export interface CollapsibleProps extends Omit<CollapsibleRootProps, 'asChild'> {
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

const props = defineProps<CollapsibleProps>()
const emits = defineEmits<CollapsibleEmits>()
defineSlots<CollapsibleSlots>()

const forward = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'disabled'), emits)

// FIXME: Cannot extend multiple times
// const ui = computed(() => tv({ extend: collapsible, slots: props.ui })())
// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => collapsible())
</script>

<template>
  <CollapsibleRoot v-bind="forward" :class="ui.root({ class: props.class })">
    <CollapsibleTrigger as-child>
      <slot />
    </CollapsibleTrigger>

    <CollapsibleContent :class="ui.content()">
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