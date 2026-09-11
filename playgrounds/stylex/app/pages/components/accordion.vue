<script setup lang="ts">
const pg = usePg()

const items = [{
  label: 'Getting Started',
  icon: 'i-lucide-info',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Installation',
  icon: 'i-lucide-download',
  disabled: true,
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Theming',
  icon: 'i-lucide-pipette',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Layouts',
  icon: 'i-lucide-layout-dashboard',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Components',
  slot: 'test' as const,
  icon: 'i-lucide-layers-3',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Utilities',
  slot: 'custom' as const,
  icon: 'i-lucide-wrench',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}]
</script>

<template>
  <Navbar />

  <UCard :class="pg.shrink_0" :ui="{ body: pg.important_p_0 }">
    <UAccordion :items="items" :class="pg.w_96" :ui="{ trigger: pg.px_3_5, body: pg.px_3_5 }">
      <template #body="{ item }">
        <p :class="pg.text_muted">
          {{ item.content }}
        </p>
      </template>

      <template #custom="{ item }">
        <p :class="pg.text_muted">
          Custom: {{ item.content }}
        </p>
      </template>
      <template #custom-body="{ item }">
        <p :class="pg.text_muted">
          Custom: {{ item.content }}
        </p>
      </template>
    </UAccordion>
  </UCard>
</template>
