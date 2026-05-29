<script>
import theme from "#build/ui/sidebar";
</script>

<script setup>
import { computed, onMounted, ref, toRef, watch } from "vue";
import { Primitive } from "reka-ui";
import { defu } from "defu";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import USlideover from "./Slideover.vue";
import UModal from "./Modal.vue";
import UDrawer from "./Drawer.vue";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  as: { type: null, required: false, default: "aside" },
  variant: { type: null, required: false, default: "sidebar" },
  collapsible: { type: null, required: false, default: "offcanvas" },
  side: { type: null, required: false, default: "left" },
  title: { type: String, required: false },
  description: { type: String, required: false },
  close: { type: [Boolean, Object], required: false, default: false },
  closeIcon: { type: null, required: false },
  rail: { type: Boolean, required: false, default: false },
  mode: { type: null, required: false, default: "slideover" },
  menu: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("sidebar", _props);
const [DefineInnerTemplate, ReuseInnerTemplate] = createReusableTemplate();
const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
const mediaQuery = useMediaQuery("(max-width: 1023px)");
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});
const isMobile = computed(() => isMounted.value && mediaQuery.value);
const modelOpen = defineModel("open", { type: Boolean, ...{ default: true } });
const openMobile = ref(false);
const desktopOpen = ref(modelOpen.value);
const open = computed({
  get: () => isMobile.value ? openMobile.value : modelOpen.value,
  set: (value) => {
    if (isMobile.value) {
      openMobile.value = value;
    } else {
      modelOpen.value = value;
    }
  }
});
watch(isMobile, (mobile) => {
  if (mobile) {
    desktopOpen.value = modelOpen.value;
    modelOpen.value = false;
  } else {
    modelOpen.value = desktopOpen.value;
  }
}, { immediate: true });
watch(modelOpen, (value) => {
  if (isMobile.value) {
    openMobile.value = value;
  }
});
watch(openMobile, (value) => {
  if (isMobile.value) {
    modelOpen.value = value;
  }
});
const { t } = useLocale();
const appConfig = useAppConfig();
const state = computed(() => open.value ? "expanded" : "collapsed");
const canClose = computed(() => props.close && props.collapsible !== "none" || isMobile.value);
function closeSidebar() {
  open.value = false;
}
const hasHeader = computed(() => !!slots.header || props.title || !!slots.title || props.description || !!slots.description || !!slots.actions || canClose.value || !!slots.close);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.sidebar || {} })({
  side: props.side,
  variant: props.variant,
  collapsible: props.collapsible
}));
const Menu = computed(() => ({
  slideover: USlideover,
  modal: UModal,
  drawer: UDrawer
})[props.mode]);
const menuProps = toRef(() => defu(props.menu, {
  title: props.title,
  description: props.description,
  close: props.close,
  closeIcon: props.closeIcon
}, props.mode === "modal" ? {} : props.mode === "slideover" ? { side: props.side, inset: props.variant === "inset" } : {}));
</script>

<template>
  <DefineContentTemplate>
    <div v-if="hasHeader" data-slot="header" :class="ui.header({ class: props.ui?.header })">
      <slot name="header" :state="state" :open="open" :close="closeSidebar">
        <div v-if="props.title || !!slots.title || props.description || !!slots.description" data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
          <p v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
            <slot name="title" :state="state">
              {{ props.title }}
            </slot>
          </p>

          <p v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :state="state">
              {{ props.description }}
            </slot>
          </p>
        </div>

        <div v-if="!!slots.actions || canClose" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
          <slot name="actions" :state="state" />

          <slot name="close" :state="state" :ui="ui">
            <UButton
              v-if="canClose"
              :icon="props.closeIcon || appConfig.ui.icons.close"
              color="neutral"
              variant="ghost"
              :aria-label="t('sidebar.close')"
              v-bind="typeof props.close === 'object' ? props.close : {}"
              data-slot="close"
              :class="ui.close({ class: props.ui?.close })"
              @click="closeSidebar"
            />
          </slot>
        </div>
      </slot>
    </div>

    <div data-slot="body" :class="ui.body({ class: props.ui?.body })">
      <slot :state="state" :open="open" :close="closeSidebar" />
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
      <slot name="footer" :state="state" :open="open" :close="closeSidebar" />
    </div>
  </DefineContentTemplate>

  <DefineInnerTemplate>
    <div data-slot="inner" :class="ui.inner({ class: props.ui?.inner })">
      <ReuseContentTemplate />
    </div>
  </DefineInnerTemplate>

  <!-- Non-collapsible: simple inline sidebar -->
  <Primitive
    v-if="props.collapsible === 'none'"
    :as="props.as"
    v-bind="$attrs"
    data-slot="root"
    :data-variant="props.variant"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <ReuseInnerTemplate />
  </Primitive>

  <!-- Collapsible: fixed sidebar with gap spacer + mobile menu -->
  <template v-else>
    <Primitive
      :as="props.as"
      v-bind="$attrs"
      data-slot="root"
      :data-state="state"
      :data-collapsible="state === 'collapsed' ? props.collapsible : void 0"
      :data-variant="props.variant"
      :data-side="props.side"
      :class="ui.root({ class: [props.ui?.root, props.class] })"
    >
      <!-- Gap spacer: reserves layout space for the fixed sidebar -->
      <div
        data-slot="gap"
        :data-state="state"
        :class="ui.gap({ class: props.ui?.gap })"
      />

      <!-- Fixed container: the actual visible sidebar -->
      <div
        data-slot="container"
        :data-state="state"
        :class="ui.container({ class: props.ui?.container })"
      >
        <ReuseInnerTemplate />

        <slot v-if="props.rail" name="rail" :state="state" :ui="ui">
          <button
            data-slot="rail"
            :data-state="state"
            :aria-label="t('sidebar.toggle')"
            :tabindex="-1"
            :class="ui.rail({ class: props.ui?.rail })"
            @click="open = !open"
          />
        </slot>
      </div>
    </Primitive>

    <!-- Mobile menu -->
    <Menu
      v-if="isMobile"
      v-model:open="openMobile"
      v-bind="menuProps"
    >
      <template #content="contentData">
        <slot name="content" v-bind="contentData" :close="closeSidebar">
          <ReuseContentTemplate />
        </slot>
      </template>
    </Menu>
  </template>
</template>
