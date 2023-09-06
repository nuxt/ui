<template>
  <ULandingGrid class="lg:grid-cols-10 lg:gap-x-8 lg:auto-rows-[2rem] lg:gap-y-6">
    <div class="col-span-8 flex items-center">
      <RangeExample />
    </div>

    <div class="col-span-2 row-span-2 flex items-center">
      <RadioExample />
    </div>

    <div class="col-span-2">
      <DropdownExampleBasic :popper="{ placement: 'bottom-start', strategy: 'absolute' }" />
    </div>

    <div class="col-span-6 flex flex-wrap items-center justify-between gap-1">
      <UAvatarGroup :max="2">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
        <UAvatar src="https://avatars.githubusercontent.com/u/904724?v=4" alt="Atinux" />
        <UAvatar src="https://avatars.githubusercontent.com/u/7547335?v=4" alt="smarroufin" />
      </UAvatarGroup>

      <UButton label="Button" icon="i-heroicons-pencil-square" />

      <UBadge label="Badge" />

      <UColorModeToggle />

      <PaginationExampleBasic />
    </div>

    <div class="col-span-3 row-span-8 gap-6 flex flex-col">
      <UNotification :id="1" title="Notification" description="This is a notification!" icon="i-heroicons-command-line" />

      <TabsExampleItemCustomSlot />

      <UCard class="flex-shrink-0" :ui="{ body: { padding: 'sm:py-4' } }">
        <div class="flex items-center gap-4 justify-center mt-1">
          <USkeleton class="h-14 w-14 flex-shrink-0" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-3 flex-1">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-2/3" />
          </div>
        </div>
      </UCard>
    </div>

    <div class="col-span-5 row-span-5 flex flex-col -mb-4">
      <UCard :ui="{ body: { base: 'flex-1 flex flex-col overflow-y-auto', padding: '' } }" class="col-span-4 row-span-6 flex-1 flex flex-col">
        <CommandPaletteExampleGroups />
      </UCard>
    </div>

    <div class="col-span-2 row-span-5 gap-6 flex flex-col">
      <CheckboxExample />

      <InputExampleClearable />

      <UFormGroup label="User">
        <SelectMenuExampleAsyncSearch />
      </UFormGroup>

      <VerticalNavigationExampleAvatarSlot />
    </div>

    <div class="col-span-7 row-span-6">
      <UCard :ui="{ body: { padding: '' } }" class="mt-4">
        <TableExampleClickable :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }" />
      </UCard>
    </div>
  </ULandingGrid>
</template>
