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
  return (
    <article
      className={cn(
        'relative flex min-h-[331px] flex-col rounded-card border bg-surface p-[11px] shadow-sm transition-colors md:min-h-[331.1px]',
        isSelected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-transparent',
      )}
    >
      {product.badgeLabel ? (
        <span className="absolute left-3 top-3 rounded-full bg-success px-2.5 py-1 text-[11px] font-semibold text-white">
          {product.badgeLabel}
        </span>
      ) : null}

      <div className="flex justify-center pt-8">
        <AssetPlaceholder
          asset={product.image}
          className="flex h-[101px] w-[101px] items-center justify-center"
        />
      </div>

      <div className="mt-[13px] flex flex-1 flex-col gap-[13px]">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-none tracking-[0.033em] text-text">
            {product.name}
          </h3>
          <p className="text-sm leading-[1.3] tracking-[0.043em] text-text-muted">
            {product.description}{' '}
            <a
              className="min-h-11 text-link underline underline-offset-2 focus-visible:outline-none"
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

        <div className="mt-auto flex items-end justify-between gap-3">
          <QuantityStepper
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
