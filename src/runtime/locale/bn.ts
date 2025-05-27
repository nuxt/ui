import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'বাংলা',
  code: 'bn',
  messages: {
    inputMenu: {
      noMatch: 'কোন মিল পাওয়া যায়নি',
      noData: 'কোন তথ্য নেই',
      create: '"{label}" তৈরি করুন'
    },
    calendar: {
      prevYear: 'পূর্ববর্তী বছর',
      nextYear: 'পরবর্তী বছর',
      prevMonth: 'পূর্ববর্তী মাস',
      nextMonth: 'পরবর্তী মাস'
    },
    inputNumber: {
      increment: 'বৃদ্ধি করুন',
      decrement: 'হ্রাস করুন'
    },
    commandPalette: {
      placeholder: 'কমান্ড টাইপ করুন বা অনুসন্ধান করুন...',
      noMatch: 'কোন মিল পাওয়া যায়নি',
      noData: 'কোন তথ্য নেই',
      close: 'বন্ধ করুন',
      back: 'পেছনে'
    },
    selectMenu: {
      noMatch: 'কোন মিল পাওয়া যায়নি',
      noData: 'কোন তথ্য নেই',
      create: '"{label}" তৈরি করুন',
      search: 'অনুসন্ধান করুন...'
    },
    toast: {
      close: 'বন্ধ করুন'
    },
    carousel: {
      prev: 'পূর্ববর্তী',
      next: 'পরবর্তী',
      goto: 'স্লাইড {slide} এ যান'
    },
    modal: {
      close: 'বন্ধ করুন'
    },
    slideover: {
      close: 'বন্ধ করুন'
    },
    alert: {
      close: 'বন্ধ করুন'
    },
    table: {
      noData: 'কোন তথ্য নেই'
    }
  }
})
