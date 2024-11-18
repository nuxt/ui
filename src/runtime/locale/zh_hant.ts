import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: '繁体中文',
  code: 'zh-Hant',
  messages: {
    inputMenu: {
      noMatch: '沒有匹配的資料',
      noData: '沒有資料',
      create: '創建 "{label}"'
    },
    calendar: {
      prevYear: '去年',
      nextYear: '明年',
      prevMonth: '上个月',
      nextMonth: '下个月'
    },
    inputNumber: {
      increment: '增加',
      decrement: '减少'
    },
    commandPalette: {
      noMatch: '沒有匹配的資料',
      noData: '沒有資料',
      close: '關閉'
    },
    selectMenu: {
      noMatch: '沒有匹配的資料',
      noData: '沒有資料',
      create: '創建 "{label}"'
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
