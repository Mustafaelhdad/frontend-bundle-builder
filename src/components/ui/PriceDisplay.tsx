import type { BillingPeriod } from '../../types/bundle-builder'
import { cn } from './cn'

type PriceDisplaySize = 'sm' | 'md' | 'lg'

export type PriceDisplayProps = {
  priceCents: number
  compareAtCents?: number
  billingPeriod?: BillingPeriod
  priceLabel?: string
  compareAtLabel?: string
  currency?: string
  locale?: string
  size?: PriceDisplaySize
  align?: 'start' | 'end'
  className?: string
}

const priceSizeClasses: Record<PriceDisplaySize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export function PriceDisplay({
  align = 'start',
  billingPeriod,
  className,
  compareAtCents,
  compareAtLabel,
  currency = 'USD',
  locale = 'en-US',
  priceCents,
  priceLabel,
  size = 'md',
}: PriceDisplayProps) {
  const priceText =
    priceLabel ?? formatCurrency({ cents: priceCents, currency, locale })
  const compareAtText =
    compareAtLabel ??
    (typeof compareAtCents === 'number'
      ? formatCurrency({ cents: compareAtCents, currency, locale })
      : null)
  const periodText = billingPeriod
    ? `/${billingPeriodShortLabel[billingPeriod]}`
    : ''

  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline gap-x-2 gap-y-1',
        align === 'end' && 'justify-end text-right',
        className,
      )}
    >
      {compareAtText ? (
        <span className="text-sm text-text-muted line-through">
          {compareAtText}
        </span>
      ) : null}
      <span
        className={cn(
          'font-semibold text-primary',
          priceSizeClasses[size],
          priceLabel === 'FREE' && 'text-success',
        )}
      >
        {priceText}
        {periodText ? (
          <span className="text-sm font-medium text-text-muted">
            {periodText}
          </span>
        ) : null}
      </span>
    </div>
  )
}

function formatCurrency({
  cents,
  currency,
  locale,
}: {
  cents: number
  currency: string
  locale: string
}) {
  return new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
  }).format(cents / 100)
}

const billingPeriodShortLabel: Record<BillingPeriod, string> = {
  month: 'mo',
}
