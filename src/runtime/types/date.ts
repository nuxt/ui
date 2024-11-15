import type { ZonedDateTime } from '@internationalized/date'

export interface DateRange {
  /**
   * The start of the range
   */
  start: Date
  /**
   * The end of the range
   */
  end: Date
}

export interface ZonedDateRange {
  start: ZonedDateTime
  end: ZonedDateTime
}
