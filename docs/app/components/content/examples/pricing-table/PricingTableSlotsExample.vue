<script setup lang="ts">
const tiers = [
  {
    id: 'solo',
    title: 'Solo',
    price: '$249',
    description: 'For indie hackers.',
    billingCycle: '/month',
    button: { label: 'Buy now', variant: 'subtle' as const }
  },
  {
    id: 'team',
    title: 'Team',
    price: '$499',
    description: 'For growing teams.',
    billingCycle: '/month',
    button: { label: 'Buy now' },
    highlight: true
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations.',
    button: { label: 'Contact sales', color: 'neutral' as const }
  }
]

const sections = [
  {
    id: 'features',
    title: 'Features',
    features: [
      {
        id: 'developers',
        title: 'Number of developers',
        tiers: { solo: '1', team: '5', enterprise: 'Unlimited' }
      },
      {
        id: 'projects',
        title: 'Projects',
        tiers: { solo: true, team: true, enterprise: true }
      }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    features: [
      {
        title: 'SSO',
        tiers: { solo: false, team: true, enterprise: true }
      }
    ]
  }
]
</script>

<template>
  <UPricingTable :tiers="tiers" :sections="sections">
    <!-- Customize specific tier title -->
    <template #team-title="{ tier }">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-crown" class="size-4 text-amber-500" />
        {{ tier.title }}
      </div>
    </template>

    <!-- Customize specific section title -->
    <template #section-security-title="{ section }">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-shield-check" class="size-4 text-green-500" />
        <span class="font-semibold text-green-700">{{ section.title }}</span>
      </div>
    </template>

    <!-- Customize specific feature value -->
    <template #feature-developers-value="{ feature, tier }">
      <template v-if="feature.tiers?.[tier.id]">
        <UBadge :label="String(feature.tiers[tier.id])" color="primary" variant="soft" />
      </template>
      <UIcon v-else name="i-lucide-x" class="size-4 text-muted" />
    </template>
  </UPricingTable>
</template>
