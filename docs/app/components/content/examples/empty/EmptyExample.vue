<script setup lang="ts">
import type { UserProps } from '#ui/types'

const value = ref('Can edit')
const members: UserProps[] = [
  {
    name: 'Benjamin Canac',
    description: 'benjamincanac',
    to: 'https://github.com/benjamincanac',
    target: '_blank',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  },
  {
    name: 'Romain Hamel',
    description: 'romhml',
    to: 'https://github.com/romhml',
    target: '_blank',
    avatar: {
      src: 'https://github.com/romhml.png',
      alt: 'romhml'
    }
  },
  {
    name: 'Sébastien Chopin',
    description: 'atinux',
    to: 'https://github.com/atinux',
    target: '_blank',
    avatar: {
      src: 'https://github.com/atinux.png',
      alt: 'atinux'
    }
  },
  {
    name: 'Hugo Richard',
    description: 'HugoRCD',
    to: 'https://github.com/HugoRCD',
    target: '_blank',
    avatar: {
      src: 'https://github.com/HugoRCD.png',
      alt: 'HugoRCD'
    }
  },
  {
    name: 'Sandro Circi',
    description: 'sandros94',
    to: 'https://github.com/sandros94',
    target: '_blank',
    avatar: {
      src: 'https://github.com/sandros94.png',
      alt: 'sandros94'
    }
  },
  {
    name: 'Daniel Roe',
    description: 'danielroe',
    to: 'https://github.com/danielroe',
    target: '_blank',
    avatar: {
      src: 'https://github.com/danielroe.png',
      alt: 'danielroe'
    }
  },
  {
    name: 'Jakub Michálek',
    description: 'J-Michalek',
    to: 'https://github.com/J-Michalek',
    target: '_blank',
    avatar: {
      src: 'https://github.com/J-Michalek.png',
      alt: 'J-Michalek'
    }
  },
  {
    name: 'Eugen Istoc',
    description: 'genu',
    to: 'https://github.com/genu',
    target: '_blank',
    avatar: {
      src: 'https://github.com/genu.png',
      alt: 'genu'
    }
  }
]
</script>

<template>
  <UEmpty variant="ghost" icon="i-lucide-users" title="Add team members" description="You haven’t added any team members to your project yet.">
    <template #actions>
      <UFieldGroup>
        <UInput placeholder="Enter an email" />
        <USelect v-model="value" :items="['Can edit', 'Can view']" />
      </UFieldGroup>

      <UButton label="Send invite" />
    </template>

    <template #bottom>
      <div class="grid gap-4">
        <p class="font-medium text-highlighted">
          Recommended team members
        </p>
        <div class="grid grid-cols-2 gap-2">
          <UPageCard v-for="(member, index) in members" :key="index" :to="member.to" :ui="{ container: 'flex-row items-center lg:flex' }">
            <UUser v-bind="member" />
            <UIcon name="i-lucide-plus" class="ml-auto" />
          </UPageCard>
        </div>
      </div>
    </template>
  </UEmpty>
</template>
