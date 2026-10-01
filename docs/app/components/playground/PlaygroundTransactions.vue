<script setup lang="ts">
const studioIcons = useStudioIcons()

const transactions = computed(() => [
  { name: 'Stripe Payout', category: 'Income', icon: studioIcons.arrowDownLeft, amount: 2400.00 },
  { name: 'Blue Bottle Coffee', category: 'Food & Drink', icon: studioIcons.coffee, amount: -8.50 },
  { name: 'Whole Foods Market', category: 'Groceries', icon: studioIcons.cart, amount: -64.20 },
  { name: 'Netflix', category: 'Entertainment', icon: studioIcons.movie, amount: -19.99 }
])

function format(amount: number) {
  return `${amount < 0 ? '-' : '+'}$${Math.abs(amount).toFixed(2)}`
}
</script>

<template>
  <div>
    <div class="p-4">
      <p class="font-semibold text-strong">
        Recent transactions
      </p>
      <p class="text-sm text-muted">
        Your latest account activity.
      </p>
    </div>

    <USeparator />

    <ul class="divide-y divide-default">
      <li v-for="transaction in transactions" :key="transaction.name" class="flex items-center gap-3 px-4 py-2.5">
        <UUser
          :name="transaction.name"
          :description="transaction.category"
          :avatar="{ icon: transaction.icon }"
          :ui="{ wrapper: 'min-w-0 flex-1', name: 'truncate', description: 'truncate' }"
          class="min-w-0 flex-1 gap-3"
        />
        <span class="text-sm font-medium" :class="transaction.amount < 0 ? 'text-strong' : 'text-success'">
          {{ format(transaction.amount) }}
        </span>
      </li>
    </ul>
  </div>
</template>
