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

      <UButton variant="primary" icon="heroicons-outline:mail">
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
            <UIcon name="heroicons-outline:exclamation" class="h-6 w-6 text-red-600" aria-hidden="true" />
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
        <UButton variant="white" :icon="open ? 'heroicons-solid:chevron-up' : 'heroicons-solid:chevron-down'" trailing icon-class="transition">
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

      <UPopover mode="hover" wrapper-class="inline-block relative">
        <template #default="{ open }">
          <UButton variant="secondary" :icon="open ? 'heroicons-solid:chevron-up' : 'heroicons-solid:chevron-down'" trailing icon-class="transition">
            Open popover!
          </UButton>
        </template>

        <template #panel>
          <div
            class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div class="relative grid gap-8 bg-white p-7">
              <a
                v-for="item in solutions"
                :key="item.name"
                :href="item.href"
                class="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
              >
                <div
                  class="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12"
                >
                  <div v-html="item.icon" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium u-text-gray-900">
                    {{ item.name }}
                  </p>
                  <p class="text-sm u-text-gray-500">
                    {{ item.description }}
                  </p>
                </div>
              </a>
            </div>
            <div class="p-4 bg-gray-50">
              <a
                href="##"
                class="flow-root px-2 py-2 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
              >
                <span class="flex items-center">
                  <span class="text-sm font-medium u-text-gray-900">
                    Documentation
                  </span>
                </span>
                <span class="block text-sm u-text-gray-500">
                  Start integrating products and tools
                </span>
              </a>
            </div>
          </div>
        </template>
      </UPopover>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Tooltip:
      </div>

      <UTooltip text="Hello tooltip!">
        <UIcon name="heroicons-outline:information-circle" class="w-6 h-6 text-black cursor-pointer" />
      </UTooltip>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Notifications:
      </div>
      <UButton icon="heroicons-outline:bell" variant="red" label="Trigger an error" @click="onNotificationClick" />
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Context menu:
      </div>

      <UCard ref="contextMenuRef" class="relative" body-class="h-64" @click="isContextMenuOpen = false" @contextmenu.prevent="isContextMenuOpen = true">
        <UContextMenu v-model="isContextMenuOpen" :virtual-element="virtualElement" width-class="w-48">
          <UCard @click.stop>
            Menu
          </UCard>
        </UContextMenu>
      </UCard>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Command palette:
      </div>

      <UCard body-class="">
        <UCommandPalette v-model="form.persons" multiple :groups="[{ key: 'persons', commands: people, customQuery, options: { fuseOptions: { useExtendedSearch: true, keys: ['name', 'static'] } } }]" command-attribute="name" />
      </UCard>
    </div>

    <div>
      <div class="font-medium text-sm mb-1 u-text-gray-700">
        Card:
      </div>

      <UCard body-class="flex">
        <div class="flex-1 px-4 py-5 sm:p-6 space-y-3">
          <UFormGroup label="Email" name="email" required>
            <UInput v-model="form.email" type="email" name="email" required icon="heroicons-outline:mail" />
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
              icon="heroicons-outline:user"
            />
          </UFormGroup>

          <UFormGroup label="People" name="people" required>
            <USelectCustom v-model="form.person" name="people" :options="people" text-attribute="name" searchable />
          </UFormGroup>

          <UFormGroup label="Toggle" name="toggle">
            <UToggle v-model="form.toggle" name="toggle" icon-off="heroicons-solid:x" icon-on="heroicons-solid:check" />
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

const people = [
  { id: 1, name: 'Durward Reynolds', disabled: false },
  { id: 2, name: 'Kenton Towne', disabled: false },
  { id: 3, name: 'Therese Wunsch', disabled: false },
  { id: 4, name: 'Benedict Kessler', disabled: true },
  { id: 5, name: 'Katelyn Rohan', disabled: false, static: '1' }
]
const form = reactive({
  email: '',
  description: '',
  toggle: false,
  notification: 'email',
  notifications: [],
  terms: false,
  personId: null,
  person: ref(people[0]),
  persons: ref([people[0]])
})

const { $toast } = useNuxtApp()

const x = ref(0)
const y = ref(0)
const isContextMenuOpen = ref(false)
const contextMenuRef = ref(null)

onMounted(() => {
  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    x.value = clientX
    y.value = clientY
  })
})

const virtualElement = computed(() => ({
  getBoundingClientRect () {
    return {
      width: 0,
      height: 0,
      top: y.value,
      right: x.value,
      bottom: y.value,
      left: x.value
    }
  },
  contextElement: contextMenuRef.value?.$el
}))

const customQuery = query => computed(() => query.value ? `${query.value} | =1` : '')

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
    icon: 'heroicons-solid:pencil',
    click: (e) => {
      e.preventDefault()
      onClick()
    }
  }, {
    label: 'Duplicate',
    icon: 'heroicons-solid:duplicate'
  }],
  [{
    label: 'Archive',
    icon: 'heroicons-solid:archive'
  }, {
    label: 'Move',
    icon: 'heroicons-solid:external-link',
    to: 'https://www.google.fr',
    target: '_blank'
  }],
  [{
    label: 'Delete',
    icon: 'heroicons-solid:trash'
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
    icon: 'heroicons-solid:plus',
    to: '/about'
  }]
]

const solutions = [
  {
    name: 'Insights',
    description: 'Measure actions your users take',
    href: '##',
    icon: `
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              aria-hidden='true'
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="#FFEDD5" />
              <path
                d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
                stroke="#FB923C"
                stroke-width="2"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
                stroke="#FDBA74"
                stroke-width="2"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
                stroke="#FDBA74"
                stroke-width="2"
              />
            </svg>
          `
  },
  {
    name: 'Automations',
    description: 'Create your own targeted content',
    href: '##',
    icon: `
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="#FFEDD5" />
              <path
                d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
                stroke="#FB923C"
                stroke-width="2"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
                stroke="#FDBA74"
                stroke-width="2"
              />
            </svg>
          `
  },
  {
    name: 'Reports',
    description: 'Keep track of your growth',
    href: '##',
    icon: `
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="8" fill="#FFEDD5" />
              <rect x="13" y="32" width="2" height="4" fill="#FDBA74" />
              <rect x="17" y="28" width="2" height="8" fill="#FDBA74" />
              <rect x="21" y="24" width="2" height="12" fill="#FDBA74" />
              <rect x="25" y="20" width="2" height="16" fill="#FDBA74" />
              <rect x="29" y="16" width="2" height="20" fill="#FB923C" />
              <rect x="33" y="12" width="2" height="24" fill="#FB923C" />
            </svg>
          `
  }
]

const onNotificationClick = () => {
  $toast.error({ title: 'Error', description: 'This is an error message' })
}
</script>
