import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'বাংলা',
  code: 'bn',
  messages: {
    alert: {
      close: 'বন্ধ করুন'
    },
    authForm: {
      hidePassword: 'পাসওয়ার্ড লুকান',
      showPassword: 'পাসওয়ার্ড দেখান',
      submit: 'চালিয়ে যান'
    },
    banner: {
      close: 'বন্ধ করুন'
    },
    calendar: {
      nextMonth: 'পরবর্তী মাস',
      nextYear: 'পরবর্তী বছর',
      prevMonth: 'পূর্ববর্তী মাস',
      prevYear: 'পূর্ববর্তী বছর'
    },
    carousel: {
      dots: 'প্রদর্শনের জন্য স্লাইড নির্বাচন করুন',
      goto: 'স্লাইড {slide} এ যান',
      next: 'পরবর্তী',
      prev: 'পূর্ববর্তী'
    },
    chatPrompt: {
      placeholder: 'এখানে আপনার বার্তা লিখুন…'
    },
    chatPromptSubmit: {
      label: 'প্রেরণ করুন'
    },
    colorMode: {
      dark: 'গাঢ়',
      light: 'হালকা',
      switchToDark: 'গাঢ় মোডে পরিবর্তন করুন',
      switchToLight: 'হালকা মোডে পরিবর্তন করুন',
      system: 'সিস্টেম'
    },
    commandPalette: {
      back: 'পেছনে',
      close: 'বন্ধ করুন',
      noData: 'কোন তথ্য নেই',
      noMatch: 'কোন মিল পাওয়া যায়নি',
      placeholder: 'কমান্ড টাইপ করুন বা অনুসন্ধান করুন…'
    },
    contentSearch: {
      links: 'লিংকসমূহ',
      theme: 'থিম'
    },
    contentSearchButton: {
      label: 'অনুসন্ধান করুন…'
    },
    contentToc: {
      title: 'এই পৃষ্ঠায়'
    },
    dashboardSearch: {
      theme: 'থিম'
    },
    dashboardSearchButton: {
      label: 'অনুসন্ধান করুন…'
    },
    dashboardSidebarCollapse: {
      collapse: 'সাইডবার সংকুচিত করুন',
      expand: 'সাইডবার প্রসারিত করুন'
    },
    dashboardSidebarToggle: {
      close: 'সাইডবার বন্ধ করুন',
      open: 'সাইডবার খুলুন'
    },
    error: {
      clear: 'হোম পেজে ফিরে যান'
    },
    fileUpload: {
      removeFile: '{filename} সরান'
    },
    header: {
      close: 'মেনু বন্ধ করুন',
      open: 'মেনু খুলুন'
    },
    inputMenu: {
      create: '"{label}" তৈরি করুন',
      noData: 'কোন তথ্য নেই',
      noMatch: 'কোন মিল পাওয়া যায়নি'
    },
    inputNumber: {
      decrement: 'হ্রাস করুন',
      increment: 'বৃদ্ধি করুন'
    },
    modal: {
      close: 'বন্ধ করুন'
    },
    pricingTable: {
      caption: 'প্রাইসিং প্ল্যানের তুলনা'
    },
    prose: {
      codeCollapse: {
        closeText: 'সংকুচিত করুন',
        name: 'কোড',
        openText: 'প্রসারিত করুন'
      },
      collapsible: {
        closeText: 'লুকান',
        name: 'বৈশিষ্ট্যসমূহ',
        openText: 'দেখান'
      },
      pre: {
        copy: 'কোড ক্লিপবোর্ডে কপি করুন'
      }
    },
    selectMenu: {
      create: '"{label}" তৈরি করুন',
      noData: 'কোন তথ্য নেই',
      noMatch: 'কোন মিল পাওয়া যায়নি',
      search: 'অনুসন্ধান করুন…'
    },
    slideover: {
      close: 'বন্ধ করুন'
    },
    table: {
      noData: 'কোন তথ্য নেই'
    },
    toast: {
      close: 'বন্ধ করুন'
    }
  }
})
