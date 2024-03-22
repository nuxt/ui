<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { SwitchRootProps, SwitchRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/switch'

const appConfig = _appConfig as AppConfig & { ui: { switch: Partial<typeof theme> } }

const switchTv = tv({ extend: tv(theme), ...(appConfig.ui?.switch || {}) })

type SwitchVariants = VariantProps<typeof switchTv>

export interface SwitchProps extends Omit<SwitchRootProps, 'asChild'> {
  color?: SwitchVariants['color']
  size?: SwitchVariants['size']
  checkedIcon?: string
  uncheckedIcon?: string
  class?: any
  ui?: Partial<typeof switchTv.slots>
}

export interface SwitchEmits extends SwitchRootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = defineProps<SwitchProps>()
const emits = defineEmits<SwitchEmits>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultChecked', 'checked', 'disabled', 'required', 'name', 'id', 'value'), emits)

const ui = computed(() => tv({ extend: switchTv, slots: props.ui })({
  color: props.color,
  size: props.size
}))
</script>

<template>
  <SwitchRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <SwitchThumb :class="ui.thumb()">
      <UIcon v-if="checkedIcon" :name="checkedIcon" :class="ui.icon({ checked: true })" />
      <UIcon v-if="uncheckedIcon" :name="uncheckedIcon" :class="ui.icon({ checked: false })" />
    </SwitchThumb>
  </SwitchRoot>
</template>
