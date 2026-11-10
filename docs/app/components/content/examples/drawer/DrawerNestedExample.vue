<script setup lang="ts">
const first = ref(false)
const second = ref(false)
const third = ref(false)

const ui = { container: 'max-w-xl mx-auto', footer: 'flex-row justify-end' }
</script>

<template>
  <UDrawer v-model:open="first" title="First drawer" description="Opening another drawer stacks it on top of this one." :ui="ui">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <Placeholder class="h-48" />
    </template>

    <template #footer>
      <UButton label="Close" color="neutral" variant="outline" @click="first = false" />

      <UDrawer v-model:open="second" title="Second drawer" description="The first drawer stays open behind it." :ui="ui">
        <UButton label="Open second" color="neutral" />

        <template #body>
          <Placeholder class="h-48" />
        </template>

        <template #footer>
          <UButton label="Close" color="neutral" variant="outline" @click="second = false" />

          <UDrawer v-model:open="third" title="Third drawer" description="Two drawers are stacked behind this one." :ui="ui">
            <UButton label="Open third" color="neutral" />

            <template #body>
              <Placeholder class="h-48" />
            </template>

            <template #footer>
              <UButton label="Close" color="neutral" variant="outline" @click="third = false" />
            </template>
          </UDrawer>
        </template>
      </UDrawer>
    </template>
  </UDrawer>
</template>
