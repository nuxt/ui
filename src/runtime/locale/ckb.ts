import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'مانگی داهاتوو',
      nextYear: 'ساڵی داهاتوو',
      prevMonth: 'مانگی پێشوو',
      prevYear: 'ساڵی پێشوو'
    },
    carousel: {
      dots: 'سلایدێک هەڵبژێرە بۆ پیشاندان',
      goto: 'بڕۆ بۆ سلایدی {slide}',
      next: 'دواتر',
      prev: 'پێشتر'
    },
    chatPrompt: {
      placeholder: 'نامەکەت لێرە بنوسە...'
    },
    chatPromptSubmit: {
      label: 'ناردن'
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
      theme: 'ڕووکار'
    },
    contentSearchButton: {
      label: 'گەڕان…'
    },
    contentToc: {
      title: 'لەم پەڕەیەدا'
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
    inputMenu: {
      create: '"{label}" زیادکردنی',
      noData: 'هیچ داتایەک نییە',
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە'
    },
    inputNumber: {
      decrement: 'کەمکردنەوە',
      increment: 'زیادکردن'
    },
    modal: {
      close: 'داخستن'
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
      }
    },
    selectMenu: {
      create: '"{label}" زیادکردنی',
      noData: 'هیچ داتایەک نییە',
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      search: 'گەڕان…'
    },
    slideover: {
      close: 'داخستن'
    },
    table: {
      noData: 'هیچ داتایەک نییە'
    },
    toast: {
      close: 'داخستن'
    }
  }
})
