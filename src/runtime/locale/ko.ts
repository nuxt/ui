import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: '한국어',
  code: 'ko',
  messages: {
    inputMenu: {
      noMatch: '일치하는 데이터가 없습니다.',
      noData: '데이터가 없습니다.',
      create: '"{label}" 생성'
    },
    calendar: {
      prevYear: '이전 해',
      nextYear: '다음 해',
      prevMonth: '이전 달',
      nextMonth: '다음 달'
    },
    inputNumber: {
      increment: '증가',
      decrement: '감소'
    },
    fileUpload: {
      empty: '파일을 선택하거나 여기에 드롭하세요',
      removeAll: '모두 제거',
      addFiles: '파일 추가',
      files: '파일'
    },
    commandPalette: {
      placeholder: '명령을 입력하거나 검색...',
      noMatch: '일치하는 데이터가 없습니다.',
      noData: '데이터가 없습니다.',
      close: '닫기',
      back: '뒤로'
    },
    selectMenu: {
      noMatch: '일치하는 데이터가 없습니다.',
      noData: '데이터가 없습니다.',
      create: '"{label}" 생성',
      search: '검색...'
    },
    toast: {
      close: '닫기'
    },
    carousel: {
      prev: '이전',
      next: '다음',
      dots: '표시할 슬라이드 선택',
      goto: '{slide} 페이지로 이동'
    },
    modal: {
      close: '닫기'
    },
    slideover: {
      close: '닫기'
    },
    alert: {
      close: '닫기'
    },
    table: {
      noData: '데이터가 없습니다.'
    }
  }
})
