<script setup lang="ts">
const extra = useStudioExtraIcons()

const transactions = [
  { name: 'Stripe Payout', category: 'Income', icon: 'i-lucide-arrow-down-left', amount: 2400.00 },
  { name: 'Blue Bottle Coffee', category: 'Food & Drink', icon: extra.coffee, amount: -8.50 },
  { name: 'Whole Foods Market', category: 'Groceries', icon: extra.cart, amount: -64.20 },
  { name: 'Netflix', category: 'Entertainment', icon: extra.movie, amount: -19.99 }
]

function format(amount: number) {
  return `${amount < 0 ? '-' : '+'}$${Math.abs(amount).toFixed(2)}`
}
</script>

<template>
  <div>
    <div class="p-4">
      <p class="font-semibold text-highlighted">
        Recent transactions
      </p>
      <p class="text-sm text-muted">
        Your latest account activity.
      </p>
    </div>

    <USeparator />

    <ul class="divide-y divide-default">
      <li v-for="transaction in transactions" :key="transaction.name" class="flex items-center gap-3 px-4 py-2.5">
        <div class="flex items-center justify-center size-8 rounded-full bg-elevated text-muted shrink-0">
          <UIcon :name="transaction.icon" class="size-4" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-highlighted truncate">
            {{ transaction.name }}
          </p>
          <p class="text-xs text-muted truncate">
            {{ transaction.category }}
          </p>
        </div>
        <span class="text-sm font-medium" :class="transaction.amount < 0 ? 'text-highlighted' : 'text-success'">
          {{ format(transaction.amount) }}
        </span>
      </li>
    </ul>
  </div>
</template>
