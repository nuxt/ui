import { ref, computed, unref, onMounted, watch, reactive } from "vue";
import { useFileDialog, useDropZone } from "@vueuse/core";
function parseAcceptToDataTypes(accept) {
  if (!accept || accept === "*") {
    return void 0;
  }
  const types = accept.split(",").map((type) => {
    const trimmedType = type.trim();
    if (trimmedType.includes("/") && trimmedType.endsWith("/*")) {
      return trimmedType.split("/")[0] || trimmedType;
    }
    return trimmedType;
  }).filter((type) => {
    return !type.startsWith(".");
  });
  return types.length > 0 ? types : void 0;
}
export function useFileUpload(options) {
  const {
    accept = "*",
    reset = false,
    multiple = false,
    dropzone = true,
    onUpdate
  } = options;
  const inputRef = ref();
  const dropzoneRef = ref();
  const dataTypes = computed(() => parseAcceptToDataTypes(unref(accept)));
  const onDrop = (files, fromDropZone = false) => {
    if (!files || files.length === 0) {
      return;
    }
    if (files instanceof FileList) {
      files = Array.from(files);
    }
    if (files.length > 1 && !unref(multiple)) {
      files = [files[0]];
    }
    if (fromDropZone && inputRef.value?.$el) {
      try {
        const dt = new DataTransfer();
        files.forEach((file) => dt.items.add(file));
        inputRef.value.$el.files = dt.files;
      } catch (e) {
        console.warn("Could not sync files to input element:", e);
      }
    }
    onUpdate(files);
  };
  const isDragging = ref(false);
  const fileDialog = reactive({
    open: () => {
    }
  });
  function open() {
    fileDialog.open();
  }
  onMounted(() => {
    const { isOverDropZone } = dropzone ? useDropZone(dropzoneRef, { dataTypes: dataTypes.value, onDrop: (files) => onDrop(files, true) }) : { isOverDropZone: ref(false) };
    watch(isOverDropZone, (value) => {
      isDragging.value = value;
    });
    const { onChange, open: open2 } = useFileDialog({
      accept,
      multiple,
      input: computed(() => unref(inputRef)?.$el),
      reset
    });
    fileDialog.open = open2;
    onChange((fileList) => onDrop(fileList, false));
  });
  return {
    isDragging,
    open,
    inputRef,
    dropzoneRef
  };
}
