<script>
import theme from "#build/ui/modal";
</script>

<script setup>
import { computed, toRef } from "vue";
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose, VisuallyHidden, useForwardPropsEmits } from "reka-ui";
import { reactivePick, createReusableTemplate } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { FieldGroupReset } from "../composables/useFieldGroup";
import { useLocale } from "../composables/useLocale";
import { usePortal } from "../composables/usePortal";
import { pointerDownOutside } from "../utils/overlay";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
const props = defineProps({
  title: { type: String, required: false },
  description: { type: String, required: false },
  content: { type: Object, required: false },
  overlay: { type: Boolean, required: false, default: true },
  scrollable: { type: Boolean, required: false },
  transition: { type: Boolean, required: false, default: true },
  fullscreen: { type: Boolean, required: false },
  portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
  close: { type: [Boolean, Object], required: false, default: true },
  closeIcon: { type: null, required: false },
  dismissible: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  modal: { type: Boolean, required: false, default: true }
});
const emits = defineEmits(["after:leave", "after:enter", "close:prevent", "update:open"]);
const slots = defineSlots();
const { t } = useLocale();
const appConfig = useAppConfig();
const uiProp = useComponentUI("modal", props);
const rootProps = useForwardPropsEmits(reactivePick(props, "open", "defaultOpen", "modal"), emits);
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
    pointerDownOutside: (e) => pointerDownOutside(e, { scrollable: props.scrollable })
  };
});
const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.modal || {} })({
  transition: props.transition,
  fullscreen: props.fullscreen,
  overlay: props.overlay,
  scrollable: props.scrollable
}));
</script>

<template>
  <DialogRoot v-slot="{ open, close }" v-bind="rootProps">
    <DefineContentTemplate>
      <DialogContent
        data-slot="content"
        :class="ui.content({ class: [!slots.default && props.class, uiProp?.content] })"
        v-bind="contentProps"
        @after-enter="emits('after:enter')"
        @after-leave="emits('after:leave')"
        v-on="contentEvents"
      >
        <VisuallyHidden v-if="!title && !slots.title || !description && !slots.description || !!slots.content">
          <DialogTitle v-if="!title && !slots.title" />
          <DialogTitle v-else-if="!!slots.content">
            <slot name="title">
              {{ title }}
            </slot>
          </DialogTitle>

          <DialogDescription v-if="!description && !slots.description" />
          <DialogDescription v-else-if="!!slots.content">
            <slot name="description">
              {{ description }}
            </slot>
          </DialogDescription>
        </VisuallyHidden>

        <slot name="content" :close="close">
          <div v-if="!!slots.header || (title || !!slots.title) || (description || !!slots.description) || (props.close || !!slots.close)" data-slot="header" :class="ui.header({ class: uiProp?.header })">
            <slot name="header" :close="close">
              <div v-if="title || !!slots.title || description || !!slots.description" data-slot="wrapper" :class="ui.wrapper({ class: uiProp?.wrapper })">
                <DialogTitle v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
                  <slot name="title">
                    {{ title }}
                  </slot>
                </DialogTitle>

                <DialogDescription v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
                  <slot name="description">
                    {{ description }}
                  </slot>
                </DialogDescription>
              </div>

              <slot name="actions" />

              <DialogClose v-if="props.close || !!slots.close" as-child>
                <slot name="close" :ui="ui">
                  <UButton
                    v-if="props.close"
                    :icon="closeIcon || appConfig.ui.icons.close"
                    color="neutral"
                    variant="ghost"
                    :aria-label="t('modal.close')"
                    v-bind="typeof props.close === 'object' ? props.close : {}"
                    data-slot="close"
                    :class="ui.close({ class: uiProp?.close })"
                  />
                </slot>
              </DialogClose>
            </slot>
          </div>

          <div v-if="!!slots.body" data-slot="body" :class="ui.body({ class: uiProp?.body })">
            <slot name="body" :close="close" />
          </div>

          <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
            <slot name="footer" :close="close" />
          </div>
        </slot>
      </DialogContent>
    </DefineContentTemplate>

    <DialogTrigger v-if="!!slots.default" as-child :class="props.class">
      <slot :open="open" />
    </DialogTrigger>

    <DialogPortal v-bind="portalProps">
      <FieldGroupReset>
        <template v-if="scrollable">
          <DialogOverlay data-slot="overlay" :class="ui.overlay({ class: uiProp?.overlay })">
            <ReuseContentTemplate />
          </DialogOverlay>
        </template>

        <template v-else>
          <DialogOverlay v-if="overlay" data-slot="overlay" :class="ui.overlay({ class: uiProp?.overlay })" />

          <ReuseContentTemplate />
        </template>
      </FieldGroupReset>
    </DialogPortal>
  </DialogRoot>
</template>
