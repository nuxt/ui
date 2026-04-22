<script>
import theme from "#build/ui/changelog-version";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, useDateFormatter } from "reka-ui";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { useComponentUI } from "../composables/useComponentUI";
import ImageComponent from "#build/ui-image-component";
import { getSlotChildrenText } from "../utils";
import { tv } from "../utils/tv";
import ULink from "./Link.vue";
import UBadge from "./Badge.vue";
import UUser from "./User.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false, default: "article" },
  title: { type: String, required: false },
  description: { type: String, required: false },
  date: { type: [String, Date], required: false },
  badge: { type: [String, Object], required: false },
  authors: { type: Array, required: false },
  image: { type: [String, Object], required: false },
  indicator: { type: Boolean, required: false, default: true },
  to: { type: null, required: false },
  target: { type: [String, Object, null], required: false },
  onClick: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const { locale } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("changelogVersion", props);
const formatter = useDateFormatter(locale.value.code);
const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate();
const [DefineDateTemplate, ReuseDateTemplate] = createReusableTemplate({
  props: {
    hidden: {
      type: Boolean,
      default: false
    }
  }
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.changelogVersion || {} })({
  to: !!props.to || !!props.onClick
}));
const date = computed(() => {
  if (!props.date) {
    return;
  }
  try {
    return formatter.custom(new Date(props.date), { dateStyle: "medium" });
  } catch {
    return props.date;
  }
});
const datetime = computed(() => {
  if (!props.date) {
    return;
  }
  try {
    return new Date(props.date)?.toISOString();
  } catch {
    return void 0;
  }
});
const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title());
  return (slotText || props.title || "Version link").trim();
});
</script>

<template>
  <DefineLinkTemplate>
    <ULink
      v-if="to"
      :aria-label="ariaLabel"
      v-bind="{ to, target, ...$attrs }"
      class="focus:outline-none peer"
      raw
    >
      <span class="absolute inset-0" aria-hidden="true" />
    </ULink>
  </DefineLinkTemplate>

  <DefineDateTemplate v-slot="{ hidden }">
    <time v-if="date" :datetime="datetime" data-slot="date" :class="ui.date({ class: uiProp?.date, hidden })">
      <slot name="date">
        {{ date }}
      </slot>
    </time>
  </DefineDateTemplate>

  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })" @click="onClick">
    <div v-if="!!props.indicator || !!slots.indicator" data-slot="indicator" :class="ui.indicator({ class: uiProp?.indicator })">
      <slot name="indicator" :ui="ui">
        <ReuseDateTemplate />

        <div data-slot="dot" :class="ui.dot({ class: uiProp?.dot })">
          <div data-slot="dotInner" :class="ui.dotInner({ class: uiProp?.dotInner })" />
        </div>
      </slot>
    </div>

    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="!!slots.header || (date || !!slots.date) || (badge || !!slots.badge) || (title || !!slots.title) || (description || !!slots.description) || (image || !!slots.image)" data-slot="header" :class="ui.header({ class: uiProp?.header })">
        <slot name="header">
          <div v-if="date || !!slots.date || (badge || !!slots.badge)" data-slot="meta" :class="ui.meta({ class: uiProp?.meta, badge: !!badge || !!slots.badge || !props.indicator })">
            <slot name="badge" :ui="ui">
              <UBadge
                v-if="badge"
                color="neutral"
                variant="solid"
                v-bind="typeof badge === 'string' ? { label: badge } : badge"
                data-slot="badge"
                :class="ui.badge({ class: uiProp?.badge })"
              />
            </slot>

            <ReuseDateTemplate :hidden="!!props.indicator" />
          </div>

          <h2 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
            <ReuseLinkTemplate />

            <slot name="title">
              {{ title }}
            </slot>
          </h2>

          <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
            <slot name="description">
              {{ description }}
            </slot>
          </div>

          <div v-if="image || !!slots.image" data-slot="imageWrapper" :class="ui.imageWrapper({ class: uiProp?.imageWrapper })">
            <slot name="image" :ui="ui">
              <component
                :is="ImageComponent"
                v-if="image"
                v-bind="typeof image === 'string' ? { src: image, alt: title } : { alt: title, ...image }"
                data-slot="image"
                :class="ui.image({ class: uiProp?.image, to: !!to })"
              />
            </slot>

            <ReuseLinkTemplate />
          </div>
        </slot>
      </div>

      <slot name="body" />

      <div v-if="!!slots.footer || (authors?.length || !!slots.authors) || !!slots.actions" data-slot="footer" :class="ui.footer({ class: uiProp?.footer, body: !!slots.body })">
        <slot name="footer">
          <div v-if="authors?.length || !!slots.authors" data-slot="authors" :class="ui.authors({ class: uiProp?.authors })">
            <slot name="authors">
              <UUser
                v-for="(author, index) in authors"
                :key="index"
                v-bind="author"
              />
            </slot>
          </div>

          <slot name="actions" />
        </slot>
      </div>
    </div>
  </Primitive>
</template>
