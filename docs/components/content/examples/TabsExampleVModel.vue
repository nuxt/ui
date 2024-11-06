<script setup lang="ts">
const items = [{
  label: 'Tab1',
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Tab2',
  icon: 'i-heroicons-arrow-down-tray',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tab3',
  icon: 'i-heroicons-eye-dropper',
  content: 'Finally, this is the content for Tab3'
}]

const route = useRoute()
const router = useRouter()

const selected = computed({
  get() {
    const index = items.findIndex(item => item.label === route.query.tab)
    if (index === -1) {
      return 0
    }

    return index
  },
  set(value) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.replace({ query: { tab: items[value].label }, hash: '#control-the-selected-index' })
  }
})
</script>

<template>
  <UTabs v-model="selected" :items="items" />
</template>
