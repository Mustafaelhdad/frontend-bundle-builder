import { PriceDisplay, QuantityStepper, cn } from '../../../components/ui'
import bundleBuilderData from '../../../data/bundle-builder'
import { useBundleBuilderStore } from '../../../store/useBundleBuilderStore'
import type { IncludedReviewItem, Price } from '../../../types/bundle-builder'
import { AssetPlaceholder } from './AssetPlaceholder'

type IncludedItemCardProps = {
  item: IncludedReviewItem
  className?: string
}

export function IncludedItemCard({ className, item }: IncludedItemCardProps) {
  const quantity = useBundleBuilderStore(
    (state) => state.includedItemQuantities[item.id] ?? 0,
  )
  const increaseQuantity = useBundleBuilderStore(
    (state) => state.increaseQuantity,
  )
  const decreaseQuantity = useBundleBuilderStore(
    (state) => state.decreaseQuantity,
  )
  const target = {
    includedItemId: item.id,
    type: 'includedItem' as const,
  }
  const badgeLabel = item.required
    ? 'Required'
    : item.quantity.readonly
      ? 'Included'
      : null
  const displayName = item.required ? `${item.name} (Required)` : item.name
  const unitPrice = getUnitPrice(item)

  return (
    <article
      className={cn(
        'relative flex min-h-[331px] flex-col rounded-card border bg-surface p-[11px] shadow-sm transition-colors md:grid md:min-h-[159px] md:grid-cols-[101px_minmax(0,1fr)] md:gap-x-[19px] md:rounded-[10px] md:p-[11px] md:shadow-none 2xl:flex 2xl:h-[331.1px] 2xl:min-h-[331.1px] 2xl:w-[224.6px] 2xl:shrink-0 2xl:flex-col 2xl:rounded-[10px] 2xl:border-0 2xl:px-[11px] 2xl:py-[15px]',
        quantity > 0
          ? 'border-primary ring-2 ring-primary/20 md:ring-0 md:shadow-[inset_0_0_0_2px_rgb(78_47_210_/_70%)]'
          : 'border-transparent',
        className,
      )}
    >
      {badgeLabel ? (
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white md:left-[11px] md:top-[11px] md:h-[19px] md:px-[6px] md:py-[2px] md:text-[12px] md:leading-[15px] 2xl:top-[15px] 2xl:h-[15px] 2xl:px-[5px] 2xl:py-0 2xl:text-[12px] 2xl:leading-[15px]">
          {badgeLabel}
        </span>
      ) : null}

      <div className="flex justify-center pt-8 md:h-full md:w-full md:items-center md:pt-0 2xl:h-[117.39px] 2xl:w-full 2xl:shrink-0 2xl:overflow-hidden 2xl:rounded-[5px]">
        <AssetPlaceholder
          asset={item.image}
          className="flex h-[101px] w-[101px] items-center justify-center md:h-[137px] md:w-[101px] md:rounded-[5px] 2xl:h-full 2xl:w-full"
        />
      </div>

      <div className="mt-[13px] flex flex-1 flex-col gap-[13px] md:mt-0 md:min-h-[137px] md:min-w-0 md:gap-[10px] md:py-0 2xl:mt-[19px] 2xl:min-h-[136px] 2xl:flex-none 2xl:gap-[10px]">
        <div className="min-w-0 space-y-2 md:space-y-2 2xl:space-y-1">
          <h3 className="text-lg font-semibold leading-none tracking-[0.033em] text-text md:text-[16px] md:leading-none md:tracking-[0.6px] 2xl:text-[18px] 2xl:leading-[18px]">
            {displayName}
          </h3>
          {item.description ? (
            <p className="min-w-0 text-sm leading-[1.3] tracking-[0.043em] text-text-muted md:text-[12px] md:leading-[1.3] md:tracking-[0.6px] md:text-[#575757] 2xl:text-[14px] 2xl:leading-[1.3]">
              {item.description}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 md:h-[35px] md:shrink-0 md:items-center md:gap-[10px] 2xl:h-7 2xl:items-end">
          <QuantityStepper
            className="md:h-[35px] md:w-20 md:shrink-0 md:justify-center md:gap-[10px] md:rounded-[4px] md:border-0 md:bg-transparent md:px-0 md:py-1 2xl:h-7 2xl:py-0 md:[&_button]:h-5 md:[&_button]:min-h-5 md:[&_button]:w-5 md:[&_button]:min-w-5 md:[&_button>span]:h-5 md:[&_button>span]:w-5 md:[&_button>span]:rounded-[4px] md:[&_button>span]:border-2 md:[&_button>span]:border-[#E6EBF0] md:[&_button:last-child>span]:border-0 md:[&_button:last-child>span]:bg-[#F0F4F7] md:[&_output]:min-w-[10px] md:[&_output]:text-[16px] md:[&_output]:font-normal md:[&_output]:leading-5 md:[&_svg]:h-3 md:[&_svg]:w-3"
            decreaseLabel={`Decrease ${item.name} quantity`}
            disabled={item.quantity.readonly}
            increaseLabel={`Increase ${item.name} quantity`}
            label={`${item.name} quantity`}
            max={item.quantity.max}
            min={item.quantity.min}
            onDecrease={() => decreaseQuantity(target)}
            onIncrease={() => increaseQuantity(target)}
            value={quantity}
          />
          <PriceDisplay
            billingPeriod={unitPrice.billingPeriod}
            className="md:h-[35px] md:w-[129.5px] md:shrink-0 md:flex-col md:flex-nowrap md:items-end md:justify-center md:gap-x-0 md:gap-y-[3px] md:text-right 2xl:h-auto 2xl:w-auto 2xl:flex-row 2xl:flex-nowrap 2xl:items-baseline 2xl:justify-start 2xl:gap-x-1 2xl:gap-y-1 2xl:text-left md:[&>span]:whitespace-nowrap md:[&>span]:text-[16px] md:[&>span]:font-normal md:[&>span]:leading-none md:[&>span:first-child]:text-[#D8392B] md:[&>span:last-child]:text-[#575757]"
            compareAtCents={unitPrice.compareAtCents}
            compareAtLabel={unitPrice.compareAtLabel}
            currency={bundleBuilderData.currency}
            locale={bundleBuilderData.locale}
            priceCents={unitPrice.priceCents}
            priceLabel={unitPrice.priceLabel}
            size="sm"
          />
        </div>
      </div>
    </article>
  )
}

function getUnitPrice(item: IncludedReviewItem): Price {
  const initialQuantity = Math.max(item.quantity.initial, 1)

  return {
    ...item.price,
    compareAtCents:
      typeof item.price.compareAtCents === 'number'
        ? Math.round(item.price.compareAtCents / initialQuantity)
        : undefined,
    priceCents: Math.round(item.price.priceCents / initialQuantity),
  }
}
