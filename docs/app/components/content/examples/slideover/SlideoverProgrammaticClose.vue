<template>
  <USlideover
    title="Sliderover with close method"
    description="This is useful when you want to close the slider over from within the content without creating a new ref."
  >
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body="{ close }">
      <div class="space-y-4">
        <p>You can close this slider over using the close method exposed in the slots.</p>
        <UButton label="Close Slideover" color="primary" @click="close" />
      </div>
    </template>

    <template #footer="{ close }">
      <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
      <UButton label="Submit" color="neutral" />
    </template>
  </USlideover>
</template>
