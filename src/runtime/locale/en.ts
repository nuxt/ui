import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'Next month',
      nextYear: 'Next year',
      prevMonth: 'Previous month',
      prevYear: 'Previous year'
    },
    carousel: {
      dots: 'Choose slide to display',
      goto: 'Go to slide {slide}',
      next: 'Next',
      prev: 'Prev'
    },
    chatPrompt: {
      placeholder: 'Type your message here…'
    },
    chatPromptSubmit: {
      label: 'Send prompt'
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
      noData: 'No data',
      noMatch: 'No matching data',
      placeholder: 'Type a command or search…'
    },
    contentSearch: {
      links: 'Links',
      theme: 'Theme'
    },
    contentSearchButton: {
      label: 'Search…'
    },
    contentToc: {
      title: 'On this page'
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
    inputMenu: {
      create: 'Create "{label}"',
      noData: 'No data',
      noMatch: 'No matching data'
    },
    inputNumber: {
      decrement: 'Decrement',
      increment: 'Increment'
    },
    modal: {
      close: 'Close'
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
      }
    },
    selectMenu: {
      create: 'Create "{label}"',
      noData: 'No data',
      noMatch: 'No matching data',
      search: 'Search…'
    },
    slideover: {
      close: 'Close'
    },
    table: {
      noData: 'No data'
    },
    toast: {
      close: 'Close'
    }
  }
})
