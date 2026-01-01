import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '简体中文',
  code: 'zh-CN',
  messages: {
    alert: {
      close: '关闭'
    },
    authForm: {
      hidePassword: '隐藏密码',
      showPassword: '显示密码',
      submit: '继续'
    },
    banner: {
      close: '关闭'
    },
    calendar: {
      nextMonth: '下个月',
      nextYear: '明年',
      prevMonth: '上个月',
      prevYear: '去年'
    },
    carousel: {
      dots: '选择要显示的幻灯片',
      goto: '跳转到第 {slide} 页',
      next: '下一页',
      prev: '上一页'
    },
    chatPrompt: {
      placeholder: '在这里输入你的消息…'
    },
    chatPromptSubmit: {
      label: '发送'
    },
    colorMode: {
      dark: '深色',
      light: '浅色',
      switchToDark: '切换到深色模式',
      switchToLight: '切换到浅色模式',
      system: '系统'
    },
    commandPalette: {
      back: '返回',
      close: '关闭',
      noData: '没有数据',
      noMatch: '没有匹配的数据',
      placeholder: '输入命令或搜索…'
    },
    contentSearch: {
      links: '链接',
      theme: '主题'
    },
    contentSearchButton: {
      label: '搜索…'
    },
    contentToc: {
      title: '本页内容'
    },
    dashboardSearch: {
      theme: '主题'
    },
    dashboardSearchButton: {
      label: '搜索…'
    },
    dashboardSidebarCollapse: {
      collapse: '收起侧边栏',
      expand: '展开侧边栏'
    },
    dashboardSidebarToggle: {
      close: '关闭侧边栏',
      open: '打开侧边栏'
    },
    error: {
      clear: '返回首页'
    },
    fileUpload: {
      removeFile: '删除 {filename}'
    },
    header: {
      close: '关闭菜单',
      open: '打开菜单'
    },
    inputMenu: {
      create: '创建 "{label}"',
      noData: '没有数据',
      noMatch: '没有匹配的数据'
    },
    inputNumber: {
      decrement: '减少',
      increment: '增加'
    },
    modal: {
      close: '关闭'
    },
    pricingTable: {
      caption: '价格计划比较'
    },
    prose: {
      codeCollapse: {
        closeText: '收起',
        name: '代码',
        openText: '展开'
      },
      collapsible: {
        closeText: '隐藏',
        name: '属性',
        openText: '显示'
      },
      pre: {
        copy: '复制代码到剪贴板'
      }
    },
    selectMenu: {
      create: '创建 "{label}"',
      noData: '没有数据',
      noMatch: '没有匹配的数据',
      search: '搜索…'
    },
    slideover: {
      close: '关闭'
    },
    table: {
      noData: '没有数据'
    },
    toast: {
      close: '关闭'
    }
  }
})
