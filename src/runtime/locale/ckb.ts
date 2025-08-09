import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'کوردی',
  code: 'ckb',
  dir: 'rtl',
  messages: {
    inputMenu: {
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      noData: 'هیچ داتایەک نییە',
      create: '"{label}" دروستکردنی'
    },
    calendar: {
      prevYear: 'ساڵی پێشوو',
      nextYear: 'ساڵی داهاتوو',
      prevMonth: 'مانگی پێشوو',
      nextMonth: 'مانگی داهاتوو'
    },
    inputNumber: {
      increment: 'زیادکردن',
      decrement: 'کەمکردنەوە'
    },
    commandPalette: {
      placeholder: 'فەرمانێک بنووسە یان بگەڕێ...',
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      noData: 'هیچ داتایەک نییە',
      close: 'داخستن',
      back: 'گەڕانەوە'
    },
    selectMenu: {
      noMatch: 'هیچ ئەنجامێک نەدۆزرایەوە',
      noData: 'هیچ داتایەک نییە',
      create: '"{label}" دروستکردنی',
      search: 'گەڕان...'
    },
    toast: {
      close: 'داخستن'
    },
    carousel: {
      prev: 'پێشووی',
      next: 'داهاتوو',
      dots: 'سلایدێک هەڵبژێرە بۆ پیشاندان',
      goto: 'بڕۆ بۆ سلایدی {slide}'
    },
    modal: {
      close: 'داخستن'
    },
    slideover: {
      close: 'داخستن'
    },
    alert: {
      close: 'داخستن'
    },
    table: {
      noData: 'هیچ داتایەک نییە'
    },
    fileUpload: {
      removeFile: '{filename} بسڕەوە'
    }
  }
})
