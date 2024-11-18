import type { DateValue, ZonedDateTime } from '@internationalized/date'

export interface DateRange {
  /**
   * The start of the range
   */
  start: Date | undefined
  /**
   * The end of the range
   */
  end: Date | undefined
}

export interface ZonedDateRange {
  start: ZonedDateTime | undefined
  end: ZonedDateTime | undefined
}

export type DateRangeRadix = {
  start: DateValue | undefined
  end: DateValue | undefined
}
