import { ref, computed, unref, isRef, watch } from "vue";
import { useStorage } from "@vueuse/core";
import { useCookie } from "#imports";
import { useLocale } from "./useLocale.js";
export function useResizable(key, options = {}, { collapsed = ref(false) } = {}) {
  const el = ref(null);
  const opts = computed(() => ({
    side: "left",
    minSize: 0,
    maxSize: 100,
    defaultSize: 0,
    storage: "cookie",
    persistent: true,
    collapsible: false,
    collapsedSize: 0,
    resizable: true,
    unit: "%",
    ...isRef(options) ? options.value : options
  }));
  const { dir } = useLocale();
  const defaultStorageValue = {
    size: opts.value.defaultSize,
    collapsed: unref(collapsed) ?? false
  };
  const storageData = opts.value.persistent && (opts.value.resizable || opts.value.collapsible) ? opts.value.storage === "cookie" ? useCookie(key, { default: () => defaultStorageValue }) : useStorage(key, defaultStorageValue) : ref(defaultStorageValue);
  const isCollapsed = computed({
    get: () => storageData.value.collapsed,
    set: (value) => {
      if (!opts.value.collapsible) {
        return;
      }
      if (isRef(collapsed)) {
        collapsed.value = value;
      }
      storageData.value.collapsed = value;
    }
  });
  const previousSize = ref(opts.value.defaultSize);
  const size = computed({
    get: () => storageData.value.size,
    set: (value) => {
      storageData.value.size = value;
    }
  });
  const currentSize = computed(() => isCollapsed.value ? opts.value.collapsedSize : size.value);
  const isDragging = ref(false);
  const onMouseMove = (e, initialPos, initialSize) => {
    if (!el.value || !opts.value.resizable) {
      return;
    }
    const parentSize = el.value.parentElement?.offsetWidth || 1;
    const isRtl = dir.value === "rtl";
    let delta;
    if (isRtl) {
      delta = opts.value.side === "left" ? initialPos - e.clientX : e.clientX - initialPos;
    } else {
      delta = opts.value.side === "left" ? e.clientX - initialPos : initialPos - e.clientX;
    }
    const newSize = initialSize + delta;
    let newValue;
    if (opts.value.unit === "rem") {
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      newValue = newSize / rootFontSize;
    } else if (opts.value.unit === "px") {
      newValue = newSize;
    } else {
      newValue = newSize / parentSize * 100;
    }
    if (opts.value.collapsible && newValue < opts.value.collapsedSize + 4) {
      collapse(true);
      return;
    } else if (isCollapsed.value) {
      collapse(false);
    }
    size.value = Math.min(opts.value.maxSize, Math.max(opts.value.minSize, newValue));
  };
  const onMouseDown = (e) => {
    if (!el.value || !opts.value.resizable) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const elWidth = el.value.getBoundingClientRect().width;
    if (!elWidth) {
      return;
    }
    const initialX = e.clientX;
    const initialWidth = elWidth;
    isDragging.value = true;
    const handleMouseMove = (e2) => {
      onMouseMove(e2, initialX, initialWidth);
    };
    const handleMouseUp = () => {
      isDragging.value = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const onTouchMove = (e, initialPos, initialSize) => {
    if (!el.value || !opts.value.resizable || !e.touches[0]) {
      return;
    }
    const parentSize = el.value.parentElement?.offsetWidth || 1;
    const isRtl = dir.value === "rtl";
    let delta;
    if (isRtl) {
      delta = opts.value.side === "left" ? initialPos - e.touches[0].clientX : e.touches[0].clientX - initialPos;
    } else {
      delta = opts.value.side === "left" ? e.touches[0].clientX - initialPos : initialPos - e.touches[0].clientX;
    }
    const newSize = initialSize + delta;
    let newValue;
    if (opts.value.unit === "rem") {
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      newValue = newSize / rootFontSize;
    } else if (opts.value.unit === "px") {
      newValue = newSize;
    } else {
      newValue = newSize / parentSize * 100;
    }
    if (opts.value.collapsible && newValue < opts.value.collapsedSize + 4) {
      collapse(true);
      return;
    } else if (isCollapsed.value) {
      collapse(false);
    }
    size.value = Math.min(opts.value.maxSize, Math.max(opts.value.minSize, newValue));
  };
  const onTouchStart = (e) => {
    if (!el.value || !opts.value.resizable || !e.touches[0]) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const elWidth = el.value.getBoundingClientRect().width;
    if (!elWidth) {
      return;
    }
    const initialX = e.touches[0].clientX;
    const initialWidth = elWidth;
    isDragging.value = true;
    const handleTouchMove = (e2) => {
      onTouchMove(e2, initialX, initialWidth);
    };
    const handleTouchEnd = () => {
      isDragging.value = false;
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);
  };
  const onDoubleClick = (e) => {
    if (!el.value || !opts.value.resizable) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (isCollapsed.value) {
      collapse(false);
    }
    size.value = opts.value.defaultSize;
  };
  const collapse = (value) => {
    if (!opts.value.collapsible) {
      return;
    }
    const newCollapsed = value ?? !isCollapsed.value;
    if (newCollapsed && !isCollapsed.value) {
      previousSize.value = size.value;
    } else if (!newCollapsed && isCollapsed.value) {
      size.value = previousSize.value;
    }
    isCollapsed.value = newCollapsed;
  };
  if (isRef(collapsed) && storageData.value.collapsed) {
    collapsed.value = storageData.value.collapsed;
  }
  if (isRef(collapsed)) {
    watch(collapsed, (value) => {
      if (!opts.value.collapsible) {
        return;
      }
      if (storageData.value.collapsed !== value) {
        storageData.value.collapsed = value;
      }
    });
  }
  return {
    el,
    size: currentSize,
    isDragging,
    isCollapsed,
    onMouseDown,
    onTouchStart,
    onDoubleClick,
    collapse
  };
}
