<script setup lang="ts">
const pg = usePg()

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
  <Navbar />

  <UPricingTable :tiers="tiers" :sections="sections">
    <!-- Customize specific tier title -->
    <template #team-title="{ tier }">
      <div :class="pg.flex_items_center_gap_2">
        <UIcon name="i-lucide-crown" :class="pg.size_4_text_amber_500" />
        {{ tier.title }}
      </div>
    </template>

    <!-- Customize specific section title -->
    <template #section-security-title="{ section }">
      <div :class="pg.flex_items_center_gap_2">
        <UIcon name="i-lucide-shield-check" :class="pg.size_4_text_green_500" />
        <span :class="pg.font_semibold_text_green_700">{{ section.title }}</span>
      </div>
    </template>

    <!-- Customize specific feature value -->
    <template #feature-developers-value="{ feature, tier }">
      <template v-if="feature.tiers?.[tier.id]">
        <UBadge :label="String(feature.tiers[tier.id])" color="primary" variant="soft" />
      </template>
      <UIcon v-else name="i-lucide-x" :class="pg.size_4_text_muted" />
    </template>
  </UPricingTable>
</template>
