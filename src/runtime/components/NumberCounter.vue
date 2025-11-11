<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/number-counter'
import type { ComponentConfig } from '../types/tv'
import type {
  Props as NumberFlowProps,
  Format as NumberFlowFormat,
  Value as NumberFlowValue
} from 'number-flow/lite'

type NumberCounter = ComponentConfig<typeof theme, AppConfig, 'numberCounter'>

export interface NumberCounterProps extends Partial<Omit<NumberFlowProps, 'digits'>> {
  format?: NumberFlowFormat
  value: NumberFlowValue
  prefix?: string
  suffix?: string
  willChange?: boolean
  class?: any
}

export interface NumberCounterEmits {
  animationsstart: []
  animationsfinish: []
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import NumberFlow from '@number-flow/vue'
import { tv } from '../utils/tv'

const props = defineProps<NumberCounterProps>()
const emits = defineEmits<NumberCounterEmits>()

const appConfig = useAppConfig() as NumberCounter['AppConfig']

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.numberCounter || {}) }))
</script>

<template>
  <NumberFlow
    v-bind="rootProps"
    :class="ui({ class: props.class })"
  />
</template>
