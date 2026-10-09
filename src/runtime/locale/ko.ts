import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: '탐색 경로'
    },
    calendar: {
      label: '이벤트 날짜',
      monthPicker: '월 선택',
      nextMonth: '다음 달',
      nextYear: '다음 해',
      prevMonth: '이전 달',
      prevYear: '이전 해',
      yearPicker: '연도 선택'
    },
    carousel: {
      dots: '표시할 슬라이드 선택',
      goto: '{slide} 페이지로 이동',
      next: '다음',
      prev: '이전',
      roledescription: '캐러셀',
      slide: '슬라이드'
    },
    chatMessages: {
      autoScroll: '맨 아래로 스크롤'
    },
    chatPrompt: {
      placeholder: '여기에 메시지를 입력하세요…'
    },
    chatPromptSubmit: {
      label: '전송',
      reload: '다시 시도',
      stop: '생성 중지'
    },
    chatReasoning: {
      thinking: '생각하는 중…',
      thought: '생각했습니다',
      thoughtFor: '{duration} 동안 생각했습니다'
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
      search: '결과',
      theme: '테마'
    },
    contentSearchButton: {
      label: '검색…'
    },
    contentToc: {
      title: '이 페이지에서'
    },
    dropdownMenu: {
      noMatch: '일치하는 데이터가 없습니다.',
      search: '검색…'
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
    drawer: {
      close: '닫기'
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
    inputDate: {
      day: '일',
      dayPeriod: '오전/오후',
      era: '연호',
      hour: '시',
      minute: '분',
      month: '월',
      second: '초',
      timeZoneName: '시간대',
      year: '연도'
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
    inputRating: {
      rate: '{length}점 중 {value}점으로 평가'
    },
    inputTime: {
      dayPeriod: '오전/오후',
      hour: '시',
      minute: '분',
      second: '초',
      timeZoneName: '시간대'
    },
    listbox: {
      noData: '데이터가 없습니다.',
      noMatch: '일치하는 데이터가 없습니다.',
      search: '검색…'
    },
    modal: {
      close: '닫기'
    },
    pagination: {
      first: '첫 페이지',
      last: '마지막 페이지',
      next: '다음 페이지',
      page: '{page} 페이지',
      prev: '이전 페이지'
    },
    pinInput: {
      input: 'PIN 코드, {length}자 중 {index}번째 문자'
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
      },
      prompt: {
        copy: '프롬프트 복사',
        openIn: '{name}에서 열기'
      }
    },
    sidebar: {
      close: '닫기',
      toggle: '토글'
    },
    selectMenu: {
      create: '"{label}" 생성',
      noData: '데이터가 없습니다.',
      noMatch: '일치하는 데이터가 없습니다.',
      search: '검색…'
    },
    skeleton: {
      label: '로딩 중'
    },
    slideover: {
      close: '닫기'
    },
    slider: {
      max: '최대',
      min: '최소',
      thumb: '핸들',
      value: '{total}개 중 {index}번째 값'
    },
    table: {
      noData: '데이터가 없습니다.'
    },
    toast: {
      close: '닫기'
    },
    toaster: {
      label: '알림',
      viewport: '알림 ({hotkey})'
    }
  }
})
