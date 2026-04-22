<script>
import theme from "#build/ui/pricing-plan";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UBadge from "./Badge.vue";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  badge: { type: [String, Object], required: false },
  billingCycle: { type: String, required: false },
  billingPeriod: { type: String, required: false },
  price: { type: String, required: false },
  discount: { type: String, required: false },
  features: { type: Array, required: false },
  button: { type: Object, required: false },
  tagline: { type: String, required: false },
  terms: { type: String, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  variant: { type: null, required: false },
  highlight: { type: Boolean, required: false },
  scale: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pricingPlan", props);
const [DefinePriceTemplate, ReusePriceTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pricingPlan || {} })({
  orientation: props.orientation,
  variant: props.variant,
  highlight: props.highlight,
  scale: props.scale
}));
const features = computed(() => props.features?.map((feature) => typeof feature === "string" ? { title: feature } : feature));
</script>

<template>
  <DefinePriceTemplate>
    <div v-if="discount || price || !!slots.discount || !!slots.price || billingCycle || billingPeriod || !!slots.billing" data-slot="priceWrapper" :class="ui.priceWrapper({ class: uiProp?.priceWrapper })">
      <div v-if="discount && price || !!slots.discount" data-slot="discount" :class="ui.discount({ class: uiProp?.discount })">
        <slot name="discount">
          {{ price }}
        </slot>
      </div>

      <div v-if="discount || price || !!slots.price" data-slot="price" :class="ui.price({ class: uiProp?.price })">
        <slot name="price">
          {{ discount || price }}
        </slot>
      </div>

      <div v-if="billingCycle || billingPeriod || !!slots.billing" data-slot="billing" :class="ui.billing({ class: uiProp?.billing })">
        <slot name="billing" :ui="ui">
          <span data-slot="billingPeriod" :class="ui.billingPeriod({ class: uiProp?.billingPeriod })">
            {{ billingPeriod || "\xA0" }}
          </span>

          <span v-if="billingCycle" data-slot="billingCycle" :class="ui.billingCycle({ class: uiProp?.billingCycle })">
            {{ billingCycle }}
          </span>
        </slot>
      </div>
    </div>
  </DefinePriceTemplate>

  <Primitive :as="as" v-bind="$attrs" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="!!slots.header && orientation === 'vertical'" data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <slot name="header" />
    </div>

    <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <slot name="body">
        <div data-slot="titleWrapper" :class="ui.titleWrapper({ class: uiProp?.titleWrapper })">
          <div v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
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
              :class="ui.badge({ class: uiProp?.badge })"
            />
          </slot>
        </div>

        <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="orientation === 'vertical'" />

        <ul v-if="features?.length || !!slots.features" data-slot="features" :class="ui.features({ class: uiProp?.features })">
          <slot name="features">
            <li v-for="(feature, index) in features" :key="index" data-slot="feature" :class="ui.feature({ class: uiProp?.feature })">
              <UIcon :name="feature.icon || appConfig.ui.icons.success" data-slot="featureIcon" :class="ui.featureIcon({ class: uiProp?.featureIcon })" />

              <span data-slot="featureTitle" :class="ui.featureTitle({ class: uiProp?.featureTitle })">{{ feature.title }}</span>
            </li>
          </slot>
        </ul>
      </slot>
    </div>

    <div v-if="terms || !!slots.terms || (button || !!slots.button) || orientation === 'horizontal' || (tagline || !!slots.tagline) || !!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer">
        <div v-if="tagline || !!slots.tagline" data-slot="tagline" :class="ui.tagline({ class: uiProp?.tagline })">
          <slot name="tagline">
            {{ tagline }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="orientation === 'horizontal'" />

        <slot name="button" :ui="ui">
          <UButton v-if="button" v-bind="{ block: true, size: 'lg', ...button }" data-slot="button" :class="ui.button({ class: uiProp?.button })" @click="button?.onClick" />
        </slot>

        <div v-if="terms || !!slots.terms" data-slot="terms" :class="ui.terms({ class: uiProp?.terms })">
          <slot name="terms">
            {{ terms }}
          </slot>
        </div>
      </slot>
    </div>
  </Primitive>
</template>
