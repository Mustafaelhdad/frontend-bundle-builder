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
    <fieldset className="min-w-0 w-[205px] md:w-auto 2xl:w-[205px]">
      <legend className="sr-only">Choose color for product {productId}</legend>
      <div className="flex flex-nowrap gap-[5px] md:flex-wrap md:gap-[6px] 2xl:flex-nowrap 2xl:gap-[5px]">
        {variants.map((variant) => {
          const isActive = variant.id === activeVariantId

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                'flex h-[26px] min-h-[26px] w-[65px] shrink-0 items-center justify-center gap-1 rounded-[2px] border-[0.5px] bg-surface px-[3px] py-px text-[10px] font-normal leading-none tracking-[0.6px] text-text transition-colors focus-visible:outline-none md:font-medium 2xl:font-normal',
                isActive
                  ? 'border-[#0AA288] bg-[#1DF0BB]/[0.04]'
                  : 'border-border hover:border-[#0AA288]',
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
