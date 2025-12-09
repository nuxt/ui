<script setup lang="ts">
import theme from '#build/ui/navigation-menu'

const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)
const loop = ref(false)
const skipSnaps = ref(false)
const autoplay = ref(false)
const autoScroll = ref(false)
const autoHeight = ref(false)
const fade = ref(false)
const wheelGestures = ref(false)
const classNames = ref(false)
const arrows = ref(false)
const dots = ref(false)
const bind = computed(() => ({
  loop: loop.value,
  skipSnaps: skipSnaps.value,
  orientation: orientation.value,
  autoplay: autoplay.value,
  autoScroll: autoScroll.value,
  autoHeight: autoHeight.value,
  fade: fade.value,
  wheelGestures: wheelGestures.value,
  classNames: classNames.value,
  arrows: arrows.value,
  dots: dots.value
}))

const options = computed(() => [{
  label: 'Loop',
  type: 'checkbox' as const,
  checked: loop.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    loop.value = !loop.value
  }
}, {
  label: 'Skip Snaps',
  type: 'checkbox' as const,
  checked: skipSnaps.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    skipSnaps.value = !skipSnaps.value
  }
}, {
  label: 'Arrows',
  type: 'checkbox' as const,
  checked: arrows.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    arrows.value = !arrows.value
  }
}, {
  label: 'Dots',
  type: 'checkbox' as const,
  checked: dots.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    dots.value = !dots.value
  }
}])

const plugins = computed(() => [{
  label: 'Autoplay',
  type: 'checkbox' as const,
  checked: autoplay.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    autoplay.value = !autoplay.value
  }
}, {
  label: 'Auto Scroll',
  type: 'checkbox' as const,
  checked: autoScroll.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    autoScroll.value = !autoScroll.value
  }
}, {
  label: 'Auto Height',
  type: 'checkbox' as const,
  checked: autoHeight.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    autoHeight.value = !autoHeight.value
  }
}, {
  label: 'Fade',
  type: 'checkbox' as const,
  checked: fade.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    fade.value = !fade.value
  }
}, {
  label: 'Class Names',
  type: 'checkbox' as const,
  checked: classNames.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    classNames.value = !classNames.value
  }
}, {
  label: 'Wheel Gestures',
  type: 'checkbox' as const,
  checked: wheelGestures.value,
  onSelect: (e: Event) => {
    e.preventDefault()
    wheelGestures.value = !wheelGestures.value
  }
}])

const items = Array.from({ length: 6 }).map((_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
  description: `Description for item ${index + 1}`,
  src: `https://picsum.photos/640/640?v=${index}`
}))
</script>

<template>
  <Navbar>
    <UDropdownMenu :items="options" :content="{ align: 'end' }" :modal="false">
      <UButton :label="`Options (${options.filter(option => option.checked).length})`" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
    </UDropdownMenu>
    <UDropdownMenu :items="plugins" :content="{ align: 'end' }" :modal="false">
      <UButton :label="`Plugins (${plugins.filter(plugin => plugin.checked).length})`" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
    </UDropdownMenu>
    <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
  </Navbar>

  <div class="space-y-11 min-h-0">
    <template v-if="classNames">
      <UCarousel v-slot="{ item }" v-bind="bind" :items="items" :ui="{ item: 'basis-[70%] transition-opacity ease-in-out [&:not(.is-snapped)]:opacity-10', container: 'h-[352px]' }" class="w-full max-w-xl mx-auto">
        <img :src="item.src" class="rounded-lg">
      </UCarousel>
    </template>
    <template v-else-if="autoHeight">
      <UCarousel v-slot="{ item }" v-bind="bind" :items="items" :ui="{ container: 'transition-[height] duration-200' }" class="w-full max-w-md mx-auto">
        <img :src="item.src" class="rounded-lg">
      </UCarousel>
    </template>
    <template v-else>
      <UCarousel v-slot="{ item }" v-bind="bind" :items="items" class="w-[320px] mx-auto" :ui="{ container: 'h-[336px]' }">
        <img :src="item.src" class="rounded-lg">
      </UCarousel>

      <template v-if="orientation === 'horizontal'">
        <UCarousel v-slot="{ item }" v-bind="bind" :items="items" :ui="{ item: 'basis-1/3' }" class="w-full max-w-xs mx-auto">
          <img :src="item.src" class="rounded-lg">
        </UCarousel>
      </template>
    </template>
  </div>
</template>
