<template>
  <div class="flex items-center gap-4">
    <div class="flex flex-col items-start gap-2 text-sm">
      <ULink raw>
        Button raw
      </ULink>

      <ULink active>
        Button active
      </ULink>
      <ULink active class="font-medium" active-class="text-gray-900 dark:text-white">
        Button active with class
      </ULink>
      <ULink active disabled>
        Button active disabled
      </ULink>

      <ULink>
        Button inactive
      </ULink>
      <ULink class="font-medium" inactive-class="hover:text-primary-500 dark:hover:text-primary-400">
        Button inactive with class
      </ULink>
      <ULink disabled>
        Button inactive disabled
      </ULink>
    </div>

    <div class="flex flex-col items-start gap-2 text-sm">
      <ULink to="/components/link" raw>
        Link raw
      </ULink>

      <ULink to="/components/link">
        Link active
      </ULink>
      <ULink to="/components/link" class="font-medium" active-class="text-gray-900 dark:text-white">
        Link active with class
      </ULink>
      <ULink to="/components/link" disabled>
        Link active disabled
      </ULink>

      <ULink to="/components/button">
        Link inactive
      </ULink>
      <ULink to="/components/button" class="font-medium" inactive-class="hover:text-primary-500 dark:hover:text-primary-400">
        Link inactive with class
      </ULink>
      <ULink to="/components/button" disabled>
        Link inactive disabled
      </ULink>
    </div>
  </div>
</template>
