<script setup lang="ts">
import * as z from 'zod'
import theme from '#build/ui/input-rating'

const toast = useToast()

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)

const color = ref(theme.defaultVariants.color)
const size = ref(theme.defaultVariants.size)

const rating1 = ref(0)
const rating2 = ref(3)
const rating3 = ref(4)
const rating4 = ref(0)
const rating5 = ref(2.5)
const readonlyRating = ref(4.5)
const formRating = ref(0)
const ratingNoRing = ref(0)
const ratingClearable = ref(3)

const formSchema = z.object({
  rating: z.number().min(1, 'Please select a rating')
})

type FormSchema = z.input<typeof formSchema>

const formState = reactive<Partial<FormSchema>>({
  rating: formRating.value
})

watch(formRating, (value) => {
  formState.rating = value
})
</script>

<template>
  <Navbar>
    <USelect v-model="color" :items="colors" placeholder="Color" />
    <USelect v-model="size" :items="sizes" placeholder="Size" />
  </Navbar>

  <div class="flex flex-col gap-8 min-h-0 min-w-2xl">
    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Basic Usage
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ rating1 }}
          </p>
          <UInputRating v-model="rating1" :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ rating2 }}
          </p>
          <UInputRating v-model="rating2" :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ ratingNoRing }} (no focus ring)
          </p>
          <UInputRating
            v-model="ratingNoRing"
            :color="color"
            :size="size"
            :ui="{ star: 'focus-within:ring-0' }"
          />
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
          <UInputRating v-model="rating3" allow-half :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ rating5 }} (with half stars)
          </p>
          <UInputRating v-model="rating5" allow-half :color="color" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Clearable
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ ratingClearable }} (click same star to clear)
          </p>
          <UInputRating v-model="ratingClearable" clearable :color="color" :size="size" />
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
          <UInputRating :model-value="readonlyRating" readonly :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: 5 (readonly, full stars)
          </p>
          <UInputRating :model-value="5" readonly :color="color" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Disabled
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: {{ readonlyRating }} (disabled)
          </p>
          <UInputRating :model-value="readonlyRating" disabled :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Rating: 5 (disabled, full stars)
          </p>
          <UInputRating :model-value="5" disabled :color="color" :size="size" />
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
          <UInputRating v-model="rating4" icon="i-lucide-heart" :color="color" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Stars (default)
          </p>
          <UInputRating v-model="rating4" icon="i-lucide-star" :color="color" :size="size" />
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
          <UInputRating :model-value="4" readonly color="primary" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Success
          </p>
          <UInputRating :model-value="4" readonly color="success" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Warning
          </p>
          <UInputRating :model-value="4" readonly color="warning" :size="size" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Error
          </p>
          <UInputRating :model-value="4" readonly color="error" :size="size" />
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
          <UInputRating :model-value="4" readonly :color="color" size="xs" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Small
          </p>
          <UInputRating :model-value="4" readonly :color="color" size="sm" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Medium (default)
          </p>
          <UInputRating :model-value="4" readonly :color="color" size="md" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Large
          </p>
          <UInputRating :model-value="4" readonly :color="color" size="lg" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Extra Large
          </p>
          <UInputRating :model-value="4" readonly :color="color" size="xl" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">
        Orientation
      </h2>
      <div class="flex flex-col gap-4">
        <div>
          <p class="text-sm text-muted mb-2">
            Horizontal (default)
          </p>
          <UInputRating :model-value="4" readonly :color="color" :size="size" orientation="horizontal" />
        </div>
        <div>
          <p class="text-sm text-muted mb-2">
            Vertical
          </p>
          <UInputRating
            :model-value="4"
            readonly
            :color="color"
            :size="size"
            orientation="vertical"
          />
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
          <UInputRating
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
          <UInputRating :model-value="2" readonly :max="3" :color="color" :size="size" />
        </div>
      </div>
    </div>

    <USeparator />

    <div class="pb-8">
      <UPageCard title="Form Integration with Required">
        <UForm
          :state="formState"
          :schema="formSchema"
          class="flex flex-col gap-4 max-w-md"
          @submit="(event) => {
            event.preventDefault()
            toast.add({
              title: 'Rating submitted',
              description: `Your rating of ${event.data.rating} ${event.data.rating === 1 ? 'star' : 'stars'} has been saved.`,
              icon: 'i-lucide-check-circle',
              color: 'success'
            })
          }"
        >
          <UFormField label="Rating" name="rating" required>
            <UInputRating v-model="formRating" :color="color" :size="size" />
          </UFormField>
          <div class="flex items-center gap-2">
            <UButton type="submit">
              Submit
            </UButton>
            <p class="text-sm text-muted">
              Current rating value: <span class="font-semibold text-highlighted">{{ formRating }}</span>
            </p>
          </div>
        </UForm>
      </UPageCard>
    </div>
  </div>
</template>
