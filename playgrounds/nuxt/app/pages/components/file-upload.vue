<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import theme from '#build/ui/file-upload'

const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)
const layouts = Object.keys(theme.variants.layout)
const positions = Object.keys(theme.variants.position)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

const variant = ref(theme.defaultVariants.variant)
const layout = ref('grid' as keyof typeof theme.variants.layout)
const position = ref('outside' as keyof typeof theme.variants.position)

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const schema = z.object({
  avatar: z
    .instanceof(File, {
      message: 'Please select an image file.'
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine(file => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Please upload a valid image file (JPEG, PNG, or WebP).'
    })
    .refine(
      file =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
              const meetsDimensions
                = img.width >= MIN_DIMENSIONS.width
                  && img.height >= MIN_DIMENSIONS.height
                  && img.width <= MAX_DIMENSIONS.width
                  && img.height <= MAX_DIMENSIONS.height
              resolve(meetsDimensions)
            }
            img.src = e.target?.result as string
          }
          reader.readAsDataURL(file)
        }),
      {
        message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`
      }
    )
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  avatar: undefined
})

const value = ref<File | null>(null)
const valueMultiple = ref<File[]>([])

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
    <USelect v-model="variant" :items="variants" placeholder="Variant" />
    <USelect v-model="layout" :items="layouts" placeholder="Layout" />
    <USelect v-model="position" :items="positions" placeholder="Position" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="w-80">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField name="avatar" label="Avatar" description="JPG, GIF or PNG. 1MB Max." v-bind="props">
        <UFileUpload v-slot="{ open, removeFile }" v-model="state.avatar" accept="image/*">
          <div class="flex flex-wrap items-center gap-3">
            <UAvatar size="lg" :src="state.avatar ? createObjectUrl(state.avatar) : undefined" icon="i-lucide-image" />

            <UButton :label="state.avatar ? 'Change image' : 'Upload image'" color="neutral" @click="open()" />
          </div>

          <p v-if="state.avatar" class="text-xs text-muted mt-1.5">
            {{ state.avatar.name }}

            <UButton
              label="Remove"
              color="error"
              variant="link"
              size="xs"
              class="p-0"
              @click="removeFile()"
            />
          </p>
        </UFileUpload>
      </UFormField>

      <UButton label="Submit" type="submit" :size="props?.size" />
    </UForm>

    <UFileUpload
      v-model="value"
      label="Drop your image here"
      description="SVG, PNG, JPG or GIF (max. 2MB)"
      :variant="variant"
      :layout="layout"
      :position="position"
      v-bind="props"
      :class="variant === 'area' ? 'w-full min-h-44' : ''"
    />

    <UFileUpload
      v-model="valueMultiple"
      icon="i-lucide-image"
      label="Drop your images here"
      description="SVG, PNG, JPG or GIF (max. 2MB)"
      multiple
      :interactive="false"
      :variant="variant"
      :layout="layout"
      :position="position"
      v-bind="props"
      class="w-full min-h-44"
    >
      <template #actions="{ open }">
        <UButton
          label="Select images"
          icon="i-lucide-upload"
          color="neutral"
          variant="outline"
          :size="props?.size"
          @click="open()"
        />
      </template>

      <template v-if="layout === 'grid' || position === 'inside'" #files-top="{ open, files }">
        <div v-if="files?.length" class="mb-2 flex items-center justify-between">
          <p class="font-bold">
            Files ({{ files?.length }})
          </p>

          <UButton
            label="Add files"
            color="neutral"
            variant="outline"
            :size="props?.size"
            class="-my-2"
            @click="open()"
          />
        </div>
      </template>

      <template v-if="layout === 'list'" #files-bottom="{ removeFile, files }">
        <UButton
          v-if="files?.length"
          label="Remove files"
          color="neutral"
          variant="outline"
          class="self-start"
          :size="props?.size"
          @click="removeFile(0)"
        />
      </template>
    </UFileUpload>
  </Matrix>
</template>
