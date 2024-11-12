import { defineLocale } from '../composables/defineLocale'

export default defineLocale('繁体中文', 'zh-Hant', {
  inputMenu: {
    noMatch: '沒有匹配的資料',
    noData: '沒有資料',
    create: '創建 "{label}"'
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
})
