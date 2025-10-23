<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/pricing-plans'
import type { PricingPlanProps, PricingPlanSlots } from '../types'
import type { ComponentConfig } from '../types/tv'

type PricingPlans = ComponentConfig<typeof theme, AppConfig, 'pricingPlans'>

export interface PricingPlansProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  plans?: PricingPlanProps[]
  /**
   * The orientation of the pricing plans.
   * @defaultValue 'horizontal'
   */
  orientation?: PricingPlans['variants']['orientation']
  /**
   * When `true`, the plans will be displayed without gap.
   * @defaultValue false
   */
  compact?: boolean
  /**
   * When `true`, the plans will be displayed with a larger gap.
   * Useful when one plan is scaled. Doesn't work with `compact`.
   * @defaultValue false
   */
  scale?: boolean
  class?: any
}

type ExtendSlotWithPlan<T extends PricingPlanProps, K extends keyof PricingPlanSlots>
  = PricingPlanSlots[K] extends (props: infer P) => any
    ? (props: P & { plan: T }) => any
    : PricingPlanSlots[K]

export type PricingPlansSlots<T extends PricingPlanProps = PricingPlanProps> = {
  [K in keyof PricingPlanSlots]: ExtendSlotWithPlan<T, K>
} & {
  default(props?: {}): any
}

</script>

<script setup lang="ts" generic="T extends PricingPlanProps">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UPricingPlan from './PricingPlan.vue'

const props = withDefaults(defineProps<PricingPlansProps>(), {
  orientation: 'horizontal',
  compact: false,
  scale: false
})
const slots = defineSlots<PricingPlansSlots<T>>()

const getProxySlots = () => omit(slots, ['default'])

const appConfig = useAppConfig() as PricingPlans['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pricingPlans || {}) }))

const count = computed(() => props.plans?.length || slots.default?.()?.flatMap(mapSlot).filter(Boolean)?.length || 3)

function mapSlot(slot: any) {
  if (typeof slot.type === 'symbol') {
    if (slot.children && Array.isArray(slot.children)) {
      return slot.children.map(mapSlot)
    }

    return
  }

  return slot
}
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui({ class: props.class, compact, scale, orientation })" :style="{ '--count': count }">
    <slot>
      <UPricingPlan
        v-for="(plan, index) in plans"
        :key="index"
        :orientation="orientation === 'vertical' ? 'horizontal' : 'vertical'"
        v-bind="plan"
      >
        <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
          <slot :name="name" v-bind="(slotData as any)" :plan="plan" />
        </template>
      </UPricingPlan>
    </slot>
  </Primitive>
</template>
