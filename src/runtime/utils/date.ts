import { fromDate, getLocalTimeZone } from '@internationalized/date'
import type { ZonedDateTime } from '@internationalized/date'
import type { DateRange, ZonedDateRange } from '../types/date'

export function toZonedDateTime(date: Date): ZonedDateTime {
  return fromDate(date, getLocalTimeZone())
}

export function toRangeZonedDateTime(range: DateRange): ZonedDateRange {
  return {
    start: toZonedDateTime(range.start),
    end: toZonedDateTime(range.end)
  }
}

export function toRangeDate(range: ZonedDateRange): DateRange {
  return {
    start: range.start.toDate(),
    end: range.end.toDate()
  }
}
