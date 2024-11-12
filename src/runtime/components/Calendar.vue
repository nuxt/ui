<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { CalendarRootProps, CalendarRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/calendar'

const appConfig = _appConfig as AppConfig & { ui: { calendar: Partial<typeof theme> } }

const calendar = tv({ extend: tv(theme), ...(appConfig.ui?.calendar || {}) })

type CalendarVariants = VariantProps<typeof calendar>

export interface CalendarProps extends Pick<CalendarRootProps> {
  class?: any
  ui?: Partial<typeof calendar.slots>
}

export interface CalendarEmits extends CalendarRootEmits {}

export interface CalendarSlots {}
</script>

<script setup lang="ts">
import { CalendarRoot, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'

const props = defineProps<CalendarProps>()
const emits = defineEmits<CalendarEmits>()
const slots = defineSlots<CalendarSlots>()

const rootProps = useForwardPropsEmits(reactivePick(props), emits)

const ui = calendar()
</script>

<template>
  <CalendarRoot v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })" />
</template>
