<script>
import theme from "#build/ui/blog-posts";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { omit } from "../utils";
import { tv } from "../utils/tv";
import { useComponentUI } from "../composables/useComponentUI";
import UBlogPost from "./BlogPost.vue";
const props = defineProps({
  as: { type: null, required: false },
  posts: { type: Array, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const getProxySlots = () => omit(slots, ["default"]);
const appConfig = useAppConfig();
const uiProp = useComponentUI("blogPosts", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.blogPosts || {} }));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui({ orientation, class: [uiProp?.base, props.class] })">
    <slot>
      <UBlogPost
        v-for="(post, index) in posts"
        :key="index"
        :orientation="orientation === 'vertical' ? 'horizontal' : 'vertical'"
        v-bind="post"
      >
        <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
          <slot :name="name" v-bind="slotData" :post="post" />
        </template>
      </UBlogPost>
    </slot>
  </Primitive>
</template>
