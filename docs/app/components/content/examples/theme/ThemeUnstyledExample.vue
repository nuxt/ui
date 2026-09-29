<template>
  <UTheme unstyled>
    <div class="flex flex-wrap items-center gap-2">
      <UButton label="Unstyled" class="px-3 py-1.5 rounded-full border border-default" />
      <UBadge label="Badge" :ui="{ base: 'text-xs font-semibold uppercase tracking-wide' }" />

      <UTheme :unstyled="false">
        <UButton label="Styled" />
      </UTheme>
    </div>
  </UTheme>
</template>
