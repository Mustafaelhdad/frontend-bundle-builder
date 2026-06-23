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
  className?: string
}

export function ProductCard({ className, product }: ProductCardProps) {
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
  const hasCompareAtPrice =
    typeof product.price.compareAtCents === 'number' ||
    Boolean(product.price.compareAtLabel)

  return (
    <article
      className={cn(
        'relative flex h-[331.1px] min-h-[331.1px] w-[224.6px] shrink-0 flex-col rounded-[10px] border-0 bg-surface px-[11px] py-[15px] transition-shadow md:grid md:h-auto md:min-h-[159px] md:w-auto md:shrink md:grid-cols-[101px_minmax(0,1fr)] md:gap-x-[19px] md:p-[11px] 2xl:flex 2xl:h-[331.1px] 2xl:min-h-[331.1px] 2xl:w-[224.6px] 2xl:shrink-0 2xl:flex-col 2xl:px-[11px] 2xl:py-[15px]',
        isSelected
          ? 'shadow-[inset_0_0_0_2px_rgb(78_47_210_/_70%)]'
          : 'shadow-none',
        className,
      )}
    >
      {product.badgeLabel ? (
        <span className="absolute left-[11px] top-[15px] h-[15px] rounded-full bg-primary px-[5px] py-0 text-[12px] font-semibold leading-[15px] text-white md:top-[11px] md:h-[19px] md:px-[6px] md:py-[2px] 2xl:top-[15px] 2xl:h-[15px] 2xl:px-[5px] 2xl:py-0">
          {product.badgeLabel}
        </span>
      ) : null}

      <div className="flex h-[117.39px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[5px] md:h-full md:shrink 2xl:h-[117.39px] 2xl:shrink-0">
        <AssetPlaceholder
          asset={product.image}
          className="flex h-full w-full items-center justify-center md:h-[137px] md:w-[101px] 2xl:h-full 2xl:w-full"
        />
      </div>

      <div className="mt-[19px] flex min-h-[136px] min-w-0 flex-none flex-col gap-[10px] md:mt-0 md:min-h-[137px] md:flex-1 md:py-0 2xl:mt-[19px] 2xl:min-h-[136px] 2xl:flex-none">
        <div className="min-w-0 space-y-1 md:space-y-2 2xl:space-y-1">
          <h3 className="text-[18px] font-semibold leading-[18px] tracking-[0.033em] text-text md:text-[16px] md:leading-none md:tracking-[0.6px] 2xl:text-[18px] 2xl:leading-[18px]">
            {product.name}
          </h3>
          <p className="min-w-0 text-[14px] leading-[1.3] tracking-[0.043em] text-text-muted md:text-[12px] md:tracking-[0.6px] md:text-[#575757] 2xl:text-[14px]">
            {product.description}{' '}
            <a
              className="text-link underline underline-offset-2 focus-visible:outline-none"
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
            'mt-auto flex h-7 w-full min-w-0 items-center justify-between gap-0 md:h-[35px] md:shrink-0 md:items-center 2xl:h-7 2xl:items-end',
            hasVariants && '2xl:mt-0',
          )}
        >
          <QuantityStepper
            className="h-7 w-20 shrink-0 justify-center gap-[10px] rounded-[4px] border-0 bg-transparent px-0 py-0 md:h-[35px] md:py-1 2xl:h-7 2xl:py-0 [&_button]:h-5 [&_button]:min-h-5 [&_button]:w-5 [&_button]:min-w-5 [&_button>span]:h-5 [&_button>span]:w-5 [&_button>span]:rounded-[4px] [&_button>span]:border-2 [&_button>span]:border-[#E6EBF0] [&_button:last-child>span]:border-0 [&_button:last-child>span]:bg-[#F0F4F7] [&_output]:min-w-[10px] [&_output]:text-[16px] [&_output]:font-normal [&_output]:leading-5 [&_svg]:h-3 [&_svg]:w-3"
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
            className={cn(
              'min-w-max shrink-0 flex-row items-baseline justify-end gap-x-1 gap-y-0 text-right [&>span]:whitespace-nowrap [&>span]:text-[16px] [&>span]:font-normal [&>span]:leading-5 md:[&>span]:leading-none [&>span:first-child]:text-[#D8392B] [&>span:last-child]:text-[#575757]',
              hasCompareAtPrice &&
                'md:h-[35px] md:w-[129.5px] md:flex-col md:flex-nowrap md:items-end md:justify-center md:gap-x-0 md:gap-y-[3px] 2xl:h-auto 2xl:w-auto 2xl:flex-row 2xl:items-baseline 2xl:justify-end 2xl:gap-x-1 2xl:gap-y-0',
              !hasCompareAtPrice && 'max-md:self-center',
            )}
            compareAtCents={product.price.compareAtCents}
            compareAtLabel={product.price.compareAtLabel}
            currency={bundleBuilderData.currency}
            locale={bundleBuilderData.locale}
            priceCents={product.price.priceCents}
            priceLabel={product.price.priceLabel}
            size="sm"
            wrap={false}
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
