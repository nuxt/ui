<script>
import theme from "#build/ui/prose/img";
</script>

<script setup>
import { ref, computed, useId } from "vue";
import { DialogRoot, DialogPortal, DialogTrigger } from "reka-ui";
import { AnimatePresence, Motion } from "motion-v";
import { useEventListener, createReusableTemplate } from "@vueuse/core";
import { useRuntimeConfig, useAppConfig } from "#imports";
import ImageComponent from "#build/ui-image-component";
import { useComponentProps } from "../../composables/useComponentProps";
import { resolveBaseURL } from "../../utils";
import { tv } from "../../utils/tv";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  width: { type: [String, Number], required: false },
  height: { type: [String, Number], required: false },
  class: { type: null, required: false },
  zoom: { type: Boolean, required: false, default: true },
  ui: { type: Object, required: false }
});
const props = useComponentProps("prose.img", _props);
const appConfig = useAppConfig();
const [DefineImageTemplate, ReuseImageTemplate] = createReusableTemplate();
const [DefineZoomedImageTemplate, ReuseZoomedImageTemplate] = createReusableTemplate();
const open = ref(false);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.img || {} })({
  zoom: props.zoom,
  open: open.value,
  width: !!props.width
}));
const refinedSrc = computed(() => resolveBaseURL(props.src, useRuntimeConfig().app.baseURL));
const layoutId = computed(() => `${refinedSrc.value}::${useId()}`);
if (props.zoom) {
  useEventListener(window, "scroll", () => {
    open.value = false;
  });
  useEventListener(window, "keydown", (e) => {
    if (e.key === "Escape" && open.value) {
      open.value = false;
    }
  });
}
</script>

<template>
  <DefineImageTemplate>
    <component
      :is="ImageComponent"
      :src="refinedSrc"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      v-bind="$attrs"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    />
  </DefineImageTemplate>

  <DefineZoomedImageTemplate>
    <component
      :is="ImageComponent"
      :src="refinedSrc"
      :alt="props.alt"
      v-bind="$attrs"
      :class="ui.zoomedImage({ class: [props.ui?.zoomedImage] })"
    />
  </DefineZoomedImageTemplate>

  <DialogRoot v-if="props.zoom" v-slot="{ close }" v-model:open="open" :modal="false">
    <DialogTrigger as-child>
      <Motion :layout-id="layoutId" as-child :transition="{ type: 'spring', bounce: 0.15, duration: 0.5, ease: 'easeInOut' }">
        <ReuseImageTemplate />
      </Motion>
    </DialogTrigger>

    <DialogPortal>
      <AnimatePresence>
        <Motion v-if="open" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :class="ui.overlay({ class: [props.ui?.overlay] })" />

        <div v-if="open" :class="ui.content({ class: [props.ui?.content] })" @click="close">
          <Motion as-child :layout-id="layoutId" :transition="{ type: 'spring', bounce: 0.15, duration: 0.5, ease: 'easeInOut' }">
            <ReuseZoomedImageTemplate />
          </Motion>
        </div>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>

  <ReuseImageTemplate v-else />
</template>
