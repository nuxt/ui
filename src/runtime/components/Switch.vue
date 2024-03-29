<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { SwitchRootProps, SwitchRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/switch'
import type { IconProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { switch: Partial<typeof theme> } }

const switchTv = tv({ extend: tv(theme), ...(appConfig.ui?.switch || {}) })

type SwitchVariants = VariantProps<typeof switchTv>

export interface SwitchProps extends Omit<SwitchRootProps, 'asChild'> {
  color?: SwitchVariants['color']
  size?: SwitchVariants['size']
  loading?: boolean
  loadingIcon?: IconProps['name']
  checkedIcon?: IconProps['name']
  uncheckedIcon?: IconProps['name']
  class?: any
  ui?: Partial<typeof switchTv.slots>
}

export interface SwitchEmits extends SwitchRootEmits {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'

const props = defineProps<SwitchProps>()
const emits = defineEmits<SwitchEmits>()

const appConfig = useAppConfig()
const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultChecked', 'checked', 'required', 'name', 'id', 'value'), emits)

const ui = computed(() => tv({ extend: switchTv, slots: props.ui })({
  color: props.color,
  size: props.size,
  loading: props.loading
}))
</script>

<template>
  <SwitchRoot :disabled="disabled || loading" v-bind="rootProps" :class="ui.root({ class: props.class })">
    <SwitchThumb :class="ui.thumb()">
      <UIcon v-if="loading" :name="loadingIcon || appConfig.ui.icons.loading" :class="ui.icon({ checked: true, unchecked: true })" />
      <template v-else>
        <UIcon v-if="checkedIcon" :name="checkedIcon" :class="ui.icon({ checked: true })" />
        <UIcon v-if="uncheckedIcon" :name="uncheckedIcon" :class="ui.icon({ unchecked: true })" />
      </template>
    </SwitchThumb>
  </SwitchRoot>
</template>
