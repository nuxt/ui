<script setup lang="ts">
const el = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!el.value) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', 'https://cdn.carbonads.com/carbon.js?serve=CWYIVK3E&placement=uinuxtcom')
  script.setAttribute('id', '_carbonads_js')

  el.value?.appendChild(script)
})
</script>

<template>
  <div ref="el" class="carbon" />
</template>

<style scoped>
@reference "../assets/css/main.css";

.carbon :deep(#carbonads) {
  @apply relative border border-(--ui-border) rounded-[calc(var(--ui-radius)*1.5)] hover:bg-(--ui-bg-elevated)/50 w-full transition-colors min-h-[220px] p-2;

  .carbon-img {
    @apply flex justify-center w-full;

    & > img {
      @apply !max-w-full w-full rounded-(--ui-radius);
    }
  }

  .carbon-text {
    @apply text-sm text-(--ui-text-muted) transition-colors text-center text-pretty flex pt-2;
  }

  .carbon-poweredby {
    @apply block text-[10px] text-center text-(--ui-text-dimmed) pt-2;
  }

  &:hover {
    .carbon-text {
      @apply text-(--ui-text);
    }
  }
}
</style>
