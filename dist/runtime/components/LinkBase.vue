<script>

</script>

<script setup>
import { Primitive } from "reka-ui";
const props = defineProps({
  as: { type: String, required: false, default: "button" },
  type: { type: String, required: false, default: "button" },
  disabled: { type: Boolean, required: false },
  onClick: { type: [Function, Array], required: false },
  href: { type: String, required: false },
  navigate: { type: Function, required: false },
  target: { type: [String, Object, null], required: false },
  rel: { type: [String, Object, null], required: false },
  active: { type: Boolean, required: false },
  isExternal: { type: Boolean, required: false }
});
function onClickWrapper(e) {
  if (props.disabled) {
    e.stopPropagation();
    e.preventDefault();
    return;
  }
  if (props.onClick) {
    for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) {
      onClick(e);
    }
  }
  if (props.href && props.navigate && !props.isExternal) {
    props.navigate(e);
  }
}
</script>

<template>
  <Primitive
    v-bind="href ? {
  'as': 'a',
  'href': disabled ? void 0 : href,
  'aria-disabled': disabled ? 'true' : void 0,
  'role': disabled ? 'link' : void 0,
  'tabindex': disabled ? -1 : void 0
} : as === 'button' ? {
  as,
  type,
  disabled
} : {
  as
}"
    :rel="rel"
    :target="target"
    @click="onClickWrapper"
  >
    <slot />
  </Primitive>
</template>
