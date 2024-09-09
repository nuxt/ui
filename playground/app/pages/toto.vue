
<template>
  <UContainer class="min-h-screen flex items-center">
    <UCard class="flex-1">
      <template #header> Welcome to the playground! </template>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField name="files" label="Files">
          <UInput
            type="file"
            icon="i-heroicons-folder"
            multiple
            @change="onChange"
          />
        </UFormField>
        <UButton type="submit"> Upload </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';

const schema = z.object({
  files: z
    .unknown()
    .transform((value) => value as FileList | undefined)
    .refine((list) => list?.length ?? 0 > 0, {
      message: 'At least one file is required',
    }),
});
type Schema = z.infer<typeof schema>;

const state = reactive<Schema>({
  files: [] as unknown as FileList,
});

async function onSubmit({ data: { files } }: FormSubmitEvent<Schema>) {
  console.log(files);
}

async function onChange(event) {
  state.files = event.target.files
}
</script>
