<script setup lang="ts">
import icons from '../../../../src/theme/icons'

const toast = useToast()
const { copy } = useClipboard()

const appConfig = useAppConfig()
const data = computed(() => Object.entries(icons).map(([key, icon]) => {
  return {
    key: key,
    default: icon
  }
}))

const custom = ref<Record<string, string>>(icons)

function setLibrary(name: string) {
  if (name === 'phosphor') {
    custom.value = {
      arrowDown: 'i-ph-arrow-down',
      arrowLeft: 'i-ph-arrow-left',
      arrowRight: 'i-ph-arrow-right',
      arrowUp: 'i-ph-arrow-up',
      caution: 'i-ph-warning-circle',
      check: 'i-ph-check',
      chevronDoubleLeft: 'i-ph-caret-double-left',
      chevronDoubleRight: 'i-ph-caret-double-right',
      chevronDown: 'i-ph-caret-down',
      chevronLeft: 'i-ph-caret-left',
      chevronRight: 'i-ph-caret-right',
      chevronUp: 'i-ph-caret-up',
      close: 'i-ph-x',
      copy: 'i-ph-copy',
      copyCheck: 'i-ph-check-circle',
      dark: 'i-ph-moon',
      drag: 'i-ph-dots-six-vertical',
      ellipsis: 'i-ph-dots-three',
      error: 'i-ph-x-circle',
      external: 'i-ph-arrow-up-right',
      eye: 'i-ph-eye',
      eyeOff: 'i-ph-eye-slash',
      file: 'i-ph-file',
      folder: 'i-ph-folder',
      folderOpen: 'i-ph-folder-open',
      hash: 'i-ph-hash',
      info: 'i-ph-info',
      light: 'i-ph-sun',
      loading: 'i-ph-circle-notch',
      menu: 'i-ph-list',
      minus: 'i-ph-minus',
      panelClose: 'i-ph-caret-left',
      panelOpen: 'i-ph-caret-right',
      plus: 'i-ph-plus',
      reload: 'i-ph-arrow-counter-clockwise',
      search: 'i-ph-magnifying-glass',
      stop: 'i-ph-square',
      success: 'i-ph-check-circle',
      system: 'i-ph-monitor',
      tip: 'i-ph-lightbulb',
      upload: 'i-ph-upload',
      warning: 'i-ph-warning'
    }
  } else if (name === 'tabler') {
    custom.value = {
      arrowDown: 'i-tabler-arrow-down',
      arrowLeft: 'i-tabler-arrow-left',
      arrowRight: 'i-tabler-arrow-right',
      arrowUp: 'i-tabler-arrow-up',
      caution: 'i-tabler-alert-square-rounded',
      check: 'i-tabler-check',
      chevronDoubleLeft: 'i-tabler-chevrons-left',
      chevronDoubleRight: 'i-tabler-chevrons-right',
      chevronDown: 'i-tabler-chevron-down',
      chevronLeft: 'i-tabler-chevron-left',
      chevronRight: 'i-tabler-chevron-right',
      chevronUp: 'i-tabler-chevron-up',
      close: 'i-tabler-x',
      copy: 'i-tabler-copy',
      copyCheck: 'i-tabler-copy-check',
      dark: 'i-tabler-moon',
      drag: 'i-tabler-grip-vertical',
      ellipsis: 'i-tabler-dots',
      error: 'i-tabler-square-rounded-x',
      external: 'i-tabler-external-link',
      eye: 'i-tabler-eye',
      eyeOff: 'i-tabler-eye-off',
      file: 'i-tabler-file',
      folder: 'i-tabler-folder',
      folderOpen: 'i-tabler-folder-open',
      hash: 'i-tabler-hash',
      info: 'i-tabler-info-square-rounded',
      light: 'i-tabler-sun',
      loading: 'i-tabler-loader-2',
      menu: 'i-tabler-menu',
      minus: 'i-tabler-minus',
      panelClose: 'i-tabler-layout-sidebar-left-collapse',
      panelOpen: 'i-tabler-layout-sidebar-left-expand',
      plus: 'i-tabler-plus',
      reload: 'i-tabler-reload',
      search: 'i-tabler-search',
      stop: 'i-tabler-player-stop',
      success: 'i-tabler-square-rounded-check',
      system: 'i-tabler-device-desktop',
      tip: 'i-tabler-bulb',
      upload: 'i-tabler-upload',
      warning: 'i-tabler-alert-triangle'
    }
  }
  toast.add({
    title: `Preset ${name} defined`,
    icon: 'i-lucide-check-circle'
  })
}

function copyToClipboard() {
  copy(`{
${Object.entries(custom.value).map(([key, value]) => `  ${key}: '${value}',`).join('\n')}
}`)
  toast.add({
    title: 'Copied to clipboard',
    icon: 'i-lucide-check-circle'
  })
}
</script>

<template>
  <UModal fullscreen :ui="{ title: 'space-x-4' }" title="Icons Theme Configurator">
    <UButton label="Icons Theme Configurator" icon="i-lucide-brush" />
    <template #body>
      <div class="flex justify-between">
        <UFieldGroup>
          <UButton color="neutral" variant="subtle" label="Set a library preset" />
          <UButton color="neutral" variant="outline" label="Phosphor" @click="setLibrary('phosphor')" />
          <UButton color="neutral" variant="outline" label="Tabler" @click="setLibrary('tabler')" />
        </UFieldGroup>

        <UButton label="Copy configuration" color="neutral" :icon="appConfig.ui.icons.copy" @click="copyToClipboard()" />
      </div>

      <UTable :data="data" class="w-full" :columns="[{ accessorKey: 'key' }, { accessorKey: 'default' }, { accessorKey: 'custom' }]" sticky>
        <template #default-header>
          <div class="text-center">
            Default
          </div>
        </template>
        <template #default-cell="{ row }">
          <div class="flex flex-col gap-2 items-center">
            <div>{{ row.original.default }}</div>
            <UAvatar :icon="row.original.default" size="xl" />
          </div>
        </template>
        <template #custom-header>
          <div class="text-center">
            Custom
          </div>
        </template>
        <template #custom-cell="{ row }">
          <div class="flex flex-col gap-2 items-center">
            <UInput v-model="custom[row.original.key]" />
            <UAvatar :icon="custom[row.original.key]" size="xl" />
          </div>
        </template>
      </UTable>
    </template>
  </UModal>
</template>
