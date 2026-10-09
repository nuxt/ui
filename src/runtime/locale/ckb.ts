import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'کوردی',
  code: 'ckb',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'داخستن'
    },
    authForm: {
      hidePassword: 'شاردنەوەی تێپەڕەوشە',
      showPassword: 'پیشاندانی تێپەڕەوشە',
      submit: 'بەردەوام بە'
    },
    banner: {
      close: 'داخستن'
    },
    breadcrumb: {
      label: 'ڕێڕەوی پەڕەکان'
    },
    calendar: {
      label: 'بەرواری ڕووداو',
      monthPicker: 'هەڵبژاردنی مانگ',
      nextMonth: 'مانگی داهاتوو',
      nextYear: 'ساڵی داهاتوو',
      prevMonth: 'مانگی پێشوو',
      prevYear: 'ساڵی پێشوو',
      yearPicker: 'هەڵبژاردنی ساڵ'
    },
    carousel: {
      dots: 'سلایدێک هەڵبژێرە بۆ پیشاندان',
      goto: 'بڕۆ بۆ سلایدی {slide}',
      next: 'دواتر',
      prev: 'پێشتر',
      roledescription: 'کارۆسێل',
      slide: 'سلاید'
    },
    chatMessages: {
      autoScroll: 'بۆ خوارەوە بڕۆ'
    },
    chatPrompt: {
      placeholder: 'نامەکەت لێرە بنوسە…'
    },
    chatPromptSubmit: {
      label: 'ناردن',
      reload: 'دووبارە هەوڵبدەرەوە',
      stop: 'وەستاندنی دروستکردن'
    },
    chatReasoning: {
      thinking: 'بیرکردنەوە…',
      thought: 'بیری کردەوە',
      thoughtFor: 'بە ماوەی {duration} بیری کردەوە'
    },
    colorMode: {
      dark: 'تاریک',
      light: 'ڕووناک',
      switchToDark: 'گۆڕین بۆ دۆخی تاریک',
      switchToLight: 'گۆڕین بۆ دۆخی ڕووناک',
      system: 'سیستەم'
    },
    commandPalette: {
      back: 'گەڕانەوە',
      close: 'داخستن',
      noData: 'هیچ داتایەک نییە',
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      placeholder: 'فەرمانێک بنووسە یان بگەڕێ…'
    },
    contentSearch: {
      links: 'بەستەرەکان',
      search: 'ئەنجامەکان',
      theme: 'ڕووکار'
    },
    contentSearchButton: {
      label: 'گەڕان…'
    },
    contentToc: {
      title: 'لەم پەڕەیەدا'
    },
    dropdownMenu: {
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      search: 'گەڕان…'
    },
    dashboardSearch: {
      theme: 'ڕووکار'
    },
    dashboardSearchButton: {
      label: 'گەڕان…'
    },
    dashboardSidebarCollapse: {
      collapse: 'داخستنی لای تەنیشت',
      expand: 'فراوانکردنی لای تەنیشت'
    },
    dashboardSidebarToggle: {
      close: 'داخستنی لاتەنیشت',
      open: 'کردنەوەی لاتەنیشت'
    },
    drawer: {
      close: 'داخستن'
    },
    error: {
      clear: 'گەڕانەوە بۆ سەرەتا'
    },
    fileUpload: {
      removeFile: '{filename} بسڕەوە'
    },
    header: {
      close: 'داخستنی پێڕست',
      open: 'کردنەوەی پێڕست'
    },
    inputDate: {
      day: 'ڕۆژ',
      dayPeriod: 'AM/PM',
      era: 'سەردەم',
      hour: 'کاتژمێر',
      minute: 'خولەک',
      month: 'مانگ',
      second: 'چرکە',
      timeZoneName: 'ناوچەی کات',
      year: 'ساڵ'
    },
    inputMenu: {
      create: '"{label}" زیادکردنی',
      noData: 'هیچ داتایەک نییە',
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە'
    },
    inputNumber: {
      decrement: 'کەمکردنەوە',
      increment: 'زیادکردن'
    },
    inputRating: {
      rate: 'هەڵسەنگاندن بە {value} لە {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'کاتژمێر',
      minute: 'خولەک',
      second: 'چرکە',
      timeZoneName: 'ناوچەی کات'
    },
    listbox: {
      noData: 'هیچ داتایەک نییە',
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      search: 'گەڕان…'
    },
    modal: {
      close: 'داخستن'
    },
    pagination: {
      first: 'پەڕەی یەکەم',
      last: 'پەڕەی کۆتایی',
      next: 'پەڕەی دواتر',
      page: 'پەڕە {page}',
      prev: 'پەڕەی پێشوو'
    },
    pinInput: {
      input: 'کۆدی PIN، پیتی {index} لە {length}'
    },
    pricingTable: {
      caption: 'بەراورکردنی پلانی نرخدانان'
    },
    prose: {
      codeCollapse: {
        closeText: 'داخستن',
        name: 'کۆد',
        openText: 'فراوانکردن'
      },
      collapsible: {
        closeText: 'شاردنەوە',
        name: 'تایبەتمەندییەکان',
        openText: 'پیشاندان'
      },
      pre: {
        copy: 'لەبەرگرتنەوەی کۆد'
      },
      prompt: {
        copy: 'لەبەرگرتنەوەی فەرمان',
        openIn: 'کردنەوە لە {name}'
      }
    },
    sidebar: {
      close: 'داخستن',
      toggle: 'گۆڕین'
    },
    selectMenu: {
      create: '"{label}" زیادکردنی',
      noData: 'هیچ داتایەک نییە',
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      search: 'گەڕان…'
    },
    skeleton: {
      label: 'بارکردن'
    },
    slideover: {
      close: 'داخستن'
    },
    slider: {
      max: 'زۆرترین',
      min: 'کەمترین',
      thumb: 'دەستگرە',
      value: 'بەهای {index} لە {total}'
    },
    table: {
      noData: 'هیچ داتایەک نییە'
    },
    toast: {
      close: 'داخستن'
    },
    toaster: {
      label: 'ئاگادارکردنەوە',
      viewport: 'ئاگادارکردنەوەکان ({hotkey})'
    }
  }
})
