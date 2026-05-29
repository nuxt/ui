<script>
import theme from "#build/ui/prose/field";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
const _props = defineProps({
  as: { type: null, required: false },
  name: { type: String, required: false },
  type: { type: String, required: false },
  description: { type: String, required: false },
  required: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("prose.field", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.field || {} })());
</script>

<template>
  <Primitive :as="props.as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.container({ class: props.ui?.container })">
      <span v-if="props.name" :class="ui.name({ class: props.ui?.name })">
        {{ props.name }}
      </span>

      <div v-if="props.type || props.required" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <span v-if="props.type" :class="ui.type({ class: props.ui?.type })">
          {{ props.type }}
        </span>

        <span v-if="props.required" :class="ui.required({ class: props.ui?.required })">
          required
        </span>
      </div>
    </div>

    <div v-if="!!slots.default || props.description" :class="ui.description({ class: props.ui?.description })">
      <slot mdc-unwrap="p">
        {{ props.description }}
      </slot>
    </div>
  </Primitive>
</template>
