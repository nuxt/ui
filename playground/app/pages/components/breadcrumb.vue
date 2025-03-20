<script setup lang="ts">
import type { BreadcrumbItem, DropdownMenuItem } from '#ui/types'

type BreadcrumbItemWithChildren = BreadcrumbItem & { children?: DropdownMenuItem[] }

const items = ref([{
  label: 'Home',
  to: '/',
  onClick: () => console.log('click Home')
}, {
  slot: 'dropdown' as const,
  icon: 'i-lucide-ellipsis',
  children: [{
    label: 'Documentation'
  }, {
    label: 'Themes',
    onSelect: () => console.log('select Themes')
  }, {
    label: 'GitHub'
  }]
} as BreadcrumbItemWithChildren, {
  label: 'Components',
  disabled: true,
  to: '/components',
  onClick: (e) => {
    console.log('click Components (should not fire when disabled)')
    console.log('prevent default nav')
    e.preventDefault()
  }
}, {
  label: 'Breadcrumb',
  to: '/components/breadcrumb',
  onClick: () => console.log('click Breadcrumb')
}] as BreadcrumbItem[])
</script>

<template>
  <div class="flex flex-col gap-2">
    <UBreadcrumb :items="items">
      <template #dropdown="{ item }">
        <UDropdownMenu :items="(item as BreadcrumbItemWithChildren).children">
          <UButton :icon="item.icon" color="neutral" variant="link" class="p-0.5" />
        </UDropdownMenu>
      </template>
    </UBreadcrumb>
    <USwitch v-if="items[2]" v-model="items[2].disabled" label="Components item disabled" />
  </div>
</template>
