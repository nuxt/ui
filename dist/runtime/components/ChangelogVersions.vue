<script>
import theme from "#build/ui/changelog-versions";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { Motion, useScroll, useSpring, useTransform } from "motion-v";
import { defu } from "defu";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import UChangelogVersion from "./ChangelogVersion.vue";
const _props = defineProps({
  as: { type: null, required: false },
  versions: { type: Array, required: false },
  indicator: { type: [Boolean, Object], required: false, default: true },
  indicatorMotion: { type: [Boolean, Object], required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("changelogVersions", _props);
const getProxySlots = () => omit(slots, ["default", "indicator"]);
const appConfig = useAppConfig();
const springOptions = computed(() => defu(typeof props.indicatorMotion === "object" ? props.indicatorMotion : {}, { damping: 30, restDelta: 1e-3 }));
const scrollOptions = computed(() => typeof props.indicator === "object" ? props.indicator : {});
const { scrollYProgress } = useScroll(scrollOptions.value);
const y = useSpring(scrollYProgress, springOptions);
const height = useTransform(() => `${Number(y.get()) * 100}%`);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.changelogVersions || {} })());
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!props.indicator || !!slots.indicator" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
      <slot name="indicator">
        <Motion v-if="!!props.indicatorMotion" data-slot="beam" :class="ui.beam({ class: props.ui?.beam })" :style="{ height }" />
      </slot>
    </div>

    <div v-if="props.versions?.length || !!slots.default" data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <slot>
        <UChangelogVersion
          v-for="(version, index) in props.versions"
          :key="index"
          :indicator="!!props.indicator"
          v-bind="version"
        >
          <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
            <slot :name="name" v-bind="slotData" :version="version" />
          </template>
        </UChangelogVersion>
      </slot>
    </div>
  </Primitive>
</template>
