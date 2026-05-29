<script>
import theme from "#build/ui/drawer";
</script>

<script setup>
import { computed, toRef } from "vue";
import { VisuallyHidden } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { DrawerRoot, DrawerRootNested, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle, DrawerDescription, DrawerHandle } from "vaul-vue";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { usePortal } from "../composables/usePortal";
import { pointerDownOutside } from "../utils/overlay";
import { tv } from "../utils/tv";
const _props = defineProps({
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
const props = useComponentProps("drawer", _props);
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "activeSnapPoint", "closeThreshold", "shouldScaleBackground", "setBackgroundColorOnScale", "scrollLockTimeout", "fixed", "dismissible", "modal", "open", "defaultOpen", "nested", "direction", "noBodyStyles", "handleOnly", "preventScrollRestoration", "snapPoints"), emits);
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
  <component :is="props.nested ? DrawerRootNested : DrawerRoot" v-bind="rootProps">
    <DrawerTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot />
    </DrawerTrigger>

    <DrawerPortal v-bind="portalProps">
      <FieldGroupReset>
        <DrawerOverlay v-if="props.overlay" data-slot="overlay" :class="ui.overlay({ class: props.ui?.overlay })" />

        <DrawerContent data-slot="content" :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })" v-bind="contentProps" v-on="contentEvents">
          <DrawerHandle v-if="props.handle" data-slot="handle" :class="ui.handle({ class: props.ui?.handle })" />

          <VisuallyHidden v-if="!props.title && !slots.title || !props.description && !slots.description || !!slots.content">
            <DrawerTitle v-if="!props.title && !slots.title" />
            <DrawerTitle v-else-if="!!slots.content">
              <slot name="title">
                {{ props.title }}
              </slot>
            </DrawerTitle>

            <DrawerDescription v-if="!props.description && !slots.description" />
            <DrawerDescription v-else-if="!!slots.content">
              <slot name="description">
                {{ props.description }}
              </slot>
            </DrawerDescription>
          </VisuallyHidden>

          <slot name="content">
            <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
              <div v-if="!!slots.header || (props.title || !!slots.title) || (props.description || !!slots.description)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
                <slot name="header">
                  <DrawerTitle v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
                    <slot name="title">
                      {{ props.title }}
                    </slot>
                  </DrawerTitle>

                  <DrawerDescription v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
                    <slot name="description">
                      {{ props.description }}
                    </slot>
                  </DrawerDescription>
                </slot>
              </div>

              <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: props.ui?.body })">
                <slot name="body" />
              </div>

              <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: props.ui?.footer })">
                <slot name="footer" />
              </div>
            </div>
          </slot>
        </DrawerContent>
      </FieldGroupReset>
    </DrawerPortal>
  </component>
</template>
