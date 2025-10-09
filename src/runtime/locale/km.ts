import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'ភាសាខ្មែរ',
  code: 'km',
  messages: {
    alert: {
      close: 'បិទ'
    },
    authForm: {
      hidePassword: 'លាក់ពាក្យសម្ងាត់',
      showPassword: 'បង្ហាញពាក្យសម្ងាត់',
      submit: 'បន្ត'
    },
    banner: {
      close: 'បិទ'
    },
    calendar: {
      nextMonth: 'ខែបន្ទាប់',
      nextYear: 'ឆ្នាំបន្ទាប់',
      prevMonth: 'ខែមុន',
      prevYear: 'ឆ្នាំមុន'
    },
    carousel: {
      dots: 'ជ្រើសរើស​ស្លាយ​ដើម្បី​បង្ហាញ',
      goto: 'ឡើងទៅស្លាយ {slide}',
      next: 'បន្ទាប់',
      prev: 'មុន'
    },
    chatPrompt: {
      placeholder: 'សួរស្រឡាញ់មួយបីនេះមានប្រភេទបានទាមទារទេ…'
    },
    chatPromptSubmit: {
      label: 'សាក់'
    },
    colorMode: {
      dark: 'ងងឹត',
      light: 'ភ្លឺ',
      switchToDark: 'ប្តូរទៅរបៀបងងឹត',
      switchToLight: 'ប្តូរទៅរបៀបភ្លឺ',
      system: 'ប្រព័ន្ធ'
    },
    commandPalette: {
      back: 'ត្រឡប់',
      close: 'បិទ',
      noData: 'មិនមានទិន្នន័យ',
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      placeholder: 'វាយពាក្យបញ្ជា ឬស្វែងរក…'
    },
    contentSearch: {
      links: 'តំណភ្ជាប់',
      theme: 'រូបរាង'
    },
    contentSearchButton: {
      label: 'ស្វែងរក…'
    },
    contentToc: {
      title: 'នៅលើទំព័រនេះ'
    },
    dashboardSearch: {
      theme: 'រូបរាង'
    },
    dashboardSearchButton: {
      label: 'ស្វែងរក…'
    },
    dashboardSidebarCollapse: {
      collapse: 'បង្រួមបារចំហៀង',
      expand: 'ពង្រីកបារចំហៀង'
    },
    dashboardSidebarToggle: {
      close: 'បិទបារចំហៀង',
      open: 'បើកបារចំហៀង'
    },
    error: {
      clear: 'ត្រឡប់ទៅទំព័រដើម'
    },
    fileUpload: {
      removeFile: 'លុប {filename}'
    },
    header: {
      close: 'បិទម៉ឺនុយ',
      open: 'បើកម៉ឺនុយ'
    },
    inputMenu: {
      create: 'បង្កើត "{label}"',
      noData: 'មិនមានទិន្នន័យ',
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ'
    },
    inputNumber: {
      decrement: 'បន្ថយ',
      increment: 'បង្កើន'
    },
    modal: {
      close: 'បិទ'
    },
    pricingTable: {
      caption: 'បញ្ជីតម្លៃបន្ទប់បន្ទប់'
    },
    prose: {
      codeCollapse: {
        closeText: 'បង្រួម',
        name: 'កូដ',
        openText: 'ពង្រីក'
      },
      collapsible: {
        closeText: 'លាក់',
        name: 'លក្ខណៈសម្បត្តិ',
        openText: 'បង្ហាញ'
      },
      pre: {
        copy: 'ចម្លងកូដទៅក្ដារតម្បៀតខ្ទាស់'
      }
    },
    selectMenu: {
      create: 'បង្កើត "{label}"',
      noData: 'មិនមានទិន្នន័យ',
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      search: 'ស្វែងរក…'
    },
    slideover: {
      close: 'បិទ'
    },
    table: {
      noData: 'មិនមានទិន្នន័យ'
    },
    toast: {
      close: 'បិទ'
    }
  }
})
