<script>
import theme from "#build/ui/pricing-plan";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { tv } from "../utils/tv";
import UBadge from "./Badge.vue";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
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
const props = useComponentProps("pricingPlan", _props);
const appConfig = useAppConfig();
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
    <div v-if="props.discount || props.price || !!slots.discount || !!slots.price || props.billingCycle || props.billingPeriod || !!slots.billing" data-slot="priceWrapper" :class="ui.priceWrapper({ class: props.ui?.priceWrapper })">
      <div v-if="props.discount && props.price || !!slots.discount" data-slot="discount" :class="ui.discount({ class: props.ui?.discount })">
        <slot name="discount">
          {{ props.price }}
        </slot>
      </div>

      <div v-if="props.discount || props.price || !!slots.price" data-slot="price" :class="ui.price({ class: props.ui?.price })">
        <slot name="price">
          {{ props.discount || props.price }}
        </slot>
      </div>

      <div v-if="props.billingCycle || props.billingPeriod || !!slots.billing" data-slot="billing" :class="ui.billing({ class: props.ui?.billing })">
        <slot name="billing" :ui="ui">
          <span data-slot="billingPeriod" :class="ui.billingPeriod({ class: props.ui?.billingPeriod })">
            {{ props.billingPeriod || "\xA0" }}
          </span>

          <span v-if="props.billingCycle" data-slot="billingCycle" :class="ui.billingCycle({ class: props.ui?.billingCycle })">
            {{ props.billingCycle }}
          </span>
        </slot>
      </div>
    </div>
  </DefinePriceTemplate>

  <Primitive :as="props.as" v-bind="$attrs" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.header && props.orientation === 'vertical'" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" />
    </div>

    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <slot name="body">
        <div data-slot="titleWrapper" :class="ui.titleWrapper({ class: props.ui?.titleWrapper })">
          <div v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
            <slot name="title">
              {{ props.title }}
            </slot>
          </div>

          <slot name="badge" :ui="ui">
            <UBadge
              v-if="props.badge"
              color="primary"
              variant="subtle"
              v-bind="typeof props.badge === 'string' ? { label: props.badge } : props.badge"
              data-slot="badge"
              :class="ui.badge({ class: props.ui?.badge })"
            />
          </slot>
        </div>

        <div v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ props.description }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="props.orientation === 'vertical'" />

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

    <div v-if="props.terms || !!slots.terms || (props.button || !!slots.button) || props.orientation === 'horizontal' || (props.tagline || !!slots.tagline) || !!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer">
        <div v-if="props.tagline || !!slots.tagline" data-slot="tagline" :class="ui.tagline({ class: props.ui?.tagline })">
          <slot name="tagline">
            {{ props.tagline }}
          </slot>
        </div>

        <ReusePriceTemplate v-if="props.orientation === 'horizontal'" />

        <slot name="button" :ui="ui">
          <UButton v-if="props.button" v-bind="{ block: true, size: 'lg', ...props.button }" data-slot="button" :class="ui.button({ class: props.ui?.button })" @click="props.button?.onClick" />
        </slot>

        <div v-if="props.terms || !!slots.terms" data-slot="terms" :class="ui.terms({ class: props.ui?.terms })">
          <slot name="terms">
            {{ props.terms }}
          </slot>
        </div>
      </slot>
    </div>
  </Primitive>
</template>
