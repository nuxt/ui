import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'ব্রেডক্রাম্ব'
    },
    calendar: {
      label: 'ইভেন্টের তারিখ',
      monthPicker: 'মাস নির্বাচক',
      nextMonth: 'পরবর্তী মাস',
      nextYear: 'পরবর্তী বছর',
      prevMonth: 'পূর্ববর্তী মাস',
      prevYear: 'পূর্ববর্তী বছর',
      yearPicker: 'বছর নির্বাচক'
    },
    carousel: {
      dots: 'প্রদর্শনের জন্য স্লাইড নির্বাচন করুন',
      goto: 'স্লাইড {slide} এ যান',
      next: 'পরবর্তী',
      prev: 'পূর্ববর্তী',
      roledescription: 'ক্যারোসেল',
      slide: 'স্লাইড'
    },
    chatMessages: {
      autoScroll: 'নিচে স্ক্রোল করুন'
    },
    chatPrompt: {
      placeholder: 'এখানে আপনার বার্তা লিখুন…'
    },
    chatPromptSubmit: {
      label: 'প্রেরণ করুন',
      reload: 'আবার চেষ্টা করুন',
      stop: 'তৈরি করা বন্ধ করুন'
    },
    chatReasoning: {
      thinking: 'ভাবছে…',
      thought: 'ভেবেছে',
      thoughtFor: '{duration} ভেবেছে'
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
      search: 'ফলাফল',
      theme: 'থিম'
    },
    contentSearchButton: {
      label: 'অনুসন্ধান করুন…'
    },
    contentToc: {
      title: 'এই পৃষ্ঠায়'
    },
    dropdownMenu: {
      noMatch: 'কোন মিল পাওয়া যায়নি',
      search: 'অনুসন্ধান করুন…'
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
    drawer: {
      close: 'বন্ধ করুন'
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
    inputDate: {
      day: 'দিন',
      dayPeriod: 'AM/PM',
      era: 'যুগ',
      hour: 'ঘণ্টা',
      minute: 'মিনিট',
      month: 'মাস',
      second: 'সেকেন্ড',
      timeZoneName: 'সময় অঞ্চল',
      year: 'বছর'
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
    inputRating: {
      rate: '{length}-এর মধ্যে {value} রেটিং দিন'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'ঘণ্টা',
      minute: 'মিনিট',
      second: 'সেকেন্ড',
      timeZoneName: 'সময় অঞ্চল'
    },
    listbox: {
      noData: 'কোন তথ্য নেই',
      noMatch: 'কোন মিল পাওয়া যায়নি',
      search: 'অনুসন্ধান করুন…'
    },
    modal: {
      close: 'বন্ধ করুন'
    },
    pagination: {
      first: 'প্রথম পৃষ্ঠা',
      last: 'শেষ পৃষ্ঠা',
      next: 'পরবর্তী পৃষ্ঠা',
      page: 'পৃষ্ঠা {page}',
      prev: 'পূর্ববর্তী পৃষ্ঠা'
    },
    pinInput: {
      input: 'পিন কোড, {length}-এর মধ্যে অক্ষর {index}'
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
      },
      prompt: {
        copy: 'প্রম্পট কপি করুন',
        openIn: '{name}-এ খুলুন'
      }
    },
    sidebar: {
      close: 'বন্ধ করুন',
      toggle: 'টগল করুন'
    },
    selectMenu: {
      create: '"{label}" তৈরি করুন',
      noData: 'কোন তথ্য নেই',
      noMatch: 'কোন মিল পাওয়া যায়নি',
      search: 'অনুসন্ধান করুন…'
    },
    skeleton: {
      label: 'লোড হচ্ছে'
    },
    slideover: {
      close: 'বন্ধ করুন'
    },
    slider: {
      max: 'সর্বোচ্চ',
      min: 'সর্বনিম্ন',
      thumb: 'হ্যান্ডেল',
      value: '{total}-এর মধ্যে মান {index}'
    },
    table: {
      noData: 'কোন তথ্য নেই'
    },
    toast: {
      close: 'বন্ধ করুন'
    },
    toaster: {
      label: 'বিজ্ঞপ্তি',
      viewport: 'বিজ্ঞপ্তিসমূহ ({hotkey})'
    }
  }
})
