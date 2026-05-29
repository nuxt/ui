<script>
import theme from "#build/ui/blog-post";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, useDateFormatter } from "reka-ui";
import { useAppConfig } from "#imports";
import { useLocale } from "../composables/useLocale";
import { useComponentProps } from "../composables/useComponentProps";
import { usePrefix } from "../composables/usePrefix";
import ImageComponent from "#build/ui-image-component";
import { getSlotChildrenText } from "../utils";
import { tv } from "../utils/tv";
import ULink from "./Link.vue";
import UBadge from "./Badge.vue";
import UAvatar from "./Avatar.vue";
import UAvatarGroup from "./AvatarGroup.vue";
import UUser from "./User.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
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
const props = useComponentProps("blogPost", _props);
const { locale } = useLocale();
const appConfig = useAppConfig();
const formatter = useDateFormatter(locale.value.code);
const prefix = usePrefix();
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
  <Primitive :as="props.as" :data-orientation="props.orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" @click="props.onClick">
    <div v-if="props.image || !!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" :ui="ui">
        <component
          :is="ImageComponent"
          v-bind="typeof props.image === 'string' ? { src: props.image, alt: props.title } : { alt: props.title, ...props.image }"
          data-slot="image"
          :class="ui.image({ class: props.ui?.image, to: !!props.to })"
        />
      </slot>
    </div>

    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <ULink
        v-if="props.to"
        :aria-label="ariaLabel"
        v-bind="{ to: props.to, target: props.target, ...$attrs }"
        :class="prefix('focus:outline-none peer')"
        raw
      >
        <span :class="prefix('absolute inset-0')" aria-hidden="true" />
      </ULink>

      <slot name="body">
        <div v-if="date || !!slots.date || (props.badge || !!slots.badge)" data-slot="meta" :class="ui.meta({ class: props.ui?.meta })">
          <slot name="badge">
            <UBadge
              v-if="props.badge"
              color="neutral"
              variant="subtle"
              v-bind="typeof props.badge === 'string' ? { label: props.badge } : props.badge"
              data-slot="badge"
              :class="ui.badge({ class: props.ui?.badge })"
            />
          </slot>

          <time v-if="date || !!slots.date" :datetime="datetime" data-slot="date" :class="ui.date({ class: props.ui?.date })">
            <slot name="date">
              {{ date }}
            </slot>
          </time>
        </div>

        <h2 v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.title }}
          </slot>
        </h2>

        <div v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
          <slot name="description">
            {{ props.description }}
          </slot>
        </div>

        <div v-if="props.authors?.length || !!slots.authors" data-slot="authors" :class="ui.authors({ class: props.ui?.authors })">
          <slot name="authors" :ui="ui">
            <template v-if="props.authors?.length">
              <UAvatarGroup v-if="props.authors.length > 1">
                <ULink
                  v-for="(author, index) in props.authors"
                  :key="index"
                  :to="author.to"
                  :target="author.target"
                  data-slot="avatar"
                  :class="ui.avatar({ class: props.ui?.avatar, to: !!author.to })"
                  raw
                >
                  <UAvatar v-bind="author.avatar" />
                </ULink>
              </UAvatarGroup>
              <UUser v-else v-bind="props.authors[0]" />
            </template>
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
