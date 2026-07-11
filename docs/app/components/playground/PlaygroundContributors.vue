<script setup lang="ts">
const usernames = [
  'benjamincanac', 'romhml', 'noook', 'atinux', 'HugoRCD',
  'sandros94', 'danielroe', 'J-Michalek', 'genu', 'smarroufin'
]
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="font-semibold text-highlighted">
          Contributors
        </p>
        <p class="text-sm text-muted">
          Built by the community.
        </p>
      </div>
      <UBadge color="neutral" variant="subtle">
        312
      </UBadge>
    </div>

    <div class="flex flex-wrap gap-1.5">
      <UAvatar
        v-for="username in usernames"
        :key="username"
        :src="`https://github.com/${username}.png`"
        :alt="username"
        loading="lazy"
      />
      <div class="flex items-center justify-center size-8 rounded-full bg-elevated text-xs font-medium text-muted">
        +300
      </div>
    </div>

    <USeparator />

    <div class="flex items-start justify-between">
      <div>
        <p class="font-semibold text-highlighted">
          Un-contributors
        </p>
        <p class="text-sm text-muted">
          Making a mess.
        </p>
      </div>
      <UBadge color="neutral" variant="subtle">
        -1
      </UBadge>
    </div>

    <!-- easter egg: the studio's builder -->
    <div class="flex items-center justify-between gap-3">
      <UUser
        name="Mike Newbon"
        description="@mikenewbon"
        :avatar="{ src: 'https://github.com/mikenewbon.png', alt: 'mikenewbon' }"
        size="sm"
      />

      <UButton
        icon="i-simple-icons-github"
        color="neutral"
        variant="outline"
        size="xs"
        to="https://github.com/mikenewbon"
        target="_blank"
        aria-label="Find Mike Newbon on GitHub"
      />
    </div>
  </div>
</template>
