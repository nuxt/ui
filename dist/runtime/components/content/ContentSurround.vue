<script>
import theme from "#build/ui/content/content-surround";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { useLocale } from "../../composables/useLocale";
import { tv } from "../../utils/tv";
import ULink from "../Link.vue";
import UIcon from "../Icon.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  prevIcon: { type: null, required: false },
  nextIcon: { type: null, required: false },
  surround: { type: Array, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const { dir } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("contentSurround", props);
const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate({
  props: {
    link: Object,
    icon: String,
    direction: String
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.contentSurround || {} })());
const prevIcon = computed(() => props.prevIcon || (dir.value === "rtl" ? appConfig.ui.icons.arrowRight : appConfig.ui.icons.arrowLeft));
const nextIcon = computed(() => props.nextIcon || (dir.value === "rtl" ? appConfig.ui.icons.arrowLeft : appConfig.ui.icons.arrowRight));
</script>

<template>
  <DefineLinkTemplate v-slot="{ link, icon, direction }">
    <ULink v-if="link" :to="link.path" raw data-slot="link" :class="ui.link({ class: [uiProp?.link, link.ui?.link, link.class], direction })">
      <slot name="link" :link="link" :ui="ui">
        <div data-slot="linkLeading" :class="ui.linkLeading({ class: [uiProp?.linkLeading, link.ui?.linkLeading] })">
          <slot name="link-leading" :link="link" :ui="ui">
            <UIcon :name="link.icon || icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [uiProp?.linkLeadingIcon, link.ui?.linkLeadingIcon], direction })" />
          </slot>
        </div>

        <p data-slot="linkTitle" :class="ui.linkTitle({ class: [uiProp?.linkTitle, link.ui?.linkTitle] })">
          <slot name="link-title" :link="link" :ui="ui">
            {{ link.title }}
          </slot>
        </p>

        <p data-slot="linkDescription" :class="ui.linkDescription({ class: [uiProp?.linkDescription, link.ui?.linkDescription] })">
          <slot name="link-description" :link="link" :ui="ui">
            {{ link.description }}
          </slot>
        </p>
      </slot>
    </ULink>
    <span v-else class="hidden sm:block">&nbsp;</span>
  </DefineLinkTemplate>

  <Primitive v-if="surround" :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <ReuseLinkTemplate :link="surround[0]" :icon="prevIcon" direction="left" />
    <ReuseLinkTemplate :link="surround[1]" :icon="nextIcon" direction="right" />
  </Primitive>
</template>
