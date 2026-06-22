import { cn } from '../../../components/ui'
import type { ProductVariant } from '../../../types/bundle-builder'
import { AssetPlaceholder } from './AssetPlaceholder'

type VariantSelectorProps = {
  productId: string
  variants: ProductVariant[]
  activeVariantId: string
  onSelect: (variantId: string) => void
}

export function VariantSelector({
  activeVariantId,
  onSelect,
  productId,
  variants,
}: VariantSelectorProps) {
  return (
    <fieldset className="min-w-0 2xl:w-[205px]">
      <legend className="sr-only">Choose color for product {productId}</legend>
      <div className="flex flex-wrap gap-2 md:gap-[6px] 2xl:flex-nowrap 2xl:gap-[5px]">
        {variants.map((variant) => {
          const isActive = variant.id === activeVariantId

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                'flex min-h-11 items-center justify-center gap-1.5 rounded-chip border bg-surface px-2 py-1 text-xs font-medium text-text transition-colors focus-visible:outline-none md:h-[26px] md:min-h-[26px] md:w-[65px] md:shrink-0 md:gap-1 md:rounded-[2px] md:border-[0.5px] md:px-[3px] md:py-px md:text-[10px] md:font-medium md:leading-none md:tracking-[0.6px] 2xl:font-normal',
                isActive
                  ? 'border-primary ring-2 ring-primary/20 md:border-[#0AA288] md:bg-[#1DF0BB]/[0.04] md:ring-0'
                  : 'border-border hover:border-primary md:hover:border-[#0AA288]',
              )}
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              type="button"
            >
              <AssetPlaceholder
                asset={variant.image}
                className="flex h-5 w-5 items-center justify-center md:h-7 md:w-7 2xl:h-5 2xl:w-5"
              />
              <span>{variant.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
