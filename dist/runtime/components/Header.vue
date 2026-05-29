<script>
import theme from "#build/ui/header";
</script>

<script setup>
import { computed, watch, toRef } from "vue";
import { Primitive } from "reka-ui";
import { defu } from "defu";
import { createReusableTemplate } from "@vueuse/core";
import { useAppConfig, useRoute } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { getSlotChildrenText } from "../utils";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import ULink from "./Link.vue";
import UContainer from "./Container.vue";
import USlideover from "./Slideover.vue";
import UModal from "./Modal.vue";
import UDrawer from "./Drawer.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false, default: "header" },
  title: { type: String, required: false, default: "Nuxt UI" },
  to: { type: String, required: false, default: "/" },
  mode: { type: null, required: false, default: "modal" },
  menu: { type: null, required: false },
  toggle: { type: [Boolean, Object], required: false, default: true },
  toggleSide: { type: String, required: false, default: "right" },
  autoClose: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("header", _props);
const open = defineModel("open", { type: Boolean, ...{ default: false } });
const route = useRoute();
const { t } = useLocale();
const appConfig = useAppConfig();
const [DefineLeftTemplate, ReuseLeftTemplate] = createReusableTemplate();
const [DefineRightTemplate, ReuseRightTemplate] = createReusableTemplate();
const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate();
const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title());
  return (slotText || props.title || "Nuxt UI").trim();
});
watch(() => route.fullPath, () => {
  if (!props.autoClose) return;
  open.value = false;
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.header || {} })());
const Menu = computed(() => ({
  slideover: USlideover,
  modal: UModal,
  drawer: UDrawer
})[props.mode]);
const menuProps = toRef(() => defu(props.menu, {}, props.mode === "modal" ? { fullscreen: true, transition: false } : {}));
function toggleOpen() {
  open.value = !open.value;
}
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" :open="open" :toggle="toggleOpen" :ui="ui">
      <UButton
        v-if="props.toggle"
        color="neutral"
        variant="ghost"
        :aria-label="open ? t('header.close') : t('header.open')"
        :icon="open ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
        v-bind="typeof props.toggle === 'object' ? props.toggle : {}"
        data-slot="toggle"
        :class="ui.toggle({ class: props.ui?.toggle, toggleSide: props.toggleSide })"
        @click="toggleOpen"
      />
    </slot>
  </DefineToggleTemplate>

  <DefineLeftTemplate>
    <div data-slot="left" :class="ui.left({ class: props.ui?.left })">
      <ReuseToggleTemplate v-if="props.toggleSide === 'left'" />

      <slot name="left">
        <ULink :to="props.to" :aria-label="ariaLabel" data-slot="title" :class="ui.title({ class: props.ui?.title })">
          <slot name="title">
            {{ props.title }}
          </slot>
        </ULink>
      </slot>
    </div>
  </DefineLeftTemplate>

  <DefineRightTemplate>
    <div data-slot="right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" />

      <ReuseToggleTemplate v-if="props.toggleSide === 'right'" />
    </div>
  </DefineRightTemplate>

  <Primitive :as="props.as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="top" />

    <UContainer data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <ReuseLeftTemplate />

      <div data-slot="center" :class="ui.center({ class: props.ui?.center })">
        <slot />
      </div>

      <ReuseRightTemplate />
    </UContainer>

    <slot name="bottom" />
  </Primitive>

  <Menu
    v-model:open="open"
    :title="t('header.title')"
    :description="t('header.description')"
    v-bind="menuProps"
    :ui="{
  overlay: ui.overlay({ class: props.ui?.overlay }),
  content: ui.content({ class: props.ui?.content })
}"
  >
    <template #content="contentData">
      <slot name="content" v-bind="contentData">
        <div v-if="props.mode !== 'drawer'" data-slot="header" :class="ui.header({ class: props.ui?.header })">
          <ReuseLeftTemplate />

          <ReuseRightTemplate />
        </div>

        <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
          <slot name="body" />
        </div>
      </slot>
    </template>
  </Menu>
</template>
