<script setup lang="ts">
import type { UserProps } from '@nuxt/ui'

const members: UserProps[] = [
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
    name: 'Pooya Parsa',
    description: 'pi0',
    to: 'https://github.com/pi0',
    target: '_blank',
    avatar: {
      src: 'https://github.com/pi0.png',
      alt: 'pi0'
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
    name: 'Benjamin Canac',
    description: 'benjamincanac',
    to: 'https://github.com/benjamincanac',
    target: '_blank',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  }
]
</script>

<template>
  <UEmpty
    title="No team members"
    description="Invite your team to collaborate on this project."
    variant="naked"
    :actions="[{
      label: 'Invite members',
      icon: 'i-lucide-user-plus',
      color: 'neutral'
    }]"
  >
    <template #leading>
      <UAvatarGroup size="xl">
        <UAvatar src="https://github.com/nuxt.png" alt="Nuxt" />
        <UAvatar src="https://github.com/unjs.png" alt="Unjs" />
      </UAvatarGroup>
    </template>

    <template #footer>
      <USeparator class="my-4" />

      <div class="grid grid-cols-2 gap-4">
        <UPageCard
          v-for="(member, index) in members"
          :key="index"
          :to="member.to"
          :ui="{ container: 'sm:p-4' }"
        >
          <UUser
            :avatar="member.avatar"
            :name="member.name"
            :description="member.description"
            :ui="{ name: 'truncate' }"
          />
        </UPageCard>
      </div>
    </template>
  </UEmpty>
</template>
