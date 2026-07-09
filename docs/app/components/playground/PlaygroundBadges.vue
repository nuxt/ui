<template>
  <div class="flex flex-col gap-3 p-4">
    <div class="flex flex-wrap gap-2">
      <UBadge label="Primary" />
      <UBadge label="Success" color="success" variant="subtle" />
      <UBadge label="Warning" color="warning" variant="subtle" />
      <UBadge label="Error" color="error" variant="subtle" />
      <UBadge label="Neutral" color="neutral" variant="outline" />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <UBadge color="success" variant="soft" icon="i-lucide-circle-check">
        Shipped
      </UBadge>
      <UBadge color="warning" variant="soft" icon="i-lucide-clock">
        Pending
      </UBadge>
      <UBadge color="neutral" variant="soft" size="lg">
        v4.9.0
      </UBadge>
    </div>
  </div>
</template>
