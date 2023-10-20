<template>
  <UMeterGroup :max="128">
    <template #indicator>
      <div class="flex flex-row gap-2 justify-between">
        <div>86GB used</div>
        <div>42GB remaining</div>
      </div>
    </template>

    <UMeter :value="24" color="gray" label="System" icon="i-heroicons-cog-6-tooth" />
    <UMeter :value="8" color="red" label="Apps" icon="i-heroicons-window" />
    <UMeter :value="12" color="yellow" label="Documents" icon="i-heroicons-document" />
    <UMeter :value="42" color="green" label="Multimedia" icon="i-heroicons-film" />
  </UMeterGroup>
</template>
