<template>
  <UScrollArea class="h-96 w-full border border-default rounded-lg">
    <UCard>
      <template #header>
        <h3 class="font-semibold">
          Section 1
        </h3>
      </template>
      <p>Custom content without using the items prop.</p>
    </UCard>
    <UCard>
      <template #header>
        <h3 class="font-semibold">
          Section 2
        </h3>
      </template>
      <p>Any content can be placed here and it will be scrollable.</p>
    </UCard>
    <UCard>
      <template #header>
        <h3 class="font-semibold">
          Section 3
        </h3>
      </template>
      <p>You can mix different components and layouts as needed.</p>
    </UCard>
  </UScrollArea>
</template>
