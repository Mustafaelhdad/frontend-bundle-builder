import { PriceDisplay, QuantityStepper, cn } from '../../../components/ui'
import bundleBuilderData from '../../../data/bundle-builder'
import { useBundleBuilderStore } from '../../../store/useBundleBuilderStore'
import type { IncludedReviewItem, Price } from '../../../types/bundle-builder'
import { AssetPlaceholder } from './AssetPlaceholder'

type IncludedItemCardProps = {
  item: IncludedReviewItem
}

export function IncludedItemCard({ item }: IncludedItemCardProps) {
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
        'relative flex min-h-[331px] flex-col rounded-card border bg-surface p-[11px] shadow-sm transition-colors xl:min-h-[205px] xl:rounded-[5px] xl:p-[7px] xl:shadow-none 2xl:h-[331.1px] 2xl:min-h-[331.1px] 2xl:w-[224.6px] 2xl:shrink-0 2xl:rounded-[10px] 2xl:border-0 2xl:px-[11px] 2xl:py-[15px]',
        quantity > 0
          ? 'border-primary ring-2 ring-primary/20 2xl:ring-0 2xl:shadow-[inset_0_0_0_2px_rgb(78_47_210_/_70%)]'
          : 'border-transparent',
      )}
    >
      {badgeLabel ? (
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white xl:left-2 xl:top-2 xl:px-1.5 xl:py-0.5 xl:text-[8px] 2xl:left-[11px] 2xl:top-[15px] 2xl:h-[15px] 2xl:px-[5px] 2xl:py-0 2xl:text-[12px] 2xl:leading-[15px]">
          {badgeLabel}
        </span>
      ) : null}

      <div className="flex justify-center pt-8 xl:pt-6 2xl:h-[117.39px] 2xl:w-full 2xl:shrink-0 2xl:overflow-hidden 2xl:rounded-[5px] 2xl:pt-0">
        <AssetPlaceholder
          asset={item.image}
          className="flex h-[101px] w-[101px] items-center justify-center xl:h-[58px] xl:w-[58px] 2xl:h-full 2xl:w-full"
        />
      </div>

      <div className="mt-[13px] flex flex-1 flex-col gap-[13px] xl:mt-2 xl:gap-1.5 2xl:mt-[19px] 2xl:min-h-[136px] 2xl:flex-none 2xl:gap-[10px]">
        <div className="space-y-2 xl:space-y-1 2xl:space-y-1">
          <h3 className="text-lg font-semibold leading-none tracking-[0.033em] text-text xl:text-[11px] xl:leading-[1.15] xl:tracking-normal 2xl:text-[18px] 2xl:leading-[18px] 2xl:tracking-[0.6px]">
            {displayName}
          </h3>
          {item.description ? (
            <p className="text-sm leading-[1.3] tracking-[0.043em] text-text-muted xl:text-[9px] xl:leading-[1.18] xl:tracking-normal 2xl:text-[14px] 2xl:leading-[1.3] 2xl:tracking-[0.6px] 2xl:text-[#575757]">
              {item.description}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 xl:gap-1 2xl:h-7 2xl:gap-[10px]">
          <QuantityStepper
            className="xl:gap-0 xl:border-0 xl:bg-transparent xl:px-0 xl:[&_button]:min-h-5 xl:[&_button]:min-w-5 xl:[&_button>span]:h-4 xl:[&_button>span]:w-4 xl:[&_output]:min-w-4 xl:[&_output]:text-[10px] xl:[&_svg]:h-2.5 xl:[&_svg]:w-2.5 2xl:h-7 2xl:w-20 2xl:gap-[10px] 2xl:[&_button]:min-h-5 2xl:[&_button]:min-w-5 2xl:[&_button>span]:h-5 2xl:[&_button>span]:w-5 2xl:[&_button>span]:rounded-[4px] 2xl:[&_button>span]:border-2 2xl:[&_button>span]:border-[#E6EBF0] 2xl:[&_button:last-child>span]:border-0 2xl:[&_button:last-child>span]:bg-[#F0F4F7] 2xl:[&_output]:min-w-[6px] 2xl:[&_output]:text-[16px] 2xl:[&_output]:font-normal 2xl:[&_output]:leading-5 2xl:[&_svg]:h-3 2xl:[&_svg]:w-3"
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
            className="xl:gap-x-1 xl:[&>span]:text-[9px] 2xl:flex-nowrap 2xl:gap-x-1 2xl:[&>span]:text-[16px] 2xl:[&>span]:font-normal 2xl:[&>span]:leading-none 2xl:[&>span:first-child]:text-[#D8392B] 2xl:[&>span:last-child]:text-[#575757]"
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
