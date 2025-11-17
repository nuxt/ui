<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/pricing-plan'
import type { BadgeProps, ButtonProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PricingPlan = ComponentConfig<typeof theme, AppConfig, 'pricingPlan'>

type PricingPlanFeature = {
  title: string
  /**
   * @defaultValue appConfig.ui.icons.success
   * @IconifyIcon
   */
  icon?: IconProps['name']
}

export interface PricingPlanProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  title?: string
  description?: string
  /**
   * Display a badge next to the title.
   * Can be a string or an object.
   * `{ color: 'primary', variant: 'subtle' }`{lang="ts-type"}
   */
  badge?: string | BadgeProps
  /**
   * The unit price period that appears next to the price.
   * Typically used to show the recurring interval.
   * @example "/month", "/year", "/seat/month"
   */
  billingCycle?: string
  /**
   * Additional billing context that appears above the billing cycle.
   * Typically used to show the actual billing frequency.
   * @example "billed annually", "billed monthly", "per user, billed annually"
   */
  billingPeriod?: string
  /**
   * The current price of the plan.
   * When used with `discount`, this becomes the original price.
   * @example "$99", "€99", "Free"
   */
  price?: string
  /**
   * The discounted price of the plan.
   * When provided, the `price` prop will be displayed as strikethrough.
   * @example "$79", "€79"
   */
  discount?: string
  /**
   * Display a list of features under the price.
   * Can be an array of strings or an array of objects.
   */
  features?: string[] | PricingPlanFeature[]
  /**
   * Display a buy button at the bottom.
   * `{ size: 'lg', block: true }`{lang="ts-type"}
   * Use the `onClick` field to add a click handler.
   */
  button?: ButtonProps
  /**
   * Display a tagline highlighting the pricing value proposition.
   * @example 'Pay once, own it forever'
   */
  tagline?: string
  /**
   * Display terms at the bottom.
   * @example '14-day free trial'
   */
  terms?: string
  /**
   * The orientation of the pricing plan.
   * @defaultValue 'vertical'
   */
  orientation?: PricingPlan['variants']['orientation']
  /**
   * @defaultValue 'outline'
   */
  variant?: PricingPlan['variants']['variant']
  /** Display a ring around the pricing plan to highlight it. */
  highlight?: boolean
  /** Enlarge the plan to make it more prominent. */
  scale?: boolean
  class?: any
  ui?: PricingPlan['slots']
}

export interface PricingPlanSlots {
  badge(props: { ui: PricingPlan['ui'] }): any
  title(props?: {}): any
  description(props?: {}): any
  price(props?: {}): any
  discount(props?: {}): any
  billing(props: { ui: PricingPlan['ui'] }): any
  features(props?: {}): any
  button(props: { ui: PricingPlan['ui'] }): any
  header(props?: {}): any
  body(props?: {}): any
  footer(props?: {}): any
  tagline(props?: {}): any
  terms(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UBadge from './Badge.vue'
import UButton from './Button.vue'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<PricingPlanProps>(), {
  orientation: 'vertical'
})
const slots = defineSlots<PricingPlanSlots>()

const appConfig = useAppConfig() as PricingPlan['AppConfig']

const [DefinePriceTemplate, ReusePriceTemplate] = createReusableTemplate()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pricingPlan || {}) })({
  orientation: props.orientation,
  variant: props.variant,
  highlight: props.highlight,
  scale: props.scale
}))

const features = computed(() => props.features?.map(feature => typeof feature === 'string' ? { title: feature } : feature))
</script>

<template>
  <DefinePriceTemplate>
    <div v-if="discount || price || !!slots.discount || !!slots.price || billingCycle || billingPeriod || !!slots.billing" data-slot="priceWrapper" :class="ui.priceWrapper({ class: props.ui?.priceWrapper })">
      <div v-if="(discount && price) || !!slots.discount" data-slot="discount" :class="ui.discount({ class: props.ui?.discount })">
        <slot name="discount">
          {{ price }}
        </slot>
      </div>

      <div v-if="(discount || price) || !!slots.price" data-slot="price" :class="ui.price({ class: props.ui?.price })">
        <slot name="price">
          {{ discount || price }}
        </slot>
      </div>

      <div v-if="billingCycle || billingPeriod || !!slots.billing" data-slot="billing" :class="ui.billing({ class: props.ui?.billing })">
        <slot name="billing" :ui="ui">
          <span data-slot="billingPeriod" :class="ui.billingPeriod({ class: props.ui?.billingPeriod })">
            {{ billingPeriod || '&nbsp;' }}
          </span>

          <span v-if="billingCycle" data-slot="billingCycle" :class="ui.billingCycle({ class: props.ui?.billingCycle })">
            {{ billingCycle }}
          </span>
        </slot>
      </div>
    </div>
  </DefinePriceTemplate>

  <Primitive :as="as" v-bind="$attrs" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.header && orientation === 'vertical'" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <slot name="body">
        <div data-slot="titleWrapper" :class="ui.titleWrapper({ class: props.ui?.titleWrapper })">
          <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
            <slot name="title">
              {{ title }}
            </slot>
          </div>

          <slot name="badge" :ui="ui">
            <UBadge
              v-if="badge"
              color="primary"
              variant="subtle"
              v-bind="typeof badge === 'string' ? { label: badge } : badge"
              data-slot="badge"
              :class="ui.badge({ class: props.ui?.badge })"
            />
          </slot>
        </div>

        <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="orientation === 'vertical'" />

        <ul v-if="features?.length || !!slots.features" data-slot="features" :class="ui.features({ class: props.ui?.features })">
          <slot name="features">
            <li v-for="(feature, index) in features" :key="index" data-slot="feature" :class="ui.feature({ class: props.ui?.feature })">
              <UIcon :name="feature.icon || appConfig.ui.icons.success" data-slot="featureIcon" :class="ui.featureIcon({ class: props.ui?.featureIcon })" />

              <span data-slot="featureTitle" :class="ui.featureTitle({ class: props.ui?.featureTitle })">{{ feature.title }}</span>
            </li>
          </slot>
        </ul>
      </slot>
    </div>

    <div v-if="(terms || !!slots.terms) || (button || !!slots.button) || orientation === 'horizontal' || (tagline || !!slots.tagline) || !!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer">
        <div v-if="tagline || !!slots.tagline" data-slot="tagline" :class="ui.tagline({ class: props.ui?.tagline })">
          <slot name="tagline">
            {{ tagline }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="orientation === 'horizontal'" />

        <slot name="button" :ui="ui">
          <UButton v-if="button" v-bind="{ block: true, size: 'lg', ...button }" data-slot="button" :class="ui.button({ class: props.ui?.button })" @click="button?.onClick" />
        </slot>

        <div v-if="terms || !!slots.terms" data-slot="terms" :class="ui.terms({ class: props.ui?.terms })">
          <slot name="terms">
            {{ terms }}
          </slot>
        </div>
      </slot>
    </div>
  </Primitive>
</template>
