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

  return (
    <article
      className={cn(
        'relative flex min-h-[331px] flex-col rounded-card border bg-surface p-[11px] shadow-sm transition-colors md:grid md:min-h-[159px] md:grid-cols-[101px_minmax(0,1fr)] md:gap-x-[19px] md:rounded-[10px] md:p-[11px] md:shadow-none 2xl:flex 2xl:h-[331.1px] 2xl:min-h-[331.1px] 2xl:w-[224.6px] 2xl:shrink-0 2xl:flex-col 2xl:rounded-[10px] 2xl:border-0 2xl:px-[11px] 2xl:py-[15px]',
        isSelected
          ? 'border-primary ring-2 ring-primary/20 md:ring-0 md:shadow-[inset_0_0_0_2px_rgb(78_47_210_/_70%)]'
          : 'border-transparent',
        className,
      )}
    >
      {product.badgeLabel ? (
        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-white md:left-[11px] md:top-[11px] md:h-[19px] md:px-[6px] md:py-[2px] md:text-[12px] md:leading-[15px] 2xl:top-[15px] 2xl:h-[15px] 2xl:px-[5px] 2xl:py-0 2xl:text-[12px] 2xl:leading-[15px]">
          {product.badgeLabel}
        </span>
      ) : null}

      <div className="flex justify-center pt-8 md:h-full md:w-full md:items-center md:pt-0 2xl:h-[117.39px] 2xl:w-full 2xl:shrink-0 2xl:overflow-hidden 2xl:rounded-[5px]">
        <AssetPlaceholder
          asset={product.image}
          className="flex h-[101px] w-[101px] items-center justify-center md:h-[137px] md:w-[101px] md:rounded-[5px] 2xl:h-full 2xl:w-full"
        />
      </div>

      <div className="mt-[13px] flex flex-1 flex-col gap-[13px] md:mt-0 md:min-h-[137px] md:min-w-0 md:gap-[10px] md:py-0 2xl:mt-[19px] 2xl:min-h-[136px] 2xl:flex-none 2xl:gap-[10px]">
        <div className="min-w-0 space-y-2 md:space-y-2 2xl:space-y-1">
          <h3 className="text-lg font-semibold leading-none tracking-[0.033em] text-text md:text-[16px] md:leading-none md:tracking-[0.6px] 2xl:text-[18px] 2xl:leading-[18px]">
            {product.name}
          </h3>
          <p className="min-w-0 text-sm leading-[1.3] tracking-[0.043em] text-text-muted md:text-[12px] md:leading-[1.3] md:tracking-[0.6px] md:text-[#575757] 2xl:text-[14px] 2xl:leading-[1.3]">
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
            'mt-auto flex items-end justify-between gap-3 md:h-[35px] md:shrink-0 md:items-center md:gap-[10px] 2xl:h-7 2xl:items-end',
            hasVariants && '2xl:mt-0',
          )}
        >
          <QuantityStepper
            className="md:h-[35px] md:w-20 md:shrink-0 md:justify-center md:gap-[10px] md:rounded-[4px] md:border-0 md:bg-transparent md:px-0 md:py-1 2xl:h-7 2xl:py-0 md:[&_button]:h-5 md:[&_button]:min-h-5 md:[&_button]:w-5 md:[&_button]:min-w-5 md:[&_button>span]:h-5 md:[&_button>span]:w-5 md:[&_button>span]:rounded-[4px] md:[&_button>span]:border-2 md:[&_button>span]:border-[#E6EBF0] md:[&_button:last-child>span]:border-0 md:[&_button:last-child>span]:bg-[#F0F4F7] md:[&_output]:min-w-[10px] md:[&_output]:text-[16px] md:[&_output]:font-normal md:[&_output]:leading-5 md:[&_svg]:h-3 md:[&_svg]:w-3"
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
            className="md:h-[35px] md:w-[129.5px] md:shrink-0 md:flex-col md:flex-nowrap md:items-end md:justify-center md:gap-x-0 md:gap-y-[3px] md:text-right 2xl:h-auto 2xl:w-auto 2xl:flex-row 2xl:flex-nowrap 2xl:items-baseline 2xl:justify-start 2xl:gap-x-1 2xl:gap-y-1 2xl:text-left md:[&>span]:whitespace-nowrap md:[&>span]:text-[16px] md:[&>span]:font-normal md:[&>span]:leading-none md:[&>span:first-child]:text-[#D8392B] md:[&>span:last-child]:text-[#575757]"
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
