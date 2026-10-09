import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'ផ្លូវរុករក'
    },
    calendar: {
      label: 'កាលបរិច្ឆេទព្រឹត្តិការណ៍',
      monthPicker: 'ឧបករណ៍ជ្រើសរើសខែ',
      nextMonth: 'ខែបន្ទាប់',
      nextYear: 'ឆ្នាំបន្ទាប់',
      prevMonth: 'ខែមុន',
      prevYear: 'ឆ្នាំមុន',
      yearPicker: 'ឧបករណ៍ជ្រើសរើសឆ្នាំ'
    },
    carousel: {
      dots: 'ជ្រើសរើស​ស្លាយ​ដើម្បី​បង្ហាញ',
      goto: 'ឡើងទៅស្លាយ {slide}',
      next: 'បន្ទាប់',
      prev: 'មុន',
      roledescription: 'ការ៉ូសែល',
      slide: 'ស្លាយ'
    },
    chatMessages: {
      autoScroll: 'រំកិលចុះក្រោម'
    },
    chatPrompt: {
      placeholder: 'សួរស្រឡាញ់មួយបីនេះមានប្រភេទបានទាមទារទេ…'
    },
    chatPromptSubmit: {
      label: 'សាក់',
      reload: 'ព្យាយាមម្តងទៀត',
      stop: 'បញ្ឈប់ការបង្កើត'
    },
    chatReasoning: {
      thinking: 'កំពុងគិត…',
      thought: 'គិតរួចហើយ',
      thoughtFor: 'គិតរយៈពេល {duration}'
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
      search: 'លទ្ធផល',
      theme: 'រូបរាង'
    },
    contentSearchButton: {
      label: 'ស្វែងរក…'
    },
    contentToc: {
      title: 'នៅលើទំព័រនេះ'
    },
    dropdownMenu: {
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      search: 'ស្វែងរក…'
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
    drawer: {
      close: 'បិទ'
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
    inputDate: {
      day: 'ថ្ងៃ',
      dayPeriod: 'AM/PM',
      era: 'សករាជ',
      hour: 'ម៉ោង',
      minute: 'នាទី',
      month: 'ខែ',
      second: 'វិនាទី',
      timeZoneName: 'ល្វែងម៉ោង',
      year: 'ឆ្នាំ'
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
    inputRating: {
      rate: 'វាយតម្លៃ {value} ក្នុងចំណោម {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'ម៉ោង',
      minute: 'នាទី',
      second: 'វិនាទី',
      timeZoneName: 'ល្វែងម៉ោង'
    },
    listbox: {
      noData: 'មិនមានទិន្នន័យ',
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      search: 'ស្វែងរក…'
    },
    modal: {
      close: 'បិទ'
    },
    pagination: {
      first: 'ទំព័រដំបូង',
      last: 'ទំព័រចុងក្រោយ',
      next: 'ទំព័របន្ទាប់',
      page: 'ទំព័រ {page}',
      prev: 'ទំព័រមុន'
    },
    pinInput: {
      input: 'លេខកូដ PIN តួអក្សរទី {index} នៃ {length}'
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
      },
      prompt: {
        copy: 'ចម្លងការបញ្ជា',
        openIn: 'បើកក្នុង {name}'
      }
    },
    sidebar: {
      close: 'បិទ',
      toggle: 'បិទ/បើក'
    },
    selectMenu: {
      create: 'បង្កើត "{label}"',
      noData: 'មិនមានទិន្នន័យ',
      noMatch: 'មិនមានទិន្នន័យដែលត្រូវគ្នាទេ',
      search: 'ស្វែងរក…'
    },
    skeleton: {
      label: 'កំពុងផ្ទុក'
    },
    slideover: {
      close: 'បិទ'
    },
    slider: {
      max: 'អតិបរមា',
      min: 'អប្បបរមា',
      thumb: 'ចំណុចរំកិល',
      value: 'តម្លៃទី {index} នៃ {total}'
    },
    table: {
      noData: 'មិនមានទិន្នន័យ'
    },
    toast: {
      close: 'បិទ'
    },
    toaster: {
      label: 'ការជូនដំណឹង',
      viewport: 'ការជូនដំណឹង ({hotkey})'
    }
  }
})
