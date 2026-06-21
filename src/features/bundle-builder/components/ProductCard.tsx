import { PriceDisplay, QuantityStepper, cn } from '../../../components/ui'
import bundleBuilderData from '../../../data/bundle-builder'
import { useBundleBuilderStore } from '../../../store/useBundleBuilderStore'
import type {
  BuilderProduct,
  ProductVariant,
  QuantityConfig,
  VariantBuilderProduct,
} from '../../../types/bundle-builder'
import { AssetPlaceholder } from './AssetPlaceholder'
import { VariantSelector } from './VariantSelector'

type ProductCardProps = {
  product: BuilderProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const selectedVariantByProductId = useBundleBuilderStore(
    (state) => state.selectedVariantByProductId,
  )
  const variantQuantities = useBundleBuilderStore(
    (state) => state.variantQuantities,
  )
  const productQuantities = useBundleBuilderStore(
    (state) => state.productQuantities,
  )
  const selectActiveVariant = useBundleBuilderStore(
    (state) => state.selectActiveVariant,
  )
  const increaseQuantity = useBundleBuilderStore(
    (state) => state.increaseQuantity,
  )
  const decreaseQuantity = useBundleBuilderStore(
    (state) => state.decreaseQuantity,
  )

  const activeVariant = isVariantProduct(product)
    ? getActiveVariant(
        product,
        selectedVariantByProductId[product.id] ?? product.selectedVariantId,
      )
    : null
  const activeQuantityConfig = getActiveQuantityConfig(product, activeVariant)
  const quantity = isVariantProduct(product)
    ? (variantQuantities[product.id]?.[activeVariant?.id ?? ''] ?? 0)
    : (productQuantities[product.id] ?? 0)
  const isSelected = isProductSelected(
    product,
    variantQuantities,
    productQuantities,
  )
  const hasVariants = isVariantProduct(product)

  return (
    <article
      className={cn(
        'relative flex min-h-[331px] flex-col rounded-card border bg-surface p-[11px] shadow-sm transition-colors xl:min-h-[205px] xl:rounded-[5px] xl:p-[7px] xl:shadow-none 2xl:h-[331.1px] 2xl:min-h-[331.1px] 2xl:w-[224.6px] 2xl:shrink-0 2xl:rounded-[10px] 2xl:border-0 2xl:px-[11px] 2xl:py-[15px]',
        isSelected
          ? 'border-primary ring-2 ring-primary/20 2xl:ring-0 2xl:shadow-[inset_0_0_0_2px_rgb(78_47_210_/_70%)]'
          : 'border-transparent',
      )}
    >
      {product.badgeLabel ? (
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white xl:left-2 xl:top-2 xl:px-1.5 xl:py-0.5 xl:text-[8px] 2xl:left-[11px] 2xl:top-[15px] 2xl:h-[15px] 2xl:px-[5px] 2xl:py-0 2xl:text-[12px] 2xl:font-semibold 2xl:leading-[15px]">
          {product.badgeLabel}
        </span>
      ) : null}

      <div className="flex justify-center pt-8 xl:pt-6 2xl:h-[117.39px] 2xl:w-full 2xl:shrink-0 2xl:overflow-hidden 2xl:rounded-[5px] 2xl:pt-0">
        <AssetPlaceholder
          asset={product.image}
          className="flex h-[101px] w-[101px] items-center justify-center xl:h-[58px] xl:w-[58px] 2xl:h-full 2xl:w-full"
        />
      </div>

      <div className="mt-[13px] flex flex-1 flex-col gap-[13px] xl:mt-2 xl:gap-1.5 2xl:mt-[19px] 2xl:min-h-[136px] 2xl:flex-none 2xl:gap-[10px]">
        <div className="space-y-2 xl:space-y-1 2xl:space-y-1">
          <h3 className="text-lg font-semibold leading-none tracking-[0.033em] text-text xl:text-[11px] xl:leading-[1.15] xl:tracking-normal 2xl:text-[18px] 2xl:leading-[18px] 2xl:tracking-[0.6px]">
            {product.name}
          </h3>
          <p className="text-sm leading-[1.3] tracking-[0.043em] text-text-muted xl:text-[9px] xl:leading-[1.18] xl:tracking-normal 2xl:text-[14px] 2xl:leading-[1.3] 2xl:tracking-[0.6px] 2xl:text-[#575757]">
            {product.description}{' '}
            <a
              className="min-h-11 text-link underline underline-offset-2 focus-visible:outline-none 2xl:min-h-0"
              href={product.learnMoreHref}
            >
              Learn More
            </a>
          </p>
        </div>

        {isVariantProduct(product) ? (
          <VariantSelector
            activeVariantId={activeVariant?.id ?? product.selectedVariantId}
            onSelect={(variantId) => selectActiveVariant(product.id, variantId)}
            productId={product.id}
            variants={product.variants}
          />
        ) : null}

        <div
          className={cn(
            'mt-auto flex items-end justify-between gap-3 xl:gap-1 2xl:h-7 2xl:gap-[10px]',
            hasVariants && '2xl:mt-0',
          )}
        >
          <QuantityStepper
            className="xl:gap-0 xl:border-0 xl:bg-transparent xl:px-0 xl:[&_button]:min-h-5 xl:[&_button]:min-w-5 xl:[&_button>span]:h-4 xl:[&_button>span]:w-4 xl:[&_output]:min-w-4 xl:[&_output]:text-[10px] xl:[&_svg]:h-2.5 xl:[&_svg]:w-2.5 2xl:h-7 2xl:w-20 2xl:gap-[10px] 2xl:[&_button]:min-h-5 2xl:[&_button]:min-w-5 2xl:[&_button>span]:h-5 2xl:[&_button>span]:w-5 2xl:[&_button>span]:rounded-[4px] 2xl:[&_button>span]:border-2 2xl:[&_button>span]:border-[#E6EBF0] 2xl:[&_button:last-child>span]:border-0 2xl:[&_button:last-child>span]:bg-[#F0F4F7] 2xl:[&_output]:min-w-[6px] 2xl:[&_output]:text-[16px] 2xl:[&_output]:font-normal 2xl:[&_output]:leading-5 2xl:[&_svg]:h-3 2xl:[&_svg]:w-3"
            decreaseLabel={`Decrease ${product.name} quantity`}
            increaseLabel={`Increase ${product.name} quantity`}
            label={`${product.name} quantity`}
            max={activeQuantityConfig?.max}
            min={activeQuantityConfig?.min}
            onDecrease={() =>
              decreaseQuantity(getQuantityTarget(product, activeVariant))
            }
            onIncrease={() =>
              increaseQuantity(getQuantityTarget(product, activeVariant))
            }
            value={quantity}
          />
          <PriceDisplay
            billingPeriod={product.price.billingPeriod}
            className="xl:gap-x-1 xl:[&>span]:text-[9px] 2xl:flex-nowrap 2xl:gap-x-1 2xl:[&>span]:text-[16px] 2xl:[&>span]:font-normal 2xl:[&>span]:leading-none 2xl:[&>span:first-child]:text-[#D8392B] 2xl:[&>span:last-child]:text-[#575757]"
            compareAtCents={product.price.compareAtCents}
            compareAtLabel={product.price.compareAtLabel}
            currency={bundleBuilderData.currency}
            locale={bundleBuilderData.locale}
            priceCents={product.price.priceCents}
            priceLabel={product.price.priceLabel}
            size="sm"
          />
        </div>
      </div>
    </article>
  )
}

function getActiveVariant(
  product: VariantBuilderProduct,
  activeVariantId: string,
) {
  return (
    product.variants.find((variant) => variant.id === activeVariantId) ??
    product.variants[0]
  )
}

function getActiveQuantityConfig(
  product: BuilderProduct,
  activeVariant: ProductVariant | null,
): QuantityConfig | undefined {
  if (isVariantProduct(product)) {
    return activeVariant?.quantity
  }

  return product.quantity
}

function getQuantityTarget(
  product: BuilderProduct,
  activeVariant: ProductVariant | null,
) {
  if (isVariantProduct(product)) {
    return {
      productId: product.id,
      type: 'variant' as const,
      variantId: activeVariant?.id ?? product.selectedVariantId,
    }
  }

  return {
    productId: product.id,
    type: 'product' as const,
  }
}

function isProductSelected(
  product: BuilderProduct,
  variantQuantities: Record<string, Record<string, number>>,
  productQuantities: Record<string, number>,
) {
  if (isVariantProduct(product)) {
    return Object.values(variantQuantities[product.id] ?? {}).some(
      (quantity) => quantity > 0,
    )
  }

  return (productQuantities[product.id] ?? 0) > 0
}

function isVariantProduct(
  product: BuilderProduct,
): product is VariantBuilderProduct {
  return Array.isArray(product.variants)
}
