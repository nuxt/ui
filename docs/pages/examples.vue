<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="space-y-4">
    <div class="pb-10 border-b u-border-gray-200 mb-10">
      <div>
        <h1 class="inline-block text-3xl font-extrabold u-text-gray-900 tracking-tight">
          Examples
        </h1>
      </div>

      <p class="mt-1 text-lg u-text-gray-500">
        Examples of real-life usage of components.
      </p>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Avatar:
      </div>

      <UAvatar src="https://picsum.photos/200/300" />
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Button:
      </div>

      <UButton variant="primary" icon="i-heroicons-envelope">
        Button text
      </UButton>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Modal:
      </div>

      <UButton @click="toggleModalIsOpen()">
        Toggle modal!
      </UButton>

      <UModal v-model="isModalOpen" @submit.prevent="onSubmit">
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <UIcon name="i-heroicons-exclamation" class="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg leading-6 font-medium u-text-gray-900">
              Deactivate account
            </h3>
            <div class="mt-2">
              <p class="text-sm u-text-gray-500">
                Are you sure you want to deactivate your account? All of your data will be permanently removed from our servers forever. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" @click="open = false">
            Deactivate
          </button>
          <button ref="cancelButtonRef" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border u-border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium u-text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" @click="open = false">
            Cancel
          </button>
        </div>
      </UModal>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Dropdown:
      </div>

      <UDropdown v-slot="{ open }" :items="dropdownItems" placement="bottom-start">
        <UButton variant="white" :icon="open ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'" trailing icon-class="transition">
          Open menu!
        </UButton>
      </UDropdown>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Dropdown with avatar:
      </div>

      <UDropdown :items="customDropdownItems" placement="bottom-end">
        <button class="flex">
          <UAvatar src="https://picsum.photos/200/300" />
        </button>
      </UDropdown>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Popover:
      </div>

      <UPopover wrapper-class="inline-block relative">
        <template #default="{ open }">
          <UButton variant="secondary" :icon="open ? 'i-heroicons-chevron-up-20-solid-20' : 'i-heroicons-chevron-down-20-solid'" trailing icon-class="transition">
            Open popover!
          </UButton>
        </template>

        <template #panel>
          <div class="p-2">
            Panel
          </div>
        </template>
      </UPopover>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Tooltip:
      </div>

      <UTooltip text="Hello tooltip!" :shortcuts="['⌘', 'G']">
        <UIcon name="i-heroicons-information-circle" class="w-6 h-6 u-text-gray-900 cursor-pointer" />
      </UTooltip>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Notifications:
      </div>
      <UButton icon="i-heroicons-bell" variant="red" label="Trigger an error" @click="onNotificationClick" />
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Copy text to clipboard:
      </div>
      <div class="flex gap-2">
        <UInput v-model="textToCopy" name="textToCopy" />
        <UButton icon="i-heroicons-document-duplicate-solid" variant="primary" label="Copy text" @click="onCopyTextClick" />
      </div>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Context menu:
      </div>

      <UCard class="relative" body-class="h-64" @click="isContextMenuOpen = false" @contextmenu.prevent="openContextMenu">
        <UContextMenu v-model="isContextMenuOpen" :virtual-element="virtualElement" width-class="w-48">
          <div class="p-2">
            Menu
          </div>
        </UContextMenu>
      </UCard>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Command palette:
      </div>

      <UCard body-class="">
        <UCommandPalette
          :placeholder="false"
          :options="{
            fuseOptions: {
              includeMatches: true
            }
          }"
          :groups="commandPaletteGroups"
          command-attribute="name"
        />
      </UCard>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Card:
      </div>

      <UCard body-class="flex">
        <div class="flex-1 px-4 py-5 sm:p-6 space-y-3">
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="form.email" type="email" name="email" required icon="i-heroicons-mail" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea v-model="form.description" type="description" name="description" autoresize />
          </UFormGroup>

          <UFormGroup label="Person" name="person" required>
            <USelect
              v-model="form.personId"
              name="person"
              :options="people"
              placeholder="Select a person"
              text-attribute="name"
              value-attribute="id"
              icon="i-heroicons-user"
            />
          </UFormGroup>

          <UFormGroup label="People" name="people" required>
            <USelectCustom v-model="form.person" name="people" :options="people" text-attribute="name" searchable />
          </UFormGroup>

          <UFormGroup label="Toggle" name="toggle">
            <UToggle v-model="form.toggle" name="toggle" icon-off="i-heroicons-x-mark-20-solid" icon-on="i-heroicons-check-20-solid" />
          </UFormGroup>

          <UFormGroup label="Notifications" label-class="text-base font-medium u-text-gray-900" description="How do you prefer to receive notifications?">
            <div class="space-y-4 mt-3">
              <URadio v-model="form.notification" value="email" label="Email" help="Email" />
              <URadio v-model="form.notification" value="phone" label="Phone (SMS)" help="Phone (SMS)" />
              <URadio v-model="form.notification" value="push" label="Push notification" help="Push notification" />
            </div>
          </UFormGroup>

          <UCard body-class="px-4 py-5 space-y-5">
            <UCheckbox v-model="form.notifications" name="comments" value="comments" label="Comments" help="Get notified when someones posts a comment on a posting." />
            <UCheckbox v-model="form.notifications" name="candidates" value="candidates" label="Candidates" help="Get notified when a candidate applies for a job." />
            <UCheckbox v-model="form.notifications" name="offers" value="offers" label="Offers" help="Get notified when a candidate accepts or rejects an offer." />
          </UCard>

          <div>
            <UCheckbox v-model="form.terms" label="I agree to the terms and conditions" name="terms" />
          </div>

          <div class="flex justify-end">
            <UButton type="submit" label="Submit" class="ml-auto" />
          </div>
        </div>
        <div class="w-1/3 px-4 py-5 sm:p-6 border-l u-border-gray-200 u-bg-gray-50">
          <pre class="whitespace-pre-wrap break-all">
{{ form }}
          </pre>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const isModalOpen = ref(false)
const textToCopy = ref('Copied text')

const people = ref([
  { id: 1, name: 'Durward Reynolds', disabled: false },
  { id: 2, name: 'Kenton Towne', disabled: false },
  { id: 3, name: 'Therese Wunsch', disabled: false },
  { id: 4, name: 'Benedict Kessler', disabled: true },
  { id: 5, name: 'Katelyn Rohan', disabled: false }
])

const form = reactive({
  email: '',
  description: '',
  toggle: false,
  notification: 'email',
  notifications: [],
  terms: false,
  personId: null,
  person: ref(people.value[0]),
  persons: ref([people.value[0]])
})

const toast = useToast()
const clipboard = useCopyToClipboard()

const x = ref(0)
const y = ref(0)
const isContextMenuOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })

const commandPaletteGroups = computed(() => ([{
  key: 'people',
  commands: people.value
}, {
  key: 'search',
  label: q => q && `Search results for "${q}"...`,
  search: async (q) => {
    if (!q) { return [] }
    return await $fetch(`https://jsonplaceholder.typicode.com/users?q=${q}`)
  }
}]))

onMounted(() => {
  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    x.value = clientX
    y.value = clientY
  })
})

function openContextMenu () {
  const top = unref(y)
  const left = unref(x)

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left
  })
  isContextMenuOpen.value = true
}

function toggleModalIsOpen () {
  isModalOpen.value = !isModalOpen.value
}

function onClick () {
  // eslint-disable-next-line no-console
  console.warn('click')
}

function onSubmit () {
  // eslint-disable-next-line no-console
  console.warn('submit')
}

const dropdownItems = [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: (e) => {
      e.preventDefault()
      onClick()
    }
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid'
  }],
  [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid',
    to: 'https://www.google.fr',
    target: '_blank'
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid'
  }]
]

const customDropdownItems = [
  [{
    label: 'benjamincanac',
    avatar: { src: 'https://picsum.photos/200/300' },
    href: 'https://google.fr',
    target: '_blank'
  }],
  [{
    label: 'About',
    icon: 'i-heroicons-plus-20-solid',
    to: '/about'
  }]
]

const onNotificationClick = () => {
  toast.error({ title: 'Error', description: 'This is an error message' })
}

const onCopyTextClick = () => {
  clipboard.copy(textToCopy.value, { title: 'Text copied successfully!' })
}
</script>
