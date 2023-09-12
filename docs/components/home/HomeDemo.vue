<script setup lang="ts">
const refs = ref([])
const section = ref()

const { stop } = useIntersectionObserver(
  section,
  ([{ isIntersecting }]) => {
    if (!isIntersecting) {
      return
    }

    refs.value.forEach(element => element.style.animationPlayState = 'running')

    stop()
  },
  { threshold: 0.3 }
)

onMounted(() => {
  refs.value.forEach((element) => {
    if (!element) {
      return
    }

    element.style.animationFillMode = 'forwards'
    element.style.transformOrigin = 'center'
    element.style.animationPlayState = 'paused'
    element.style.animationDuration = '1s'
  })
})
</script>

<template>
  <ULandingGrid ref="section" class="lg:grid-cols-10 lg:gap-8">
    <div :ref="(el) => (refs[1] = el)" class="col-span-8 flex items-center animate-top">
      <RangeExample />
    </div>

    <div :ref="(el) => (refs[2] = el)" class="col-span-2 row-span-2 flex items-center animate-right">
      <RadioExample />
    </div>

    <div :ref="(el) => (refs[4] = el)" class="col-span-2 animate-left z-[50]">
      <DropdownExampleBasic :popper="{ placement: 'bottom-start', strategy: 'absolute' }" />
    </div>

    <div
      :ref="(el) => (refs[3] = el)"
      class="col-span-6 flex flex-wrap items-center justify-between gap-1 animate-bottom"
    >
      <UAvatarGroup :max="2">
        <UAvatar
          src="https://ipx.nuxt.com/s_32x32/gh_avatar/benjamincanac"
          srcset="https://ipx.nuxt.com/s_64x64/gh_avatar/benjamincanac 2x"
          alt="benjamincanac"
          width="40"
          height="40"
        />
        <UAvatar
          src="https://ipx.nuxt.com/s_32x32/gh_avatar/Atinux"
          srcset="https://ipx.nuxt.com/s_64x64/gh_avatar/Atinux 2x"
          alt="Atinux"
          width="40"
          height="40"
        />
        <UAvatar
          src="https://ipx.nuxt.com/s_32x32/gh_avatar/smarroufin"
          srcset="https://ipx.nuxt.com/s_64x64/gh_avatar/smarroufin 2x"
          alt="smarroufin"
          width="40"
          height="40"
        />
      </UAvatarGroup>

      <UButton label="Button" icon="i-heroicons-pencil-square" />

      <UBadge label="Badge" />

      <UColorModeToggle />

      <PaginationExampleBasic />
    </div>

    <div :ref="(el) => (refs[5] = el)" class="col-span-3 row-span-8 gap-6 flex flex-col justify-between animate-left">
      <UNotification
        :id="1"
        title="Notification"
        description="This is a notification!"
        icon="i-heroicons-command-line"
        :ui="{ shadow: 'shadow' }"
        :close-button="null"
        :timeout="30000"
      />

      <TabsExampleItemCustomSlot />

      <UCard class="flex-shrink-0">
        <div class="flex items-center gap-4 justify-center">
          <USkeleton class="h-14 w-14 flex-shrink-0" :ui="{ rounded: 'rounded-full' }" />
          <div class="space-y-3 flex-1">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-4 w-2/3" />
          </div>
        </div>
      </UCard>
    </div>

    <div :ref="(el) => (refs[6] = el)" class="col-span-5 row-span-2 flex flex-col animate-bottom">
      <UCard
        :ui="{ body: { base: 'flex-1 flex flex-col overflow-y-auto', padding: '' } }"
        class="col-span-4 row-span-6 flex-1 flex flex-col"
      >
        <CommandPaletteExampleGroups />
      </UCard>
    </div>

    <div :ref="(el) => (refs[7] = el)" class="col-span-2 row-span-2 gap-6 flex flex-col animate-right ">
      <CheckboxExample />

      <InputExampleClearable />

      <UFormGroup label="Labels">
        <SelectMenuExampleCreatable />
      </UFormGroup>

      <UCard :ui="{ body: { padding: '!p-1' } }">
        <VerticalNavigationExampleAvatarSlot />
      </UCard>
    </div>

    <div :ref="(el) => (refs[8] = el)" class="col-span-7 row-span-6 animate-bottom">
      <UCard :ui="{ body: { padding: '' } }">
        <TableExampleClickable :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }" />
      </UCard>
    </div>
  </ULandingGrid>
</template>

<style scoped lang="postcss">
.animate-top {
  animation: translateDown;
}

.animate-bottom {
  animation: translateUp;
}

.animate-left {
  animation: translateLeft;
}

.animate-right {
  animation-name: translateRight;
}

@keyframes translateDown {
  0% {
    transform: translate3D(0, -100px, 0);
    opacity: 0;
  }

  100% {
    transform: translateY(0, 0, 0);
    opacity: 1;
  }
}

@keyframes translateUp {
  0% {
    transform: translate3D(0, 100px, 0);
    opacity: 0;
  }

  100% {
    transform: translateY(0, 0, 0);
    opacity: 1;
  }
}

@keyframes translateLeft {
  0% {
    transform: translate3D(-100px, 0, 0);
    opacity: 0;
  }

  100% {
    transform: translate3D(0, 0, 0);
    opacity: 1;
  }
}

@keyframes translateRight {
  0% {
    transform: translate3D(100px, 0, 0);
    opacity: 0;
  }

  100% {
    transform: translate3D(0, 0, 0);
    opacity: 1;
  }
}
</style>
