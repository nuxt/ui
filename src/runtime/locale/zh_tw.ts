import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '繁體中文',
  code: 'zh-TW',
  messages: {
    inputMenu: {
      noMatch: '沒有相符的資料',
      noData: '沒有資料',
      create: '建立「{label}」'
    },
    calendar: {
      prevYear: '去年',
      nextYear: '明年',
      prevMonth: '上個月',
      nextMonth: '下個月'
    },
    inputNumber: {
      increment: '增加',
      decrement: '減少'
    },
    commandPalette: {
      placeholder: '輸入命令或搜尋...',
      noMatch: '沒有相符的資料',
      noData: '沒有資料',
      close: '關閉'
    },
    selectMenu: {
      noMatch: '沒有相符的資料',
      noData: '沒有資料',
      create: '建立「{label}」',
      search: '搜尋...'
    },
    toast: {
      close: '關閉'
    },
    carousel: {
      prev: '上一頁',
      next: '下一頁',
      goto: '跳轉到第 {slide} 頁'
    },
    modal: {
      close: '關閉'
    },
    slideover: {
      close: '關閉'
    },
    alert: {
      close: '關閉'
    },
    table: {
      noData: '沒有資料'
    }
  }
})
