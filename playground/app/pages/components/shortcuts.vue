<template>
  <div class="w-full flex flex-col gap-4">
    <UCard class="flex-1">
      <template #header>
        <h3 class="font-bold">
          Shortcuts
        </h3>
      </template>

      <div class="space-y-2">
        <div>
          <span>{{ shortcutsState.a.label }} shortcut</span>
          <UCheckbox v-model="shortcutsState.a.disabled" :label="`Disable ${shortcutsState.a.label}`" />
          <UCheckbox v-model="shortcutsState.a.usingInput" :label="`Using in inputs ${shortcutsState.a.label}`" />
        </div>
        <div>
          <span>{{ shortcutsState.shift_i.label }} shortcut</span>
          <UCheckbox v-model="shortcutsState.shift_i.disabled" :label="`Disable ${shortcutsState.shift_i.label}`" />
          <UCheckbox v-model="shortcutsState.shift_i.usingInput" :label="`Using in inputs ${shortcutsState.shift_i.label}`" />
        </div>
        <div>
          <span>{{ shortcutsState['g-i'].label }} shortcut</span>
          <UCheckbox v-model="shortcutsState['g-i'].disabled" :label="`Disable ${shortcutsState['g-i'].label}`" />
          <UCheckbox v-model="shortcutsState['g-i'].usingInput" :label="`Using in inputs ${shortcutsState['g-i'].label}`" />
        </div>
        <UInput placeholder="Input to focus" />
      </div>
    </UCard>

    <UCard :ui="{ body: 'h-[200px] overflow-y-auto' }" class="flex-1">
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <h3 class="font-bold">
            Logs
          </h3>
          <UButton icon="i-lucide-trash" size="sm" color="neutral" class="-my-1" @click="logs = []" />
        </div>
      </template>

      <p v-for="(log, index) of logs" :key="index">
        {{ log }}
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const logs = ref<string[]>([])
const shortcutsState = ref({
  'a': {
    label: 'A',
    disabled: false,
    usingInput: false
  },
  'shift_i': {
    label: 'Shift+I',
    disabled: false,
    usingInput: false
  },
  'g-i': {
    label: 'G->I',
    disabled: false,
    usingInput: false
  }
})

const shortcuts = computed(() => {
  return Object.entries(shortcutsState.value).reduce<ShortcutsConfig>((acc, [key, { label, disabled, usingInput }]) => {
    if (disabled) {
      return acc
    }
    acc[key] = {
      handler: () => { logs.value.unshift(`"${label}" triggered`) },
      usingInput
    }
    return acc
  }, {})
})
defineShortcuts(shortcuts)
</script>
