<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <UButton class="font-bold">
        Button
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton disabled>
        Disabled
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton loading>
        Loading
      </UButton>

      <UButton loading leading-icon="i-heroicons-rocket-launch">
        Loading
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton loading trailing>
        Loading
      </UButton>

      <UButton loading trailing-icon="i-heroicons-paper-airplane">
        Loading
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton truncate class="w-16">
        Truncate
      </UButton>
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" variant="outline" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" variant="soft" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" variant="ghost" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" variant="link" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="white" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="white" variant="ghost" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" variant="ghost" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="gray" variant="link" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="black" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" color="black" variant="link" />
    </div>
    <div class="flex items-center gap-2 -ml-[171px]">
      <UButton icon="i-heroicons-rocket-launch" label="Button" size="2xs" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" size="xs" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" size="sm" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" size="md" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" size="lg" />
      <UButton icon="i-heroicons-rocket-launch" label="Button" size="xl" />
    </div>
    <div class="flex items-center gap-2 -ml-[159px]">
      <UButton icon="i-heroicons-rocket-launch" label="Square" square size="2xs" />
      <UButton icon="i-heroicons-rocket-launch" label="Square" square size="xs" />
      <UButton icon="i-heroicons-rocket-launch" label="Square" square size="sm" />
      <UButton icon="i-heroicons-rocket-launch" label="Square" square size="md" />
      <UButton icon="i-heroicons-rocket-launch" label="Square" square size="lg" />
      <UButton icon="i-heroicons-rocket-launch" label="Square" square size="xl" />
    </div>
    <div class="flex items-center gap-2 -ml-[67px]">
      <UButton icon="i-heroicons-rocket-launch" size="2xs" />
      <UButton icon="i-heroicons-rocket-launch" size="xs" />
      <UButton icon="i-heroicons-rocket-launch" size="sm" />
      <UButton icon="i-heroicons-rocket-launch" size="md" />
      <UButton icon="i-heroicons-rocket-launch" size="lg" />
      <UButton icon="i-heroicons-rocket-launch" size="xl" />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" trailing-icon="i-heroicons-chevron-down-20-solid" label="Block" loading block />
    </div>
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-rocket-launch" label="Button" class="group">
        <template #leading="leadingProps">
          <UIcon v-if="leadingProps.icon" :name="leadingProps.icon" :class="[leadingProps.class, 'group-hover:text-white']" aria-hidden="true" />
        </template>
      </UButton>
    </div>
  </div>
</template>