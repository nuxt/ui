<script>
import theme from "#build/ui/pricing-table";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UBadge from "./Badge.vue";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  caption: { type: String, required: false },
  tiers: { type: Array, required: true },
  sections: { type: Array, required: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pricingTable", props);
const formatSlotName = (item) => {
  if (item.id) return item.id;
  return item.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
};
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pricingTable || {} })());
const [DefineTierTemplate, ReuseTierTemplate] = createReusableTemplate({
  props: {
    tier: Object
  }
});
const [DefineFeatureTemplate, ReuseFeatureTemplate] = createReusableTemplate({
  props: {
    tier: Object,
    feature: Object
  }
});
</script>

<template>
  <DefineTierTemplate v-slot="{ tier }">
    <div data-slot="tierWrapper" :class="ui.tierWrapper({ class: uiProp?.tierWrapper })">
      <slot :name="tier.id" :tier="tier">
        <slot name="tier" :tier="tier">
          <div data-slot="tierTitleWrapper" :class="ui.tierTitleWrapper({ class: uiProp?.tierTitleWrapper })">
            <div data-slot="tierTitle" :class="ui.tierTitle({ class: uiProp?.tierTitle })">
              <slot :name="`${tier.id}-title`" :tier="tier">
                <slot name="tier-title" :tier="tier">
                  {{ tier.title }}
                </slot>
              </slot>
            </div>

            <slot :name="`${tier.id}-badge`" :tier="tier">
              <slot name="tier-badge" :tier="tier">
                <UBadge
                  v-if="tier.badge"
                  color="primary"
                  variant="subtle"
                  v-bind="typeof tier.badge === 'string' ? { label: tier.badge } : tier.badge"
                  data-slot="tierBadge"
                  :class="ui.tierBadge({ class: uiProp?.tierBadge })"
                />
              </slot>
            </slot>
          </div>

          <div data-slot="tierDescription" :class="ui.tierDescription({ class: uiProp?.tierDescription })">
            <slot :name="`${tier.id}-description`" :tier="tier">
              <slot name="tier-description" :tier="tier">
                {{ tier.description }}
              </slot>
            </slot>
          </div>

          <div data-slot="tierPriceWrapper" :class="ui.tierPriceWrapper({ class: uiProp?.tierPriceWrapper })">
            <div v-if="tier.discount && tier.price || !!slots[`${tier.id}-discount`] || !!slots['tier-discount']" data-slot="tierDiscount" :class="ui.tierDiscount({ class: uiProp?.tierDiscount })">
              <slot :name="`${tier.id}-discount`" :tier="tier">
                <slot name="tier-discount" :tier="tier">
                  {{ tier.price }}
                </slot>
              </slot>
            </div>

            <div v-if="tier.discount || tier.price || !!slots[`${tier.id}-price`] || !!slots['tier-price']" data-slot="tierPrice" :class="ui.tierPrice({ class: uiProp?.tierPrice })">
              <slot :name="`${tier.id}-price`" :tier="tier">
                <slot name="tier-price" :tier="tier">
                  {{ tier.discount || tier.price }}
                </slot>
              </slot>
            </div>

            <div v-if="tier.billingCycle || tier.billingPeriod || !!slots[`${tier.id}-billing`] || !!slots['tier-billing']" data-slot="tierBilling" :class="ui.tierBilling({ class: uiProp?.tierBilling })">
              <slot :name="`${tier.id}-billing`" :tier="tier">
                <slot name="tier-billing" :tier="tier">
                  <span data-slot="tierBillingPeriod" :class="ui.tierBillingPeriod({ class: uiProp?.tierBillingPeriod })">
                    {{ tier.billingPeriod || "\xA0" }}
                  </span>

                  <span v-if="tier.billingCycle" data-slot="tierBillingCycle" :class="ui.tierBillingCycle({ class: uiProp?.tierBillingCycle })">
                    {{ tier.billingCycle }}
                  </span>
                </slot>
              </slot>
            </div>
          </div>

          <div v-if="!!slots[`${tier.id}-button`] || !!slots['tier-button'] || tier.button" data-slot="tierButton" :class="ui.tierButton({ class: uiProp?.tierButton })">
            <slot :name="`${tier.id}-button`" :tier="tier">
              <slot name="tier-button" :tier="tier">
                <UButton v-if="tier.button" block size="lg" v-bind="tier.button" />
              </slot>
            </slot>
          </div>
        </slot>
      </slot>
    </div>
  </DefineTierTemplate>

  <DefineFeatureTemplate v-slot="{ feature, tier }">
    <template v-if="feature.tiers?.[tier.id]">
      <UIcon v-if="typeof feature.tiers[tier.id] === 'boolean'" :name="appConfig.ui.icons.success" data-slot="tierFeatureIcon" :class="ui.tierFeatureIcon({ class: uiProp?.tierFeatureIcon, active: true })" />
      <template v-else>
        {{ feature.tiers[tier.id] }}
      </template>
    </template>

    <UIcon v-else :name="appConfig.ui.icons.minus" data-slot="tierFeatureIcon" :class="ui.tierFeatureIcon({ class: uiProp?.tierFeatureIcon })" />
  </DefineFeatureTemplate>

  <Primitive :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <table data-slot="table" :class="ui.table({ class: uiProp?.table })">
      <caption v-if="caption || !!slots.caption" data-slot="caption" :class="ui.caption({ class: [uiProp?.caption] })">
        <slot name="caption">
          {{ caption || t("pricingTable.caption") }}
        </slot>
      </caption>

      <thead data-slot="thead" :class="ui.thead({ class: uiProp?.thead })">
        <tr data-slot="tr" :class="ui.tr({ class: uiProp?.tr })">
          <td />

          <th
            v-for="(tier, index) in tiers"
            :key="index"
            scope="col"
            data-slot="tier"
            :class="ui.tier({ class: uiProp?.tier, highlight: tier.highlight })"
          >
            <ReuseTierTemplate :tier="tier" />
          </th>
        </tr>
      </thead>

      <tbody data-slot="tbody" :class="ui.tbody({ class: uiProp?.tbody })">
        <template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
          <tr data-slot="tr" :class="ui.tr({ class: uiProp?.tr, section: sectionIndex > 0 })">
            <th scope="row" data-slot="th" :class="ui.th({ class: uiProp?.th })">
              <div v-if="section.title || !!slots['section-title'] || !!slots[`section-${formatSlotName(section)}-title`]" data-slot="sectionTitle" :class="ui.sectionTitle({ class: uiProp?.sectionTitle })">
                <slot :name="`section-${formatSlotName(section)}-title`" :section="section">
                  <slot name="section-title" :section="section">
                    {{ section.title }}
                  </slot>
                </slot>
              </div>
            </th>

            <td
              v-for="(tier, index) in tiers"
              :key="`${sectionIndex}-tier-${index}`"
              data-slot="td"
              :class="ui.td({ class: uiProp?.td, highlight: tier.highlight })"
            />
          </tr>

          <tr v-for="(feature, featureIndex) in section.features" :key="`${sectionIndex}-feature-${featureIndex}`">
            <th scope="row" data-slot="th" :class="ui.th({ class: uiProp?.th })">
              <div data-slot="featureTitle" :class="ui.featureTitle({ class: uiProp?.featureTitle })">
                <slot :name="`feature-${formatSlotName(feature)}-title`" :feature="feature" :section="section">
                  <slot name="feature-title" :feature="feature" :section="section">
                    {{ feature.title }}
                  </slot>
                </slot>
              </div>
            </th>

            <td
              v-for="(tier, index) in tiers"
              :key="`${sectionIndex}-feature-${featureIndex}-tier-${index}`"
              data-slot="td"
              :class="ui.td({ class: uiProp?.td, highlight: tier.highlight })"
            >
              <div data-slot="featureValue" :class="ui.featureValue({ class: uiProp?.featureValue })">
                <slot :name="`feature-${formatSlotName(feature)}-value`" :feature="feature" :tier="tier" :section="section">
                  <slot name="feature-value" :feature="feature" :tier="tier" :section="section">
                    <ReuseFeatureTemplate :tier="tier" :feature="feature" />
                  </slot>
                </slot>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <ul data-slot="list" :class="ui.list({ class: uiProp?.list })">
      <li v-for="(tier, index) in tiers" :key="index" data-slot="item" :class="ui.item({ class: uiProp?.item, highlight: tier.highlight })">
        <ReuseTierTemplate :tier="tier" />

        <div v-for="(section, sectionIndex) in sections" :key="`section-${sectionIndex}`" data-slot="section" :class="ui.section({ class: uiProp?.section })">
          <div v-if="section.title" data-slot="sectionTitle" :class="ui.sectionTitle({ class: uiProp?.sectionTitle })">
            <slot :name="`section-${formatSlotName(section)}-title`" :section="section">
              <slot name="section-title" :section="section">
                {{ section.title }}
              </slot>
            </slot>
          </div>

          <div v-for="(feature, featureIndex) in section.features" :key="`section-${sectionIndex}-feature-${featureIndex}`" data-slot="feature" :class="ui.feature({ class: uiProp?.feature })">
            <div data-slot="featureTitle" :class="ui.featureTitle({ class: uiProp?.featureTitle })">
              <slot :name="`feature-${formatSlotName(feature)}-title`" :feature="feature" :section="section">
                <slot name="feature-title" :feature="feature" :section="section">
                  {{ feature.title }}
                </slot>
              </slot>
            </div>

            <div data-slot="featureValue" :class="ui.featureValue({ class: uiProp?.featureValue })">
              <slot :name="`feature-${formatSlotName(feature)}-value`" :feature="feature" :tier="tier" :section="section">
                <slot name="feature-value" :feature="feature" :tier="tier" :section="section">
                  <ReuseFeatureTemplate :tier="tier" :feature="feature" />
                </slot>
              </slot>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </Primitive>
</template>
