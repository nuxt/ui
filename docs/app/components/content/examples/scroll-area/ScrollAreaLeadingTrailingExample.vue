<script setup lang="ts">
const notifications = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: ['New comment on your PR', 'Deployment succeeded', 'Review requested', 'Issue assigned to you', 'Build failed'][i % 5]!,
  description: ['Benjamin left a comment on #42', 'v1.4.2 deployed to production', 'Mike requested your review on #38', 'Bug: scroll area overflow on mobile', 'CI pipeline failed on main'][i % 5]!,
  time: `${Math.floor(i / 2) + 1}h ago`,
  icon: ['i-lucide-message-square', 'i-lucide-rocket', 'i-lucide-eye', 'i-lucide-circle-dot', 'i-lucide-circle-x'][i % 5]!,
  read: i < 3
}))

const unreadCount = computed(() => notifications.filter(n => !n.read).length)
</script>

<template>
  <UScrollArea
    :items="notifications"
    class="w-full h-96"
  >
    <template #leading>
      <div class="flex items-center justify-between px-4 py-3 border-b border-default">
        <span class="text-sm font-medium text-highlighted">Notifications</span>
        <UBadge :label="`${unreadCount} unread`" variant="subtle" size="sm" />
      </div>
    </template>

    <template #default="{ item }">
      <div class="flex gap-3 px-4 py-3 border-b border-default" :class="[!item.read && 'bg-elevated/50']">
        <UIcon :name="item.icon" class="size-5 text-muted shrink-0 mt-0.5" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-highlighted truncate">
            {{ item.title }}
          </p>
          <p class="text-sm text-muted truncate">
            {{ item.description }}
          </p>
        </div>
        <span class="text-xs text-dimmed shrink-0">{{ item.time }}</span>
      </div>
    </template>

    <template #trailing>
      <div class="flex items-center justify-center gap-2 p-6 text-sm text-muted">
        <UIcon name="i-lucide-check-circle" class="size-4" />
        You're all caught up
      </div>
    </template>
  </UScrollArea>
</template>
