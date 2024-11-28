import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: '日本語',
  code: 'ja',
  messages: {
    inputMenu: {
      noMatch: '一致するデータがありません',
      noData: 'データがありません',
      create: '"{label}"を作成'
    },
    calendar: {
      prevYear: '前年',
      nextYear: '翌年',
      prevMonth: '前月',
      nextMonth: '翌月'
    },
    inputNumber: {
      increment: '増やす',
      decrement: '減らす'
    },
    commandPalette: {
      noMatch: '一致するデータがありません',
      noData: 'データがありません',
      close: '閉じる'
    },
    selectMenu: {
      noMatch: '一致するデータがありません',
      noData: 'データがありません',
      create: '"{label}"を作成'
    },
    toast: {
      close: '閉じる'
    },
    carousel: {
      prev: '前へ',
      next: '次へ',
      goto: 'スライド {slide} に移動'
    },
    modal: {
      close: '閉じる'
    },
    slideover: {
      close: '閉じる'
    },
    alert: {
      close: '閉じる'
    },
    table: {
      noData: 'データがありません'
    }
  }
})
