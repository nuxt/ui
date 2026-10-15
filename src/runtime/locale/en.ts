import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'English',
  code: 'en',
  messages: {
    alert: {
      close: 'Close'
    },
    authForm: {
      hidePassword: 'Hide password',
      showPassword: 'Show password',
      submit: 'Continue'
    },
    banner: {
      close: 'Close'
    },
    breadcrumb: {
      label: 'breadcrumb'
    },
    calendar: {
      label: 'Event date',
      monthPicker: 'Month picker',
      nextMonth: 'Next month',
      nextYear: 'Next year',
      prevMonth: 'Previous month',
      prevYear: 'Previous year',
      yearPicker: 'Year picker'
    },
    carousel: {
      dots: 'Choose slide to display',
      goto: 'Go to slide {slide}',
      next: 'Next',
      prev: 'Prev',
      roledescription: 'carousel',
      slide: 'slide'
    },
    chatAttachment: {
      uploading: 'Uploading',
      error: 'Upload failed'
    },
    chatMessages: {
      autoScroll: 'Scroll to bottom'
    },
    chatPrompt: {
      placeholder: 'Type your message here…',
      queue: 'Queued messages',
      sendNow: 'Send now',
      edit: 'Edit',
      remove: 'Remove'
    },
    chatPromptSubmit: {
      label: 'Send prompt',
      reload: 'Retry',
      stop: 'Stop generating'
    },
    colorMode: {
      dark: 'Dark',
      light: 'Light',
      switchToDark: 'Switch to dark mode',
      switchToLight: 'Switch to light mode',
      system: 'System'
    },
    commandPalette: {
      back: 'Back',
      close: 'Close',
      filterPlaceholder: 'Type a command or search…',
      noData: 'No data',
      noMatch: 'No matching data',
      results: 'Results'
    },
    contentSearch: {
      links: 'Links',
      search: 'Results',
      theme: 'Theme'
    },
    contentSearchButton: {
      label: 'Search…'
    },
    contentToc: {
      title: 'On this page'
    },
    dropdownMenu: {
      filterPlaceholder: 'Search…',
      noMatch: 'No matching data'
    },
    dashboardSearch: {
      theme: 'Theme'
    },
    dashboardSearchButton: {
      label: 'Search…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Collapse sidebar',
      expand: 'Expand sidebar'
    },
    dashboardSidebarToggle: {
      close: 'Close sidebar',
      open: 'Open sidebar'
    },
    drawer: {
      close: 'Close'
    },
    error: {
      clear: 'Back to home'
    },
    fileUpload: {
      removeFile: 'Remove {filename}'
    },
    header: {
      close: 'Close menu',
      open: 'Open menu'
    },
    inputDate: {
      day: 'day',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'hour',
      minute: 'minute',
      month: 'month',
      second: 'second',
      timeZoneName: 'timezone',
      year: 'year'
    },
    inputMenu: {
      create: 'Create "{label}"',
      noData: 'No data',
      noMatch: 'No matching data',
      trigger: 'Show options'
    },
    inputNumber: {
      decrement: 'Decrement',
      increment: 'Increment',
      roledescription: 'number field'
    },
    inputRating: {
      rate: 'Rate {value} out of {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'hour',
      minute: 'minute',
      second: 'second',
      timeZoneName: 'timezone'
    },
    listbox: {
      filterPlaceholder: 'Search…',
      noData: 'No data',
      noMatch: 'No matching data'
    },
    modal: {
      close: 'Close'
    },
    pagination: {
      first: 'First page',
      last: 'Last page',
      next: 'Next page',
      page: 'Page {page}',
      prev: 'Previous page'
    },
    pinInput: {
      input: 'pin input {index} of {length}'
    },
    pricingTable: {
      caption: 'Pricing plan comparison'
    },
    prose: {
      codeCollapse: {
        closeText: 'Collapse',
        name: 'code',
        openText: 'Expand'
      },
      collapsible: {
        closeText: 'Hide',
        name: 'properties',
        openText: 'Show'
      },
      pre: {
        copy: 'Copy code to clipboard'
      },
      prompt: {
        copy: 'Copy prompt',
        openIn: 'Open in {name}'
      }
    },
    chatReasoning: {
      thinking: 'Thinking…',
      thought: 'Thought',
      thoughtFor: 'Thought for {duration}'
    },
    sidebar: {
      close: 'Close',
      toggle: 'Toggle'
    },
    selectMenu: {
      create: 'Create "{label}"',
      filterPlaceholder: 'Search…',
      noData: 'No data',
      noMatch: 'No matching data'
    },
    skeleton: {
      label: 'loading'
    },
    slideover: {
      close: 'Close'
    },
    slider: {
      max: 'Maximum',
      min: 'Minimum',
      thumb: 'Thumb',
      value: 'Value {index} of {total}'
    },
    stepper: {
      label: 'progress'
    },
    table: {
      noData: 'No data'
    },
    toast: {
      close: 'Close'
    },
    toaster: {
      label: 'Notification',
      viewport: 'Notifications ({hotkey})'
    }
  }
})
