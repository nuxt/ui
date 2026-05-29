<script>
import theme from "#build/ui/error";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { clearError, useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useLocale } from "../composables/useLocale";
import { tv } from "../utils/tv";
import UButton from "./Button.vue";
import UIcon from "./Icon.vue";
const _props = defineProps({
  as: { type: null, required: false, default: "main" },
  icon: { type: null, required: false },
  error: { type: Object, required: false },
  redirect: { type: String, required: false, default: "/" },
  clear: { type: [Boolean, Object], required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("error", _props);
const { t } = useLocale();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.error || {} })());
function handleError() {
  clearError({ redirect: props.redirect });
}
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="props.icon || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="props.icon" :name="props.icon" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </slot>
    </div>
    <p v-if="!!props.error?.statusCode || !!props.error?.status || !!slots.statusCode" data-slot="statusCode" :class="ui.statusCode({ class: props.ui?.statusCode })">
      <slot name="statusCode">
        {{ props.error?.statusCode || props.error?.status }}
      </slot>
    </p>
    <h1 v-if="!!props.error?.statusMessage || !!props.error?.statusText || !!slots.statusMessage" data-slot="statusMessage" :class="ui.statusMessage({ class: props.ui?.statusMessage })">
      <slot name="statusMessage">
        {{ props.error?.statusMessage || props.error?.statusText }}
      </slot>
    </h1>
    <p v-if="props.error?.message && props.error.message !== (props.error.statusMessage || props.error.statusText) || !!slots.message" data-slot="message" :class="ui.message({ class: props.ui?.message })">
      <slot name="message">
        {{ props.error?.message }}
      </slot>
    </p>
    <div v-if="!!props.clear || !!slots.links" data-slot="links" :class="ui.links({ class: props.ui?.links })">
      <slot name="links">
        <UButton
          v-if="props.clear"
          size="lg"
          color="primary"
          variant="solid"
          :label="t('error.clear')"
          v-bind="typeof props.clear === 'object' ? props.clear : {}"
          @click="handleError"
        />
      </slot>
    </div>
  </Primitive>
</template>
