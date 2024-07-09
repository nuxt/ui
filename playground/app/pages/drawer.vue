<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <UDrawer v-model:open="open" title="Drawer with v-model" description="This is useful to control the state yourself.">
      <UButton color="gray" variant="outline" label="Open with v-model" />

      <template #body>
        <Placeholder class="h-48 w-full" />
      </template>

      <template #footer>
        <UButton label="Submit" color="gray" class="justify-center" />
        <UButton label="Cancel" color="gray" variant="outline" class="justify-center" @click="open = false" />
      </template>
    </UDrawer>

    <UDrawer should-scale-background title="Drawer with `should-scale-background`" description="You need to add the `vaul-drawer-wrapper` directive to your content to make it work.">
      <UButton color="gray" variant="outline" label="Open with scale" />

      <template #body>
        <Placeholder class="h-screen w-full" />
      </template>
    </UDrawer>
  </div>
</template>
