import { reactive, computed, onMounted } from "vue";
import { createSharedComposable } from "@vueuse/core";
export const kbdKeysMap = {
  meta: "",
  ctrl: "",
  alt: "",
  win: "\u229E",
  command: "\u2318",
  shift: "\u21E7",
  control: "\u2303",
  option: "\u2325",
  enter: "\u21B5",
  delete: "\u2326",
  backspace: "\u232B",
  escape: "Esc",
  tab: "\u21E5",
  capslock: "\u21EA",
  arrowup: "\u2191",
  arrowright: "\u2192",
  arrowdown: "\u2193",
  arrowleft: "\u2190",
  pageup: "\u21DE",
  pagedown: "\u21DF",
  home: "\u2196",
  end: "\u2198"
};
const _useKbd = () => {
  const macOS = computed(() => import.meta.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/));
  const kbdKeysSpecificMap = reactive({
    meta: " ",
    alt: " ",
    ctrl: " "
  });
  onMounted(() => {
    kbdKeysSpecificMap.meta = macOS.value ? kbdKeysMap.command : "Ctrl";
    kbdKeysSpecificMap.ctrl = macOS.value ? kbdKeysMap.control : "Ctrl";
    kbdKeysSpecificMap.alt = macOS.value ? kbdKeysMap.option : "Alt";
  });
  function getKbdKey(value) {
    if (!value) {
      return;
    }
    if (["meta", "alt", "ctrl"].includes(value)) {
      return kbdKeysSpecificMap[value];
    }
    return kbdKeysMap[value] || value;
  }
  return {
    macOS,
    getKbdKey
  };
};
export const useKbd = /* @__PURE__ */ createSharedComposable(_useKbd);
