import { fromDate, getLocalTimeZone } from '@internationalized/date'
import type { ZonedDateTime } from '@internationalized/date'
import type { DateRange, ZonedDateRange } from '../types/date'

export function toZonedDateTime(date?: Date | undefined): undefined | ZonedDateTime {
  return date ? fromDate(date, getLocalTimeZone()) : undefined
}

export function toRangeZonedDateTime(range: DateRange): ZonedDateRange {
  return {
    start: range.start ? toZonedDateTime(range.start) : undefined,
    end: range.end ? toZonedDateTime(range.end) : undefined
  }
}

export function toRangeDate(range: ZonedDateRange): DateRange {
  return {
    start: range.start?.toDate(),
    end: range.end?.toDate()
  }
}
