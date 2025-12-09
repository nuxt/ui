<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

const props = defineProps<{
  links: TocLink[]
}>()

const isHovered = ref(false)

function flattenLinks(links: TocLink[]): TocLink[] {
  return links.flatMap(link => [link, ...flattenLinks(link.children || [])])
}

const flatLinks = computed(() => flattenLinks(props.links))

const { activeHeadings, updateHeadings } = useScrollspy()

onMounted(() => {
  const headings = flatLinks.value
    .map(link => document.getElementById(link.id))
    .filter(Boolean) as Element[]

  updateHeadings(headings)
})

const activeId = computed(() => activeHeadings.value[0] || '')

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <Motion
    tag="nav"
    aria-label="Table of contents"
    :initial="{ opacity: 0, x: 10 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ delay: 0.5, duration: 0.3 }"
    class="z-50"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <Motion
      :animate="{ width: isHovered ? 200 : 20 }"
      :transition="{ type: 'spring', stiffness: 600, damping: 35 }"
      class="overflow-hidden backdrop-blur-sm transition-colors duration-150"
      :class="isHovered ? 'bg-elevated/90 ring-1 ring-default' : 'bg-transparent'"
    >
      <div class="flex flex-col py-1" :class="isHovered ? 'gap-0.5 px-2' : 'gap-[3px] px-1'">
        <button
          v-for="link in flatLinks"
          :key="link.id"
          type="button"
          class="group flex items-center gap-1.5 rounded-sm text-left transition-all duration-100"
          :class="[
            activeId === link.id
              ? 'text-primary'
              : 'text-muted hover:text-highlighted',
            link.depth === 3 ? 'pl-2' : '',
            isHovered ? 'py-0.5' : ''
          ]"
          @click="scrollToSection(link.id)"
        >
          <span
            class="shrink-0 transition-all duration-100"
            :class="activeId === link.id ? 'bg-primary' : 'bg-muted group-hover:bg-highlighted/60'"
            :style="{
              width: isHovered ? '2px' : link.depth === 2 ? '16px' : '10px',
              height: isHovered ? '16px' : '3px'
            }"
          />

          <Motion
            :animate="{
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : -5
            }"
            :transition="{ duration: 0.1 }"
            class="truncate text-[11px] leading-tight"
          >
            {{ link.text }}
          </Motion>
        </button>
      </div>
    </Motion>
  </Motion>
</template>
