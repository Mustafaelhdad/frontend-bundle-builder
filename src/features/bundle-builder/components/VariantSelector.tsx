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
      <div className="flex flex-wrap gap-2 xl:gap-1 2xl:flex-nowrap 2xl:gap-[5px]">
        {variants.map((variant) => {
          const isActive = variant.id === activeVariantId

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                'flex min-h-11 items-center justify-center gap-1.5 rounded-chip border bg-surface px-2 py-1 text-xs font-medium text-text transition-colors focus-visible:outline-none xl:min-h-[20px] xl:gap-1 xl:px-1 xl:py-0 xl:text-[8px] 2xl:h-[26px] 2xl:min-h-[26px] 2xl:w-[65px] 2xl:shrink-0 2xl:gap-1 2xl:rounded-[2px] 2xl:border-[0.5px] 2xl:px-[3px] 2xl:py-px 2xl:text-[10px] 2xl:font-normal 2xl:leading-none 2xl:tracking-[0.6px]',
                isActive
                  ? 'border-primary ring-2 ring-primary/20 2xl:border-[#0AA288] 2xl:bg-[#1DF0BB]/[0.04] 2xl:ring-0'
                  : 'border-border hover:border-primary 2xl:hover:border-[#0AA288]',
              )}
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              type="button"
            >
              <AssetPlaceholder
                asset={variant.image}
                className="flex h-5 w-5 items-center justify-center xl:h-3.5 xl:w-3.5 2xl:h-5 2xl:w-5"
              />
              <span>{variant.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
