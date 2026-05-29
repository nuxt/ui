<script>
import theme from "#build/ui/toast";
</script>

<script setup>
import { ref, computed, onMounted, useTemplateRef } from "vue";
import { ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose } from "reka-ui";
import { useForwardProps } from "../composables/useForwardProps";
import { reactivePick } from "@vueuse/core";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UIcon from "./Icon.vue";
import UAvatar from "./Avatar.vue";
import UButton from "./Button.vue";
import UProgress from "./Progress.vue";
const _props = defineProps({
  as: { type: null, required: false },
  title: { type: [String, Object, Function], required: false },
  description: { type: [String, Object, Function], required: false },
  icon: { type: null, required: false },
  avatar: { type: Object, required: false },
  color: { type: null, required: false },
  orientation: { type: null, required: false, default: "vertical" },
  close: { type: [Boolean, Object], required: false, default: true },
  closeIcon: { type: null, required: false },
  actions: { type: Array, required: false },
  progress: { type: [Boolean, Object], required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  defaultOpen: { type: Boolean, required: false },
  open: { type: Boolean, required: false },
  type: { type: String, required: false },
  duration: { type: Number, required: false }
});
const emits = defineEmits(["escapeKeyDown", "pause", "resume", "swipeStart", "swipeMove", "swipeCancel", "swipeEnd", "update:open"]);
const slots = defineSlots();
const props = useComponentProps("toast", _props);
const { t } = useLocale();
const appConfig = useAppConfig();
const rootProps = useForwardProps(reactivePick(props, "as", "defaultOpen", "open", "duration", "type"), emits);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.toast || {} })({
  color: props.color,
  orientation: props.orientation,
  title: !!props.title || !!slots.title
}));
const rootRef = useTemplateRef("rootRef");
const height = ref(0);
onMounted(() => {
  if (!rootRef.value?.$el?.getBoundingClientRect) {
    return;
  }
  height.value = rootRef.value.$el.getBoundingClientRect().height;
});
defineExpose({
  height
});
</script>

<template>
  <ToastRoot
    ref="rootRef"
    v-slot="{ remaining, duration, open }"
    v-bind="rootProps"
    :data-orientation="props.orientation"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{ '--height': height }"
  >
    <slot name="leading" :ui="ui">
      <UAvatar v-if="props.avatar" :size="props.ui?.avatarSize || ui.avatarSize()" v-bind="props.avatar" data-slot="avatar" :class="ui.avatar({ class: props.ui?.avatar })" />
      <UIcon v-else-if="props.icon" :name="props.icon" data-slot="icon" :class="ui.icon({ class: props.ui?.icon })" />
    </slot>

    <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
      <ToastTitle v-if="props.title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
          <component :is="props.title()" v-if="typeof props.title === 'function'" />
          <component :is="props.title" v-else-if="typeof props.title === 'object'" />
          <template v-else>
            {{ props.title }}
          </template>
        </slot>
      </ToastTitle>
      <ToastDescription v-if="props.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description">
          <component :is="props.description()" v-if="typeof props.description === 'function'" />
          <component :is="props.description" v-else-if="typeof props.description === 'object'" />
          <template v-else>
            {{ props.description }}
          </template>
        </slot>
      </ToastDescription>

      <div v-if="props.orientation === 'vertical' && (props.actions?.length || !!slots.actions)" data-slot="actions" :class="ui.actions({ class: props.ui?.actions })">
        <slot name="actions">
          <ToastAction v-for="(action, index) in props.actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="props.color" v-bind="action" />
          </ToastAction>
        </slot>
      </div>
    </div>

    <div v-if="props.orientation === 'horizontal' && (props.actions?.length || !!slots.actions) || props.close" data-slot="actions" :class="ui.actions({ class: props.ui?.actions, orientation: 'horizontal' })">
      <template v-if="props.orientation === 'horizontal' && (props.actions?.length || !!slots.actions)">
        <slot name="actions">
          <ToastAction v-for="(action, index) in props.actions" :key="index" :alt-text="action.label || 'Action'" as-child @click.stop>
            <UButton size="xs" :color="props.color" v-bind="action" />
          </ToastAction>
        </slot>
      </template>

      <ToastClose v-if="props.close || !!slots.close" as-child>
        <slot name="close" :ui="ui">
          <UButton
            v-if="props.close"
            :icon="props.closeIcon || appConfig.ui.icons.close"
            color="neutral"
            variant="link"
            :aria-label="t('toast.close')"
            v-bind="typeof props.close === 'object' ? props.close : {}"
            data-slot="close"
            :class="ui.close({ class: props.ui?.close })"
            @click.stop
          />
        </slot>
      </ToastClose>
    </div>

    <UProgress
      v-if="props.progress && open && remaining > 0 && duration"
      :model-value="remaining / duration * 100"
      :color="props.color"
      v-bind="typeof props.progress === 'object' ? props.progress : {}"
      size="sm"
      data-slot="progress"
      :class="ui.progress({ class: props.ui?.progress })"
    />
  </ToastRoot>
</template>
