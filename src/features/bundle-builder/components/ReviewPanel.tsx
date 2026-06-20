import { useMemo, useState } from 'react'
import {
  Button,
  Icon,
  PriceDisplay,
  QuantityStepper,
} from '../../../components/ui'
import bundleBuilderData from '../../../data/bundle-builder'
import {
  type QuantityTarget,
  useBundleBuilderStore,
} from '../../../store/useBundleBuilderStore'
import type {
  AssetReference,
  BuilderProduct,
  IncludedReviewItem,
  Price,
  ProductVariant,
  ReviewCategoryId,
  ReviewLineItem,
  VariantBuilderProduct,
} from '../../../types/bundle-builder'
import { AssetPlaceholder } from './AssetPlaceholder'

type ComputedReviewLine = {
  id: string
  categoryId: ReviewCategoryId
  name: string
  image: AssetReference
  quantity: number
  min: number
  max?: number
  readonly?: boolean
  price: Price
  target: QuantityTarget
}

type ReviewTotals = {
  compareAtCents: number
  priceCents: number
  savingsCents: number
}

export function ReviewPanel() {
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const selectedVariantByProductId = useBundleBuilderStore(
    (state) => state.selectedVariantByProductId,
  )
  const variantQuantities = useBundleBuilderStore(
    (state) => state.variantQuantities,
  )
  const productQuantities = useBundleBuilderStore(
    (state) => state.productQuantities,
  )
  const includedItemQuantities = useBundleBuilderStore(
    (state) => state.includedItemQuantities,
  )
  const increaseQuantity = useBundleBuilderStore(
    (state) => state.increaseQuantity,
  )
  const decreaseQuantity = useBundleBuilderStore(
    (state) => state.decreaseQuantity,
  )
  const saveConfiguration = useBundleBuilderStore(
    (state) => state.saveConfiguration,
  )

  const reviewLines = useMemo(
    () =>
      getReviewLines({
        includedItemQuantities,
        productQuantities,
        selectedVariantByProductId,
        variantQuantities,
      }),
    [
      includedItemQuantities,
      productQuantities,
      selectedVariantByProductId,
      variantQuantities,
    ],
  )
  const totals = useMemo(() => getReviewTotals(reviewLines), [reviewLines])

  function handleSave() {
    const didSave = saveConfiguration()
    setSaveMessage(
      didSave
        ? 'Your system has been saved in this browser.'
        : 'Saving is unavailable in this browser.',
    )
  }

  return (
    <aside
      aria-label={bundleBuilderData.reviewPanel.title}
      className="w-full max-w-[768px] justify-self-center rounded-none bg-surface-tinted p-4 text-text shadow-none sm:rounded-card sm:shadow-sm xl:sticky xl:top-[49px] xl:max-h-[855px] xl:max-w-[399px] xl:justify-self-start xl:overflow-auto xl:p-[15px]"
    >
      <div className="space-y-4 xl:space-y-[5px]">
        <div className="space-y-1 xl:space-y-[5px]">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">
            {bundleBuilderData.reviewPanel.title}
          </h2>
          <p className="text-sm leading-6 text-text-muted">
            Review your selected system before checkout.
          </p>
        </div>

        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:block xl:space-y-[5px]">
          {bundleBuilderData.reviewPanel.categories.map((category) => {
            const categoryLines = reviewLines.filter(
              (line) => line.categoryId === category.id,
            )

            if (categoryLines.length === 0) {
              return null
            }

            return (
              <section className="space-y-2 xl:space-y-[5px]" key={category.id}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  {category.title}
                </h3>
                <div className="space-y-2 xl:space-y-[5px]">
                  {categoryLines.map((line) => (
                    <ReviewLine
                      key={line.id}
                      line={line}
                      onDecrease={() => decreaseQuantity(line.target)}
                      onIncrease={() => increaseQuantity(line.target)}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:block xl:space-y-[5px]">
          <ShippingRow />
          <Guarantee />

          <div className="rounded-card bg-surface p-4 md:col-span-2 xl:col-auto xl:p-3">
            <p className="mb-3 text-sm font-medium text-text-muted xl:mb-1">
              {bundleBuilderData.reviewPanel.financingLabel}
            </p>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text-muted">Total</p>
                <p className="text-sm text-success">
                  You save {formatCurrency(totals.savingsCents)}
                </p>
              </div>
              <PriceDisplay
                align="end"
                compareAtCents={totals.compareAtCents}
                currency={bundleBuilderData.currency}
                locale={bundleBuilderData.locale}
                priceCents={totals.priceCents}
                size="lg"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 md:mx-auto md:w-full md:max-w-sm xl:col-auto xl:max-w-none xl:space-y-[5px]">
            <Button
              fullWidth
              onClick={() =>
                setCheckoutMessage(
                  'Checkout is a prototype placeholder for this take-home.',
                )
              }
              size="lg"
            >
              {bundleBuilderData.reviewPanel.actions.checkoutLabel}
            </Button>
            <Button fullWidth onClick={handleSave} variant="link">
              {bundleBuilderData.reviewPanel.actions.saveLabel}
            </Button>
          </div>
        </div>

        <div aria-live="polite" className="min-h-6 text-sm text-text-muted">
          {checkoutMessage ?? saveMessage}
        </div>
      </div>
    </aside>
  )
}

function ReviewLine({
  line,
  onDecrease,
  onIncrease,
}: {
  line: ComputedReviewLine
  onDecrease: () => void
  onIncrease: () => void
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-3 rounded-card bg-surface p-3 xl:gap-2 xl:p-2">
      <AssetPlaceholder
        asset={line.image}
        className="flex h-11 w-11 items-center justify-center"
      />
      <div className="min-w-0 space-y-2 xl:space-y-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold leading-5 text-text">
            {line.name}
          </p>
          <PriceDisplay
            align="end"
            billingPeriod={line.price.billingPeriod}
            compareAtCents={line.price.compareAtCents}
            compareAtLabel={line.price.compareAtLabel}
            currency={bundleBuilderData.currency}
            locale={bundleBuilderData.locale}
            priceCents={line.price.priceCents}
            priceLabel={line.price.priceLabel}
            size="sm"
          />
        </div>
        <QuantityStepper
          className="scale-[0.86] origin-left"
          decreaseLabel={`Decrease ${line.name} quantity`}
          disabled={line.readonly}
          increaseLabel={`Increase ${line.name} quantity`}
          label={`${line.name} quantity`}
          max={line.max}
          min={line.min}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          value={line.quantity}
        />
      </div>
    </div>
  )
}

function ShippingRow() {
  const shipping = bundleBuilderData.reviewPanel.shipping

  return (
    <div className="flex items-center justify-between gap-3 rounded-card bg-surface p-3 xl:p-2">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center">
          <Icon name="fast-shipping" size={29} />
        </span>
        <p className="text-sm font-semibold text-text">{shipping.label}</p>
      </div>
      <PriceDisplay
        align="end"
        compareAtCents={shipping.price.compareAtCents}
        currency={bundleBuilderData.currency}
        locale={bundleBuilderData.locale}
        priceCents={shipping.price.priceCents}
        priceLabel={shipping.price.priceLabel}
        size="sm"
      />
    </div>
  )
}

function Guarantee() {
  return (
    <div className="rounded-card bg-surface p-3 xl:p-2">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success/10 text-success">
          <Icon name="shield" size={22} />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text">
            {bundleBuilderData.reviewPanel.guarantee.label}
          </p>
          <p className="text-sm text-text-muted">
            {bundleBuilderData.reviewPanel.returnsLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

function getReviewLines({
  includedItemQuantities,
  productQuantities,
  selectedVariantByProductId,
  variantQuantities,
}: {
  includedItemQuantities: Record<string, number>
  productQuantities: Record<string, number>
  selectedVariantByProductId: Record<string, string>
  variantQuantities: Record<string, Record<string, number>>
}) {
  const includedItemsById = new Map(
    bundleBuilderData.includedReviewItems.map((item) => [item.id, item]),
  )
  const initialLineByVariant = new Map(
    bundleBuilderData.reviewPanel.initialLineItems.flatMap((line) =>
      line.sourceProductId && line.sourceVariantId
        ? [
            [
              getVariantLineKey(line.sourceProductId, line.sourceVariantId),
              line,
            ],
          ]
        : [],
    ),
  )
  const initialLineByProduct = new Map(
    bundleBuilderData.reviewPanel.initialLineItems.flatMap((line) =>
      line.sourceProductId && !line.sourceVariantId
        ? [[line.sourceProductId, line]]
        : [],
    ),
  )
  const initialLineByIncludedItem = new Map(
    bundleBuilderData.reviewPanel.initialLineItems.flatMap((line) =>
      line.sourceIncludedItemId ? [[line.sourceIncludedItemId, line]] : [],
    ),
  )

  const productLines = bundleBuilderData.products.flatMap((product) => {
    if (isVariantProduct(product)) {
      return product.variants.flatMap((variant) => {
        const quantity = variantQuantities[product.id]?.[variant.id] ?? 0

        if (quantity <= 0) {
          return []
        }

        const initialLine = initialLineByVariant.get(
          getVariantLineKey(product.id, variant.id),
        )

        return [
          getVariantReviewLine({
            initialLine,
            product,
            quantity,
            selectedVariantId:
              selectedVariantByProductId[product.id] ??
              product.selectedVariantId,
            variant,
          }),
        ]
      })
    }

    const quantity = productQuantities[product.id] ?? 0

    if (quantity <= 0) {
      return []
    }

    return [
      getProductReviewLine({
        initialLine: initialLineByProduct.get(product.id),
        product,
        quantity,
      }),
    ]
  })

  const includedLines = bundleBuilderData.includedReviewItems.flatMap(
    (item) => {
      const quantity = includedItemQuantities[item.id] ?? 0

      if (quantity <= 0) {
        return []
      }

      return [
        getIncludedReviewLine({
          initialLine: initialLineByIncludedItem.get(item.id),
          item: includedItemsById.get(item.id) ?? item,
          quantity,
        }),
      ]
    },
  )

  return [...productLines, ...includedLines]
}

function getVariantReviewLine({
  initialLine,
  product,
  quantity,
  selectedVariantId,
  variant,
}: {
  initialLine?: ReviewLineItem
  product: VariantBuilderProduct
  quantity: number
  selectedVariantId: string
  variant: ProductVariant
}): ComputedReviewLine {
  const isInitialDisplayedVariant = product.selectedVariantId === variant.id
  const shouldUsePlainName = Boolean(initialLine) || isInitialDisplayedVariant
  const displayName = shouldUsePlainName
    ? (product.reviewName ?? product.name)
    : `${product.reviewName ?? product.name} - ${variant.label}`
  const baseQuantity = initialLine?.quantity ?? 1
  const basePrice = initialLine?.price ?? product.price

  return {
    categoryId: product.categoryId,
    id: getVariantLineKey(product.id, variant.id),
    image: initialLine?.image ?? variant.image,
    max: variant.quantity.max,
    min: variant.quantity.min,
    name: displayName,
    price: getLinePrice({ basePrice, baseQuantity, quantity }),
    quantity,
    readonly: variant.quantity.readonly,
    target: {
      productId: product.id,
      type: 'variant',
      variantId:
        selectedVariantId === variant.id ? selectedVariantId : variant.id,
    },
  }
}

function getProductReviewLine({
  initialLine,
  product,
  quantity,
}: {
  initialLine?: ReviewLineItem
  product: BuilderProduct
  quantity: number
}): ComputedReviewLine {
  const quantityConfig = 'quantity' in product ? product.quantity : undefined

  return {
    categoryId: product.categoryId,
    id: product.id,
    image: initialLine?.image ?? product.image,
    max: quantityConfig?.max,
    min: quantityConfig?.min ?? 0,
    name: initialLine?.name ?? product.reviewName ?? product.name,
    price: getLinePrice({
      basePrice: initialLine?.price ?? product.price,
      baseQuantity: initialLine?.quantity ?? 1,
      quantity,
    }),
    quantity,
    readonly: quantityConfig?.readonly,
    target: {
      productId: product.id,
      type: 'product',
    },
  }
}

function getIncludedReviewLine({
  initialLine,
  item,
  quantity,
}: {
  initialLine?: ReviewLineItem
  item: IncludedReviewItem
  quantity: number
}): ComputedReviewLine {
  return {
    categoryId: item.categoryId,
    id: item.id,
    image: initialLine?.image ?? item.image,
    max: item.quantity.max,
    min: item.quantity.min,
    name: initialLine?.name ?? item.name,
    price: getLinePrice({
      basePrice: initialLine?.price ?? item.price,
      baseQuantity: initialLine?.quantity ?? item.quantity.initial,
      quantity,
    }),
    quantity,
    readonly: item.quantity.readonly,
    target: {
      includedItemId: item.id,
      type: 'includedItem',
    },
  }
}

function getLinePrice({
  basePrice,
  baseQuantity,
  quantity,
}: {
  basePrice: Price
  baseQuantity: number
  quantity: number
}): Price {
  const safeBaseQuantity = Math.max(baseQuantity, 1)
  const priceCents = Math.round(
    (basePrice.priceCents / safeBaseQuantity) * quantity,
  )
  const compareAtCents =
    typeof basePrice.compareAtCents === 'number'
      ? Math.round((basePrice.compareAtCents / safeBaseQuantity) * quantity)
      : undefined

  return {
    ...basePrice,
    compareAtCents,
    priceCents,
    priceLabel:
      basePrice.priceLabel === 'FREE' && priceCents === 0
        ? basePrice.priceLabel
        : undefined,
  }
}

function getReviewTotals(lines: ComputedReviewLine[]): ReviewTotals {
  const compareAtCents = lines.reduce(
    (total, line) =>
      total + (line.price.compareAtCents ?? line.price.priceCents),
    0,
  )
  const priceCents = lines.reduce(
    (total, line) => total + line.price.priceCents,
    0,
  )

  return {
    compareAtCents,
    priceCents,
    savingsCents: compareAtCents - priceCents,
  }
}

function getVariantLineKey(productId: string, variantId: string) {
  return `${productId}:${variantId}`
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat(bundleBuilderData.locale, {
    currency: bundleBuilderData.currency,
    style: 'currency',
  }).format(cents / 100)
}

function isVariantProduct(
  product: BuilderProduct,
): product is VariantBuilderProduct {
  return Array.isArray(product.variants)
}
