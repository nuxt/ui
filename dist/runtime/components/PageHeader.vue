<script>
import theme from "#build/ui/page-header";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
const props = defineProps({
  as: { type: null, required: false },
  headline: { type: String, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  links: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pageHeader", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageHeader || {} })({
  title: !!props.title || !!slots.title
}));
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div v-if="headline || !!slots.headline" data-slot="headline" :class="ui.headline({ class: uiProp?.headline })">
      <slot name="headline">
        {{ headline }}
      </slot>
    </div>

    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
        <h1 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h1>

        <div v-if="links?.length || !!slots.links" data-slot="links" :class="ui.links({ class: uiProp?.links })">
          <slot name="links">
            <UButton v-for="(link, index) in links" :key="index" color="neutral" variant="outline" v-bind="link" />
          </slot>
        </div>
      </div>

      <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
        <slot name="description">
          {{ description }}
        </slot>
      </div>

      <slot />
    </div>
  </Primitive>
</template>
