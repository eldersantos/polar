import { ParsedMetricPeriod } from '@/hooks/queries'
import * as Plot from '@observablehq/plot'
import { schemas } from '@polar-sh/client'
import { formatCurrencyAndAmount } from '@polar-sh/ui/lib/money'
import { timeFormat } from 'd3'
import { format, parse } from 'date-fns'
import { GeistMono } from 'geist/font/mono'

const primaryColor = 'rgb(0 98 255)'

const primaryColorFaded = 'rgba(0, 98, 255, 0.3)'
const gradientId = 'chart-gradient'
const createAreaGradient = (id: string) => {
  // Create a <defs> element
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

  // Create a <linearGradient> element
  const linearGradient = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'linearGradient',
  )
  linearGradient.setAttribute('id', id)
  linearGradient.setAttribute('gradientTransform', 'rotate(90)')

  // Create the first <stop> element
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop1.setAttribute('offset', '0%')
  stop1.setAttribute('stop-color', primaryColorFaded)
  stop1.setAttribute('stop-opacity', '0.5')

  // Create the second <stop> element
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop2.setAttribute('offset', '100%')
  stop2.setAttribute('stop-color', primaryColorFaded)
  stop2.setAttribute('stop-opacity', '0')

  // Append the <stop> elements to the <linearGradient> element
  linearGradient.appendChild(stop1)
  linearGradient.appendChild(stop2)

  // Append the <linearGradient> element to the <defs> element
  defs.appendChild(linearGradient)

  return defs
}

export const toISODate = (date: Date) => format(date, 'yyyy-MM-dd')

export const fromISODate = (date: string) =>
  parse(date, 'yyyy-MM-dd', new Date('1970-01-01T12:00:00Z'))

export const getValueFormatter = (
  metric: schemas['Metric'],
): ((value: number) => string) => {
  const numberFormat = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    notation: 'compact',
  })
  switch (metric.type) {
    case 'currency':
      return (value: number) =>
        formatCurrencyAndAmount(value, 'usd', 0, 'compact')
    case 'scalar':
      return (value: number) => numberFormat.format(value)
  }
}

export const getTimestampFormatter = (
  interval: schemas['TimeInterval'],
  locale: string = 'en-US',
): ((value: Date) => string) => {
  switch (interval) {
    case 'hour':
      return (value: Date) =>
        value.toLocaleString(locale, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
    case 'day':
    case 'week':
      return (value: Date) =>
        value.toLocaleDateString(locale, {
          dateStyle: 'medium',
        })
    case 'month':
      return (value: Date) => format(value, 'MMMM yyyy')
    case 'year':
      return (value: Date) => format(value, 'yyyy')
  }
}

class Callback extends Plot.Dot {
  private callbackFunction: (index: number | undefined) => void

  public constructor(
    data: Plot.Data,
    options: Plot.DotOptions,
    callbackFunction: (data: any) => void,
  ) {
    // @ts-ignore
    super(data, options)
    this.callbackFunction = callbackFunction
  }

  // @ts-ignore
  public render(
    index: number[],
    _scales: Plot.ScaleFunctions,
    _values: Plot.ChannelValues,
    _dimensions: Plot.Dimensions,
    _context: Plot.Context,
    _next?: Plot.RenderFunction,
  ): SVGElement | null {
    if (index.length) {
      this.callbackFunction(index[0])
    }
    return null
  }
}

export const getTicks = (timestamps: Date[], maxTicks: number = 10): Date[] => {
  const step = Math.ceil(timestamps.length / maxTicks)
  return timestamps.filter((_, index) => index % step === 0)
}

const getTickFormat = (
  interval: schemas['TimeInterval'],
  ticks: Date[],
): ((t: Date, i: number) => any) | string => {
  switch (interval) {
    case 'hour':
      return (t: Date, i: number) => {
        const previousDate = ticks[i - 1]
        if (!previousDate || previousDate.getDate() < t.getDate()) {
          return timeFormat('%a %H:%M')(t)
        }
        return timeFormat('%H:%M')(t)
      }
    case 'day':
      return '%b %d'
    case 'week':
      return '%b %d'
    case 'month':
      return '%b %y'
    case 'year':
      return '%Y'
  }
}

export type MetricData =
  | ParsedMetricPeriod[]
  | {
      timestamp: Date
      quantity: number
    }[]

export type MetricMarksResolver = (config: {
  data: MetricData
  metric: schemas['Metric']
  interval: schemas['TimeInterval']
  onDataIndexHover?: (index: number | undefined) => void
  ticks: Date[]
}) => Plot.Markish[]

export const defaultMetricMarks: MetricMarksResolver = ({
  data,
  metric,
  interval,
  onDataIndexHover,
  ticks,
}: {
  data: MetricData
  metric: schemas['Metric']
  interval: schemas['TimeInterval']
  onDataIndexHover?: (index: number | undefined) => void
  ticks: Date[]
}): Plot.Markish[] => [
  () => createAreaGradient(gradientId),
  Plot.axisX({
    tickFormat: getTickFormat(interval, ticks),
    ticks,
    label: null,
    stroke: 'none',
    fontFamily: GeistMono.style.fontFamily,
  }),
  Plot.axisY({
    label: null,
    tickFormat: getValueFormatter(metric),
    stroke: 'none',
    fontFamily: GeistMono.style.fontFamily,
  }),
  Plot.lineY(data, {
    x: 'timestamp',
    y: metric.slug,
    strokeWidth: 1,
    stroke: primaryColor,
  }),
  Plot.areaY(data, {
    x: 'timestamp',
    y: metric.slug,
    fill: `url(#${gradientId})`,
  }),
  Plot.ruleX(
    data,
    Plot.pointerX({
      x: 'timestamp',
      stroke: 'currentColor',
      strokeWidth: 1,
      strokeOpacity: 0.5,
    }),
  ),
  ...(onDataIndexHover
    ? [
        new Callback(
          data,
          Plot.pointerX({
            x: 'timestamp',
            y: metric.slug,
            fill: 'currentColor',
            fillOpacity: 0.5,
            r: 5,
          }),
          onDataIndexHover,
        ),
      ]
    : []),
]

export const barMetricMarks: MetricMarksResolver = ({
  data,
  metric,
  interval,
  onDataIndexHover,
  ticks,
}) => [
  Plot.axisX({
    tickFormat: getTickFormat(interval, ticks),
    ticks,
    label: null,
    stroke: 'none',
    fontFamily: GeistMono.style.fontFamily,
  }),
  Plot.axisY({
    label: null,
    tickFormat: getValueFormatter(metric),
    stroke: 'none',
    fontFamily: GeistMono.style.fontFamily,
  }),
  Plot.barY(data, {
    x: 'timestamp',
    y: metric.slug,
    interval,
  }),
  ...(onDataIndexHover
    ? [
        new Callback(
          data,
          Plot.pointerX({
            x: 'timestamp',
            y: metric.slug,
          }),
          onDataIndexHover,
        ),
      ]
    : []),
]

export const metricDisplayNames: Record<keyof schemas['Metrics'], string> = {
  revenue: 'Revenue',
  orders: 'Orders',
  cumulative_revenue: 'Cumulative Revenue',
  average_order_value: 'Average Order Value',
  one_time_products: 'One-Time Products',
  one_time_products_revenue: 'One-Time Products Revenue',
  new_subscriptions: 'New Subscriptions',
  new_subscriptions_revenue: 'New Subscriptions Revenue',
  renewed_subscriptions: 'Renewed Subscriptions',
  renewed_subscriptions_revenue: 'Renewed Subscriptions Revenue',
  active_subscriptions: 'Active Subscriptions',
  monthly_recurring_revenue: 'Monthly Recurring Revenue',
}

export const metricToCumulativeType: Record<
  schemas['Metric']['slug'],
  MetricCumulativeType
> = {
  revenue: 'sum',
  orders: 'sum',
  cumulative_revenue: 'lastValue',
  average_order_value: 'average',
  one_time_products: 'sum',
  one_time_products_revenue: 'sum',
  new_subscriptions: 'sum',
  new_subscriptions_revenue: 'sum',
  renewed_subscriptions: 'sum',
  renewed_subscriptions_revenue: 'sum',
  active_subscriptions: 'lastValue',
  monthly_recurring_revenue: 'lastValue',
  quantity: 'sum',
}

export type MetricCumulativeType = 'sum' | 'average' | 'lastValue'

export const computeCumulativeValue = (
  metric: schemas['Metric'],
  values: number[],
): number => {
  if (values.length === 0) return 0

  const cumulativeType = metricToCumulativeType[metric.slug]

  switch (cumulativeType) {
    case 'sum':
      return values.reduce((acc, value) => acc + value, 0)
    case 'average':
      const nonZeroValues = values.filter((value) => value !== 0)
      return (
        nonZeroValues.reduce((acc, value) => acc + value, 0) /
        (nonZeroValues.length || 1)
      )
    case 'lastValue':
      return values[values.length - 1]
    default:
      return 0
  }
}

export const dateToInterval = (startDate: Date) => {
  const yearsAgo = new Date().getFullYear() - startDate.getFullYear()
  const monthsAgo =
    (new Date().getFullYear() - startDate.getFullYear()) * 12 +
    (new Date().getMonth() - startDate.getMonth())
  const weeksAgo = Math.floor(
    (new Date().getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
  )
  const daysAgo = Math.floor(
    (new Date().getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
  )

  if (yearsAgo >= 3) {
    return 'year'
  } else if (monthsAgo >= 4) {
    return 'month'
  } else if (weeksAgo > 4) {
    return 'week'
  } else if (daysAgo > 1) {
    return 'day'
  } else {
    return 'hour'
  }
}
