import { ref, watch, onBeforeMount, onBeforeUnmount } from "vue";
export function useScrollspy() {
  const observer = ref();
  const visibleHeadings = ref([]);
  const activeHeadings = ref([]);
  function observerCallback(entries) {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (!id) {
        return;
      }
      if (entry.isIntersecting) {
        visibleHeadings.value = [...visibleHeadings.value, id];
      } else {
        visibleHeadings.value = visibleHeadings.value.filter((h) => h !== id);
      }
    });
  }
  function updateHeadings(headings) {
    headings.forEach((heading) => {
      if (!observer.value) {
        return;
      }
      observer.value.observe(heading);
    });
  }
  watch(visibleHeadings, (val, oldVal) => {
    if (val.length === 0) {
      activeHeadings.value = oldVal;
    } else {
      activeHeadings.value = val;
    }
  });
  onBeforeMount(() => observer.value = new IntersectionObserver(observerCallback));
  onBeforeUnmount(() => observer.value?.disconnect());
  return {
    visibleHeadings,
    activeHeadings,
    updateHeadings
  };
}
