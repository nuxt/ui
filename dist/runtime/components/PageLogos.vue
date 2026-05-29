<script>
import theme from "#build/ui/page-logos";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { tv } from "../utils/tv";
import UMarquee from "./Marquee.vue";
import UAvatar from "./Avatar.vue";
import UIcon from "./Icon.vue";
defineOptions({ inheritAttrs: false });
const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
const _props = defineProps({
  as: { type: null, required: false },
  title: { type: String, required: false },
  items: { type: Array, required: false },
  marquee: { type: [Boolean, Object], required: false, default: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("pageLogos", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageLogos || {} })());
</script>

<template>
  <DefineCreateItemTemplate>
    <slot v-if="!!slots.default" />
    <template v-else-if="props.items?.length">
      <template v-for="(item, index) in props.items" :key="index">
        <UAvatar
          v-if="typeof item === 'object'"
          :src="item.src"
          :alt="item.alt"
          data-slot="logo"
          :class="ui.logo({ class: props.ui?.logo })"
        />
        <UIcon
          v-else
          :name="item"
          data-slot="logo"
          :class="ui.logo({ class: props.ui?.logo })"
        />
      </template>
    </template>
  </DefineCreateItemTemplate>

  <Primitive :as="props.as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <h2 v-if="props.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
      {{ props.title }}
    </h2>

    <UMarquee
      v-if="props.marquee"
      v-bind="typeof props.marquee === 'object' ? props.marquee : {}"
      data-slot="logos"
      :class="ui.logos({ class: props.ui?.logos, marquee: true })"
    >
      <ReuseCreateItemTemplate :items="props.items" />
    </UMarquee>
    <div v-else data-slot="logos" :class="ui.logos({ class: props.ui?.logos })">
      <ReuseCreateItemTemplate :items="props.items" />
    </div>
  </Primitive>
</template>
