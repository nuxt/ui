import { ref } from 'vue'

export const useDefaultProps = () => {
  const people = [
    { id: 1, label: 'Durward Reynolds', disabled: false },
    { id: 2, label: 'Kenton Towne', disabled: false },
    { id: 3, label: 'Therese Wunsch', disabled: false },
    { id: 4, label: 'Benedict Kessler', disabled: true },
    { id: 5, label: 'Katelyn Rohan', disabled: false }
  ]

  const selectCustom = ref(people[0])
  const commandPalette = ref(people[0])
  const alertDialog = ref(false)
  const toggle = ref(false)
  const modal = ref(false)
  const slideover = ref(false)

  const defaults = computed(() => {
    return {
      Button: {
        label: 'Button text'
      },
      Badge: {
        label: 'Badge'
      },
      Alert: {
        title: 'A new software update is available. See what’s new in version 2.0.4.'
      },
      AlertDialog: {
        title: 'Are you sure you want to close this modal?',
        modelValue: alertDialog,
        'onUpdate:modelValue': (v) => { alertDialog.value = v },
        component: {
          name: 'Button',
          props: {
            variant: 'secondary',
            label: 'Open modal',
            onClick: () => { alertDialog.value = true }
          }
        }
      },
      Avatar: {
        src: 'https://picsum.photos/200/300'
      },
      AvatarGroup: {
        group: ['https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80']
      },
      Dropdown: {
        items: [
          [{
            label: 'Edit',
            icon: 'heroicons-solid:pencil'
          }, {
            label: 'Duplicate',
            icon: 'heroicons-solid:duplicate'
          }],
          [{
            label: 'Archive',
            icon: 'heroicons-solid:archive'
          }, {
            label: 'Move',
            icon: 'heroicons-solid:external-link'
          }],
          [{
            label: 'Delete',
            icon: 'heroicons-solid:trash'
          }]
        ]
      },
      VerticalNavigation: {
        links: [
          {
            label: 'Home',
            icon: 'heroicons-outline:home',
            to: '/'
          },
          {
            label: 'Examples',
            icon: 'heroicons-outline:book-open',
            to: '/examples'
          },
          {
            label: 'Migration',
            icon: 'heroicons-outline:refresh',
            to: '/migration'
          },
          {
            label: 'External link',
            icon: 'heroicons-outline:external-link',
            to: 'https://google.fr',
            target: '_blank'
          }
        ]
      },
      CommandPalette: {
        modelValue: commandPalette,
        'onUpdate:modelValue': (v) => { commandPalette.value = v },
        groups: [{
          key: 'people',
          label: 'People',
          commands: people
        }]
      },
      Icon: {
        name: 'heroicons-outline:bell'
      },
      Input: {
        name: 'input',
        placeholder: 'Enter text'
      },
      FormGroup: {
        name: 'input',
        label: 'Input group',
        slots: {
          default: {
            component: {
              name: 'Input',
              props: {
                name: 'input',
                placeholder: 'Works with every form element'
              }
            }
          }
        }
      },
      Toggle: {
        modelValue: toggle,
        'onUpdate:modelValue': (v) => { toggle.value = v }
      },
      Checkbox: {
        name: 'checkbox'
      },
      Radio: {
        name: 'radio'
      },
      Select: {
        name: 'select',
        options: ['English', 'Spanish', 'French', 'German', 'Chinese']
      },
      SelectCustom: {
        modelValue: selectCustom,
        'onUpdate:modelValue': (v) => { selectCustom.value = v },
        textAttribute: 'label',
        options: people
      },
      Textarea: {
        name: 'textarea'
      },
      Tooltip: {
        text: 'Tooltip text'
      },
      Notification: {
        id: '1',
        title: 'Notification title',
        callback: 'console.log(\'Timer expired\')'
      },
      Modal: {
        modelValue: modal,
        'onUpdate:modelValue': (v) => { modal.value = v },
        component: {
          name: 'Button',
          props: {
            variant: 'secondary',
            label: 'Open modal',
            onClick: () => {
              console.log('???')
              modal.value = true
            }
          }
        },
        slots: {
          default: {
            tag: 'div',
            html: 'Modal content'
          },
          footer: {
            component: {
              name: 'Button',
              props: {
                label: 'Close',
                onClick: () => { modal.value = false }
              }
            }
          }
        }
      },
      Slideover: state => ({
        modelValue: state.modelValue,
        'onUpdate:modelValue': (v) => { state.modelValue = v },
        component: {
          name: 'Button',
          props: {
            variant: 'secondary',
            label: 'Open slideover',
            onClick: () => { state.modelValue = true }
          }
        },
        slots: {
          default: {
            tag: 'div',
            html: 'Slideover content'
          }
        }
      }),
      Popover: {
        slots: {
          panel: {
            tag: 'div',
            class: 'u-bg-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-6',
            html: 'Popover content'
          }
        }
      },
      Tabs: {
        links: [{
          label: 'Usage',
          to: '/',
          exact: true
        }, {
          label: 'Examples',
          to: '/examples'
        }, {
          label: 'Migration',
          to: '/migration'
        }, {
          label: 'Tabs',
          to: '/components/Tabs'
        }]
      },
      Pills: {
        links: [{
          label: 'Usage',
          to: '/',
          exact: true
        }, {
          label: 'Examples',
          to: '/examples'
        }, {
          label: 'Migration',
          to: '/migration'
        }, {
          label: 'Pills',
          to: '/components/Pills'
        }]
      }
    }
  })

  return defaults
}
