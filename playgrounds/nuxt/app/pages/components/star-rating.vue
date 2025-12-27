<script setup lang="ts">
import theme from '#build/ui/star-rating'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)

const color = ref(theme.defaultVariants.color)
const size = ref(theme.defaultVariants.size)

const rating1 = ref(0)
const rating2 = ref(3.5)
const rating3 = ref(4)
const rating4 = ref(0)
const rating5 = ref(2.5)
const readonlyRating = ref(4.5)
</script>

<template>
  <Navbar>
    <USelect v-model="color" :items="colors" placeholder="Color" />
    <USelect v-model="size" :items="sizes" placeholder="Size" />
  </Navbar>

  <div class="flex flex-col gap-8 min-h-0">
    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Basic Usage
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ rating1 }}
          </p>
          <UStarRating v-model="rating1" :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ rating2 }}
          </p>
          <UStarRating v-model="rating2" :color="color" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Half Stars
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ rating3 }} (with half stars)
          </p>
          <UStarRating v-model="rating3" allow-half :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ rating5 }} (with half stars)
          </p>
          <UStarRating v-model="rating5" allow-half :color="color" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Readonly
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ readonlyRating }} (readonly)
          </p>
          <UStarRating :model-value="readonlyRating" readonly :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: 5 (readonly, full stars)
          </p>
          <UStarRating :model-value="5" readonly :color="color" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Custom Icons
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Hearts
          </p>
          <UStarRating v-model="rating4" icon="i-lucide-heart" :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Stars (default)
          </p>
          <UStarRating v-model="rating4" icon="i-lucide-star" :color="color" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Different Colors
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Primary
          </p>
          <UStarRating :model-value="4" readonly color="primary" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Success
          </p>
          <UStarRating :model-value="4" readonly color="success" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Warning
          </p>
          <UStarRating :model-value="4" readonly color="warning" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Error
          </p>
          <UStarRating :model-value="4" readonly color="error" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Different Sizes
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Extra Small
          </p>
          <UStarRating :model-value="4" readonly :color="color" size="xs" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Small
          </p>
          <UStarRating :model-value="4" readonly :color="color" size="sm" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Medium (default)
          </p>
          <UStarRating :model-value="4" readonly :color="color" size="md" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Large
          </p>
          <UStarRating :model-value="4" readonly :color="color" size="lg" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Extra Large
          </p>
          <UStarRating :model-value="4" readonly :color="color" size="xl" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Custom Max Value
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            10 stars (rating: 7.5)
          </p>
          <UStarRating
            :model-value="7.5"
            readonly
            :max="10"
            allow-half
            :color="color"
            :size="size"
          />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            3 stars (rating: 2)
          </p>
          <UStarRating :model-value="2" readonly :max="3" :color="color" :size="size" />
        </div>
      </div>
    </div>
  </div>
</template>
