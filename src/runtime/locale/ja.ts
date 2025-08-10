import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
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
      placeholder: 'コマンドを入力するか検索...',
      noMatch: '一致するデータがありません',
      noData: 'データがありません',
      close: '閉じる',
      back: '戻る'
    },
    selectMenu: {
      noMatch: '一致するデータがありません',
      noData: 'データがありません',
      create: '"{label}"を作成',
      search: '検索...'
    },
    toast: {
      close: '閉じる'
    },
    carousel: {
      prev: '前へ',
      next: '次へ',
      dots: '表示するスライドを選択',
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
    },
    fileUpload: {
      removeFile: '{filename}を削除'
    }
  }
})
