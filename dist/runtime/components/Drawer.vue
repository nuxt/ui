<script>
import theme from "#build/ui/drawer";
</script>

<script setup>
import { computed, toRef } from "vue";
import { VisuallyHidden, useForwardPropsEmits } from "reka-ui";
import { DrawerRoot, DrawerRootNested, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription, DrawerHandle } from "vaul-vue";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { usePortal } from "../composables/usePortal";
import { pointerDownOutside } from "../utils/overlay";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  title: { type: String, required: false },
  description: { type: String, required: false },
  inset: { type: Boolean, required: false },
  content: { type: Object, required: false },
  overlay: { type: Boolean, required: false, default: true },
  handle: { type: Boolean, required: false, default: true },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  nested: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  activeSnapPoint: { type: [Number, String, null], required: false },
  closeThreshold: { type: Number, required: false },
  shouldScaleBackground: { type: Boolean, required: false },
  setBackgroundColorOnScale: { type: Boolean, required: false },
  scrollLockTimeout: { type: Number, required: false },
  fixed: { type: Boolean, required: false },
  dismissible: { type: Boolean, required: false, default: true },
  modal: { type: Boolean, required: false, default: true },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  direction: { type: String, required: false, default: "bottom" },
  noBodyStyles: { type: Boolean, required: false },
  handleOnly: { type: Boolean, required: false },
  preventScrollRestoration: { type: Boolean, required: false },
  snapPoints: { type: Array, required: false }
});
const emits = defineEmits(["close:prevent", "drag", "release", "close", "update:open", "update:activeSnapPoint", "animationEnd"]);
const slots = defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("drawer", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "activeSnapPoint", "closeThreshold", "shouldScaleBackground", "setBackgroundColorOnScale", "scrollLockTimeout", "fixed", "dismissible", "modal", "open", "defaultOpen", "nested", "direction", "noBodyStyles", "handleOnly", "preventScrollRestoration", "snapPoints"), emits);
const portalProps = usePortal(toRef(() => props.portal));
const contentProps = toRef(() => props.content);
const contentEvents = computed(() => {
  if (!props.dismissible) {
    const events = ["interactOutside", "escapeKeyDown"];
    return events.reduce((acc, curr) => {
      acc[curr] = (e) => {
        e.preventDefault();
        emits("close:prevent");
      };
      return acc;
    }, {});
  }
  return {
    pointerDownOutside
  };
});
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.drawer || {} })({
  direction: props.direction,
  inset: props.inset,
  snapPoints: props.snapPoints && props.snapPoints.length > 0
}));
</script>

<template>
  <component :is="nested ? DrawerRootNested : DrawerRoot" v-bind="rootProps">
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal v-bind="portalProps">
      <FieldGroupReset>
        <DrawerOverlay v-if="overlay" data-slot="overlay" :class="ui.overlay({ class: uiProp?.overlay })" />

        <DrawerContent data-slot="content" :class="ui.content({ class: [!slots.default && props.class, uiProp?.content] })" v-bind="contentProps" v-on="contentEvents">
          <DrawerHandle v-if="handle" data-slot="handle" :class="ui.handle({ class: uiProp?.handle })" />

          <VisuallyHidden v-if="!title && !slots.title || !description && !slots.description || !!slots.content">
            <DrawerTitle v-if="!title && !slots.title" />
            <DrawerTitle v-else-if="!!slots.content">
              <slot name="title">
                {{ title }}
              </slot>
            </DrawerTitle>

            <DrawerDescription v-if="!description && !slots.description" />
            <DrawerDescription v-else-if="!!slots.content">
              <slot name="description">
                {{ description }}
              </slot>
            </DrawerDescription>
          </VisuallyHidden>

          <slot name="content">
            <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
              <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description)" data-slot="header" :class="ui.header({ class: uiProp?.header })">
                <slot name="header">
                  <DrawerTitle v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
                    <slot name="title">
                      {{ title }}
                    </slot>
                  </DrawerTitle>

                  <DrawerDescription v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
                    <slot name="description">
                      {{ description }}
                    </slot>
                  </DrawerDescription>
                </slot>
              </div>

              <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: uiProp?.body })">
                <slot name="body" />
              </div>

              <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
                <slot name="footer" />
              </div>
            </div>
          </slot>
        </DrawerContent>
      </FieldGroupReset>
    </DrawerPortal>
  </component>
</template>
