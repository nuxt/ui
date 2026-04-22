<script>
import theme from "#build/ui/blog-post";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, useDateFormatter } from "reka-ui";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { useComponentUI } from "../composables/useComponentUI";
import ImageComponent from "#build/ui-image-component";
import { getSlotChildrenText } from "../utils";
import { tv } from "../utils/tv";
import ULink from "./Link.vue";
import UBadge from "./Badge.vue";
import UAvatar from "./Avatar.vue";
import UAvatarGroup from "./AvatarGroup.vue";
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
  orientation: { type: null, required: false, default: "vertical" },
  variant: { type: null, required: false },
  to: { type: null, required: false },
  target: { type: [String, Object, null], required: false },
  onClick: { type: Function, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const { locale } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("blogPost", props);
const formatter = useDateFormatter(locale.value.code);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.blogPost || {} })({
  orientation: props.orientation,
  variant: props.variant,
  image: !!props.image,
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
  return (slotText || props.title || "Post link").trim();
});
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })" @click="onClick">
    <div v-if="image || !!slots.header" data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <slot name="header" :ui="ui">
        <component
          :is="ImageComponent"
          v-bind="typeof image === 'string' ? { src: image, alt: title } : { alt: title, ...image }"
          data-slot="image"
          :class="ui.image({ class: uiProp?.image, to: !!to })"
        />
      </slot>
    </div>

    <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <ULink
        v-if="to"
        :aria-label="ariaLabel"
        v-bind="{ to, target, ...$attrs }"
        class="focus:outline-none peer"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot name="body">
        <div v-if="date || !!slots.date || (badge || !!slots.badge)" data-slot="meta" :class="ui.meta({ class: uiProp?.meta })">
          <slot name="badge">
            <UBadge
              v-if="badge"
              color="neutral"
              variant="subtle"
              v-bind="typeof badge === 'string' ? { label: badge } : badge"
              data-slot="badge"
              :class="ui.badge({ class: uiProp?.badge })"
            />
          </slot>

          <time v-if="date || !!slots.date" :datetime="datetime" data-slot="date" :class="ui.date({ class: uiProp?.date })">
            <slot name="date">
              {{ date }}
            </slot>
          </time>
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

        <div v-if="authors?.length || !!slots.authors" data-slot="authors" :class="ui.authors({ class: uiProp?.authors })">
          <slot name="authors" :ui="ui">
            <template v-if="authors?.length">
              <UAvatarGroup v-if="authors.length > 1">
                <ULink
                  v-for="(author, index) in authors"
                  :key="index"
                  :to="author.to"
                  :target="author.target"
                  data-slot="avatar"
                  :class="ui.avatar({ class: uiProp?.avatar, to: !!author.to })"
                  raw
                >
                  <UAvatar v-bind="author.avatar" />
                </ULink>
              </UAvatarGroup>
              <UUser v-else v-bind="authors[0]" />
            </template>
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
