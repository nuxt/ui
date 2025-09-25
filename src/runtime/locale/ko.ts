import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '한국어',
  code: 'ko',
  messages: {
    alert: {
      close: '닫기'
    },
    authForm: {
      hidePassword: '비밀번호 숨기기',
      showPassword: '비밀번호 표시',
      submit: '계속'
    },
    banner: {
      close: '닫기'
    },
    calendar: {
      nextMonth: '다음 달',
      nextYear: '다음 해',
      prevMonth: '이전 달',
      prevYear: '이전 해'
    },
    carousel: {
      dots: '표시할 슬라이드 선택',
      goto: '{slide} 페이지로 이동',
      next: '다음',
      prev: '이전'
    },
    chatPrompt: {
      placeholder: '여기에 메시지를 입력하세요…'
    },
    chatPromptSubmit: {
      label: '전송'
    },
    colorMode: {
      dark: '다크',
      light: '라이트',
      switchToDark: '다크 모드로 전환',
      switchToLight: '라이트 모드로 전환',
      system: '시스템'
    },
    commandPalette: {
      back: '뒤로',
      close: '닫기',
      noData: '데이터가 없습니다.',
      noMatch: '일치하는 데이터가 없습니다.',
      placeholder: '명령을 입력하거나 검색…'
    },
    contentSearch: {
      links: '링크',
      theme: '테마'
    },
    contentSearchButton: {
      label: '검색…'
    },
    contentToc: {
      title: '이 페이지에서'
    },
    dashboardSearch: {
      theme: '테마'
    },
    dashboardSearchButton: {
      label: '검색…'
    },
    dashboardSidebarCollapse: {
      collapse: '사이드바 축소',
      expand: '사이드바 확장'
    },
    dashboardSidebarToggle: {
      close: '사이드바 닫기',
      open: '사이드바 열기'
    },
    error: {
      clear: '홈으로 돌아가기'
    },
    fileUpload: {
      removeFile: '{filename} 제거'
    },
    header: {
      close: '메뉴 닫기',
      open: '메뉴 열기'
    },
    inputMenu: {
      create: '"{label}" 생성',
      noData: '데이터가 없습니다.',
      noMatch: '일치하는 데이터가 없습니다.'
    },
    inputNumber: {
      decrement: '감소',
      increment: '증가'
    },
    modal: {
      close: '닫기'
    },
    pricingTable: {
      caption: '가격 플랜 비교'
    },
    prose: {
      codeCollapse: {
        closeText: '접기',
        name: '코드',
        openText: '펼치기'
      },
      collapsible: {
        closeText: '숨기기',
        name: '속성',
        openText: '보기'
      },
      pre: {
        copy: '코드를 클립보드에 복사'
      }
    },
    selectMenu: {
      create: '"{label}" 생성',
      noData: '데이터가 없습니다.',
      noMatch: '일치하는 데이터가 없습니다.',
      search: '검색…'
    },
    slideover: {
      close: '닫기'
    },
    table: {
      noData: '데이터가 없습니다.'
    },
    toast: {
      close: '닫기'
    }
  }
})
