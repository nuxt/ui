<script>
import theme from "#build/ui/banner";
</script>

<script setup>
import { computed, ref, onMounted, useId } from "vue";
import { Primitive } from "reka-ui";
import { useHead, useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { usePrefix } from "../composables/usePrefix";
import { tv } from "../utils/tv";
import ULink from "./Link.vue";
import UContainer from "./Container.vue";
import UIcon from "./Icon.vue";
import UButton from "./Button.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false },
  id: { type: String, required: false },
  icon: { type: null, required: false },
  title: { type: String, required: false },
  actions: { type: Array, required: false },
  to: { type: null, required: false },
  target: { type: [String, Object, null], required: false },
  color: { type: null, required: false },
  close: { type: [Boolean, Object], required: false },
  closeIcon: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const emits = defineEmits(["close"]);
const props = useComponentProps("banner", _props);
const { t } = useLocale();
const appConfig = useAppConfig();
const prefix = usePrefix();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.banner || {} })({
  color: props.color,
  to: !!props.to
}));
const instanceId = useId();
const id = computed(() => {
  const rawId = props.id || instanceId;
  return `banner-${rawId.replace(/[^\w-]/g, "-")}`;
});
const isVisible = ref(true);
const hasPersistence = computed(() => !!props.id);
onMounted(() => {
  if (hasPersistence.value && typeof localStorage !== "undefined") {
    const isClosed = localStorage.getItem(id.value) === "true";
    isVisible.value = !isClosed;
  }
});
useHead(() => {
  if (!hasPersistence.value) return {};
  return {
    script: [{
      key: `prehydrate-banner-${id.value}`,
      innerHTML: `
        (function() {
          try {
            if (localStorage.getItem(${JSON.stringify(id.value)}) === 'true') {
              document.documentElement.style.setProperty('--${id.value}-display', 'none');
            }
          } catch (e) {}
        })();
      `.replace(/\s+/g, " "),
      type: "text/javascript",
      tagPosition: "head"
    }],
    style: [{
      key: `banner-style-${id.value}`,
      innerHTML: `.banner[data-banner-id="${id.value}"] { display: var(--${id.value}-display, block); }`,
      tagPosition: "head"
    }]
  };
});
function onClose() {
  if (hasPersistence.value) {
    localStorage.setItem(id.value, "true");
    document.documentElement.style.setProperty(`--${id.value}-display`, "none");
  }
  isVisible.value = false;
  emits("close");
}
</script>

<template>
  <Primitive
    v-show="isVisible"
    :as="props.as"
    class="banner"
    :data-banner-id="id"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <ULink
      v-if="props.to"
      :aria-label="props.title"
      v-bind="{ to: props.to, target: props.target, ...$attrs }"
      :class="prefix('focus:outline-none')"
      tabindex="-1"
      raw
    >
      <span :class="prefix('absolute inset-0')" aria-hidden="true" />
    </ULink>

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div data-slot="left" :class="ui.left({ class: props.ui?.left })" />

      <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
        <slot name="leading" :ui="ui">
          <UIcon v-if="props.icon" :name="props.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
        </slot>

        <div v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.title }}
          </slot>
        </div>

        <div v-if="props.actions?.length || !!slots.actions" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
          <slot name="actions">
            <UButton v-for="(action, index) in props.actions" :key="index" color="neutral" size="xs" v-bind="action" />
          </slot>
        </div>
      </div>

      <div data-slot="right" :class="ui.right({ class: props.ui?.right })">
        <slot name="close" :ui="ui">
          <UButton
            v-if="props.close"
            :icon="props.closeIcon || appConfig.ui.icons.close"
            size="md"
            color="neutral"
            variant="ghost"
            :aria-label="t('banner.close')"
            v-bind="typeof props.close === 'object' ? props.close : {}"
            data-slot="close"
            :class="ui.close({ class: props.ui?.close })"
            @click="onClose"
          />
        </slot>
      </div>
    </UContainer>
  </Primitive>
</template>
