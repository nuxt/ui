<script>
import theme from "#build/ui/page-section";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UPageFeature from "./PageFeature.vue";
import UContainer from "./Container.vue";
import UIcon from "./Icon.vue";
import UButton from "./Button.vue";
const props = defineProps({
  as: { type: null, required: false, default: "section" },
  headline: { type: String, required: false },
  icon: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  links: { type: Array, required: false },
  features: { type: Array, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  reverse: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pageSection", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageSection || {} })({
  orientation: props.orientation,
  reverse: props.reverse,
  title: !!props.title || !!slots.title,
  description: !!props.description || !!slots.description,
  body: !!slots.body || (!!props.features?.length || !!slots.features)
}));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <slot name="top" />

    <UContainer data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="!!slots.header || (icon || !!slots.leading) || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description) || !!slots.body || (features?.length || !!slots.features) || !!slots.footer || (links?.length || !!slots.links)" data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
        <div v-if="!!slots.header || (icon || !!slots.leading) || (headline || !!slots.headline) || (title || !!slots.title) || (description || !!slots.description)" data-slot="header" :class="ui.header({ class: uiProp?.header })">
          <slot name="header">
            <div v-if="icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
              <slot name="leading" :ui="ui">
                <UIcon v-if="icon" :name="icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
              </slot>
            </div>

            <div v-if="headline || !!slots.headline" data-slot="headline" :class="ui.headline({ class: uiProp?.headline, headline: !slots.headline })">
              <slot name="headline">
                {{ headline }}
              </slot>
            </div>

            <h2 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
              <slot name="title">
                {{ title }}
              </slot>
            </h2>

            <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
              <slot name="description">
                {{ description }}
              </slot>
            </div>
          </slot>
        </div>

        <div v-if="!!slots.body || (features?.length || !!slots.features)" data-slot="body" :class="ui.body({ class: uiProp?.body })">
          <slot name="body">
            <ul v-if="features?.length || !!slots.features" data-slot="features" :class="ui.features({ class: uiProp?.features })">
              <slot name="features">
                <UPageFeature
                  v-for="(feature, index) in features"
                  :key="index"
                  as="li"
                  v-bind="feature"
                />
              </slot>
            </ul>
          </slot>
        </div>

        <div v-if="!!slots.footer || (links?.length || !!slots.links)" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
          <slot name="footer">
            <div v-if="links?.length || !!slots.links" data-slot="links" :class="ui.links({ class: uiProp?.links })">
              <slot name="links">
                <UButton v-for="(link, index) in links" :key="index" size="lg" v-bind="link" />
              </slot>
            </div>
          </slot>
        </div>
      </div>

      <slot v-if="!!slots.default" />
      <div v-else-if="orientation === 'horizontal'" class="hidden lg:block" />
    </UContainer>

    <slot name="bottom" />
  </Primitive>
</template>
