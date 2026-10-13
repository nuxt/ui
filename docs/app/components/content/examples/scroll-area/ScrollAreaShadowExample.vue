<template>
  <div class="max-w-sm bg-elevated/50 rounded-lg">
    <UScrollArea
      shadow
      class="p-4 h-72"
      :ui="{ viewport: 'gap-4' }"
    >
      <p v-for="i in 6" :key="i">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor quam. Morbi accumsan cursus enim, sed ultricies sapien.
      </p>
    </UScrollArea>
  </div>
</template>
