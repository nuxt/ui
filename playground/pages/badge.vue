<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <UBadge class="font-bold">
        Badge
      </UBadge>
    </div>
    <div class="flex items-center gap-2">
      <UBadge label="Badge" />
      <UBadge label="Badge" variant="outline" />
      <UBadge label="Badge" variant="soft" />
      <UBadge label="Badge" variant="subtle" />
    </div>
    <div class="flex items-center gap-2">
      <UBadge label="Badge" color="white" />
    </div>
    <div class="flex items-center gap-2">
      <UBadge label="Badge" color="gray" />
    </div>
    <div class="flex items-center gap-2">
      <UBadge label="Badge" color="black" />
    </div>
    <div class="flex items-center gap-2 -ml-[56px]">
      <UBadge label="Badge" size="xs" />
      <UBadge label="Badge" size="sm" />
      <UBadge label="Badge" size="md" />
      <UBadge label="Badge" size="lg" />
    </div>
  </div>
</template>
