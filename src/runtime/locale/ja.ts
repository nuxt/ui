import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '日本語',
  code: 'ja',
  messages: {
    alert: {
      close: '閉じる'
    },
    authForm: {
      hidePassword: 'パスワードを隠す',
      showPassword: 'パスワードを表示',
      submit: '続ける'
    },
    banner: {
      close: '閉じる'
    },
    calendar: {
      nextMonth: '翌月',
      nextYear: '翌年',
      prevMonth: '前月',
      prevYear: '前年'
    },
    carousel: {
      dots: '表示するスライドを選択',
      goto: 'スライド {slide} に移動',
      next: '次へ',
      prev: '前へ'
    },
    chatPrompt: {
      placeholder: 'ここにメッセージを入力してください…'
    },
    chatPromptSubmit: {
      label: '送信'
    },
    colorMode: {
      dark: 'ダーク',
      light: 'ライト',
      switchToDark: 'ダークモードに切り替え',
      switchToLight: 'ライトモードに切り替え',
      system: 'システム'
    },
    commandPalette: {
      back: '戻る',
      close: '閉じる',
      noData: 'データがありません',
      noMatch: '一致するデータがありません',
      placeholder: 'コマンドを入力するか検索…'
    },
    contentSearch: {
      links: 'リンク',
      theme: 'テーマ'
    },
    contentSearchButton: {
      label: '検索…'
    },
    contentToc: {
      title: 'このページ内'
    },
    dashboardSearch: {
      theme: 'テーマ'
    },
    dashboardSearchButton: {
      label: '検索…'
    },
    dashboardSidebarCollapse: {
      collapse: 'サイドバーを折りたたむ',
      expand: 'サイドバーを展開'
    },
    dashboardSidebarToggle: {
      close: 'サイドバーを閉じる',
      open: 'サイドバーを開く'
    },
    error: {
      clear: 'ホームに戻る'
    },
    fileUpload: {
      removeFile: '{filename}を削除'
    },
    header: {
      close: 'メニューを閉じる',
      open: 'メニューを開く'
    },
    inputMenu: {
      create: '"{label}"を作成',
      noData: 'データがありません',
      noMatch: '一致するデータがありません'
    },
    inputNumber: {
      decrement: '減らす',
      increment: '増やす'
    },
    modal: {
      close: '閉じる'
    },
    pricingTable: {
      caption: '価格プランの比較'
    },
    prose: {
      codeCollapse: {
        closeText: '折りたたむ',
        name: 'コード',
        openText: '展開'
      },
      collapsible: {
        closeText: '非表示',
        name: 'プロパティ',
        openText: '表示'
      },
      pre: {
        copy: 'コードをクリップボードにコピー'
      }
    },
    selectMenu: {
      create: '"{label}"を作成',
      noData: 'データがありません',
      noMatch: '一致するデータがありません',
      search: '検索…'
    },
    slideover: {
      close: '閉じる'
    },
    table: {
      noData: 'データがありません'
    },
    toast: {
      close: '閉じる'
    }
  }
})
