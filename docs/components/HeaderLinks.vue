<template>
  <div class="flex items-center justify-between gap-3 h-16">
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-3">
        <NuxtLink to="/getting-started" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
          <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />

          <span class="hidden sm:block">NuxtLabs</span><span class="sm:text-primary-500 dark:sm:text-primary-400">UI</span>
        </NuxtLink>
      </div>
    </div>

    <div class="flex items-center justify-end flex-1 -mr-1.5 gap-3">
      <DocsSearchButton class="ml-1.5 flex-1 lg:flex-none lg:w-48" />

      <div class="flex items-center lg:gap-1.5">
        <UPopover>
          <template #default="{ open }">
            <UButton color="gray" variant="ghost" square :class="[open && 'bg-gray-50 dark:bg-gray-800']">
              <UIcon name="i-heroicons-swatch-20-solid" class="w-5 h-5 text-primary-500 dark:text-primary-400" />
            </UButton>
          </template>

          <template #panel>
            <ColorPicker />
          </template>
        </UPopover>

        <ColorModeButton />

        <UButton
          to="https://twitter.com/nuxtlabs"
          target="_blank"
          color="gray"
          variant="ghost"
          icon="i-simple-icons-twitter"
        />

        <UButton
          to="https://github.com/nuxtlabs/ui"
          target="_blank"
          color="gray"
          variant="ghost"
          icon="i-simple-icons-github"
        />

        <UButton
          color="gray"
          variant="ghost"
          class="lg:hidden"
          :icon="isDialogOpen ? 'i-heroicons-x-mark-20-solid' : 'i-heroicons-bars-3-20-solid'"
          @click="isDialogOpen = !isDialogOpen"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean, links: { to: string, label: string }[] }>()
const emit = defineEmits(['update:modelValue'])

const isDialogOpen = useVModel(props, 'modelValue', emit)
</script>
