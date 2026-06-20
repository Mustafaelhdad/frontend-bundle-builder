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
    <fieldset className="min-w-0">
      <legend className="sr-only">Choose color for product {productId}</legend>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isActive = variant.id === activeVariantId

          return (
            <button
              aria-pressed={isActive}
              className={cn(
                'flex min-h-11 items-center justify-center gap-1.5 rounded-chip border bg-surface px-2 py-1 text-xs font-medium text-text transition-colors focus-visible:outline-none',
                isActive
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary',
              )}
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              type="button"
            >
              <AssetPlaceholder
                asset={variant.image}
                className="flex h-5 w-5 items-center justify-center"
              />
              <span>{variant.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
