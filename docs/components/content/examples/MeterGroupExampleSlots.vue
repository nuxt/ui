<template>
  <UMeterGroup :max="128">
    <template #indicator>
      <div class="flex gap-1.5 justify-between text-sm">
        <p>86GB used</p>
        <p class="text-gray-500 dark:text-gray-400">
          42GB remaining
        </p>
      </div>
    </template>

    <UMeter :value="24" color="gray" label="System" icon="i-heroicons-cog-6-tooth" />
    <UMeter :value="8" color="red" label="Apps" icon="i-heroicons-window" />
    <UMeter :value="12" color="yellow" label="Documents" icon="i-heroicons-document" />
    <UMeter :value="42" color="green" label="Multimedia" icon="i-heroicons-film" />
  </UMeterGroup>
</template>
