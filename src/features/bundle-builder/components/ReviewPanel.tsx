import { useMemo, useState } from 'react'
import {
  Button,
  cn,
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

  function handleCheckout() {
    setCheckoutMessage(
      'Checkout is a prototype placeholder for this take-home.',
    )
  }

  return (
    <aside
      aria-label={bundleBuilderData.reviewPanel.title}
      className="w-full max-w-[768px] justify-self-center rounded-none bg-surface-tinted p-4 text-text shadow-none sm:rounded-card sm:shadow-sm xl:sticky xl:top-[49px] xl:max-h-[855px] xl:max-w-[399px] xl:justify-self-start xl:overflow-auto xl:p-[15px] 2xl:static 2xl:min-h-[658px] 2xl:max-h-none 2xl:w-full 2xl:max-w-none 2xl:justify-self-stretch 2xl:overflow-visible 2xl:rounded-[10px] 2xl:p-0 2xl:shadow-none"
    >
      <div className="space-y-4 xl:space-y-[5px] 2xl:mx-auto 2xl:grid 2xl:min-h-[658px] 2xl:w-[1213px] 2xl:grid-cols-[552px_486px] 2xl:items-start 2xl:gap-x-[52px] 2xl:px-[61.5px] 2xl:py-[35px] 2xl:space-y-0">
        <div className="space-y-4 xl:space-y-[5px] 2xl:flex 2xl:min-h-[588px] 2xl:w-[552px] 2xl:flex-col 2xl:gap-[7.5px] 2xl:space-y-0">
          <div className="space-y-1 xl:space-y-[5px] 2xl:h-[70px] 2xl:space-y-0">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] 2xl:h-7 2xl:text-[28px] 2xl:leading-7 2xl:tracking-[0.6px]">
              {bundleBuilderData.reviewPanel.title}
            </h2>
            <p className="text-sm leading-6 text-text-muted 2xl:h-[42px] 2xl:text-[16px] 2xl:leading-[1.3] 2xl:tracking-[0.6px] 2xl:text-[#1F1F1F]/75">
              Review your personalized protection system designed to keep what
              matters most safe.
            </p>
          </div>

          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 xl:block xl:space-y-[5px] 2xl:block 2xl:space-y-[21px]">
            {bundleBuilderData.reviewPanel.categories.map((category) => {
              const categoryLines = reviewLines.filter(
                (line) => line.categoryId === category.id,
              )
              const isPlanCategory = category.id === 'plan'

              if (categoryLines.length === 0) {
                return null
              }

              return (
                <section
                  className={cn(
                    'space-y-2 xl:space-y-[5px] 2xl:border-t 2xl:border-[#CED6DE] 2xl:pt-[15px] 2xl:space-y-0',
                    isPlanCategory &&
                      '2xl:flex 2xl:h-[70px] 2xl:flex-col 2xl:gap-2',
                  )}
                  key={category.id}
                >
                  <h3
                    className={cn(
                      'text-xs font-semibold uppercase tracking-[0.18em] text-text-muted 2xl:h-[10px] 2xl:text-[10px] 2xl:font-normal 2xl:leading-[10px] 2xl:tracking-[0.5px] 2xl:text-[#9BA6B2]',
                      !isPlanCategory && '2xl:mb-0.5',
                    )}
                  >
                    {category.title}
                  </h3>
                  <div
                    className={cn(
                      'space-y-2 xl:space-y-[5px] 2xl:space-y-[12px]',
                      isPlanCategory && '2xl:h-[31px] 2xl:w-full 2xl:space-y-0',
                    )}
                  >
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

          <ShippingRow />
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:block xl:space-y-[5px] 2xl:hidden">
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
            <Button fullWidth onClick={handleCheckout} size="lg">
              {bundleBuilderData.reviewPanel.actions.checkoutLabel}
            </Button>
            <Button fullWidth onClick={handleSave} variant="link">
              {bundleBuilderData.reviewPanel.actions.saveLabel}
            </Button>
          </div>
        </div>

        <ReviewSummary2xl
          message={checkoutMessage ?? saveMessage}
          onCheckout={handleCheckout}
          onSave={handleSave}
          totals={totals}
        />

        <div
          aria-live="polite"
          className="min-h-6 text-sm text-text-muted 2xl:hidden"
        >
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
  const isPlan = line.categoryId === 'plan'

  return (
    <div
      className={cn(
        'grid grid-cols-[44px_1fr] gap-3 rounded-card bg-surface p-3 xl:gap-2 xl:p-2 2xl:flex 2xl:w-full 2xl:items-center 2xl:rounded-none 2xl:bg-transparent 2xl:p-0',
        isPlan ? '2xl:h-[31px] 2xl:gap-[3px]' : '2xl:h-[41px] 2xl:gap-4',
      )}
    >
      <AssetPlaceholder
        asset={line.image}
        className={cn(
          'flex h-11 w-11 items-center justify-center 2xl:shrink-0 2xl:overflow-hidden',
          isPlan
            ? '2xl:h-[31px] 2xl:w-[26px] 2xl:rounded-none 2xl:bg-transparent 2xl:[&_svg]:h-[31px] 2xl:[&_svg]:w-[26px]'
            : '2xl:h-[41px] 2xl:w-[41px] 2xl:rounded-[5px] 2xl:bg-white',
        )}
      />
      <div
        className={cn(
          'min-w-0 space-y-2 xl:space-y-1 2xl:flex-1 2xl:items-center 2xl:space-y-0',
          isPlan
            ? '2xl:flex 2xl:h-[31px] 2xl:justify-between 2xl:gap-3'
            : '2xl:grid 2xl:h-[41px] 2xl:grid-cols-[minmax(0,1fr)_72px_auto] 2xl:gap-x-3',
        )}
      >
        <div className="flex items-start justify-between gap-3 2xl:contents">
          <p
            className={cn(
              'text-sm font-semibold leading-5 text-text 2xl:col-start-1 2xl:row-start-1 2xl:text-[#0B0D10]',
              isPlan
                ? '2xl:h-5 2xl:w-auto 2xl:min-w-max 2xl:whitespace-nowrap 2xl:text-[20px] 2xl:font-bold 2xl:leading-5 2xl:tracking-[-0.04px]'
                : '2xl:truncate 2xl:text-[18px] 2xl:font-normal 2xl:leading-4 2xl:tracking-[0.5px]',
            )}
          >
            <ReviewLineName line={line} />
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
            className={cn(
              '2xl:flex-nowrap 2xl:[&>span]:text-[16px] 2xl:[&>span]:leading-4 2xl:[&>span]:tracking-[0.5px] 2xl:[&>span:first-child]:font-normal 2xl:[&>span:first-child]:text-[#6F7882] 2xl:[&>span:last-child]:font-semibold 2xl:[&>span:last-child]:text-[#4E2FD2] 2xl:[&>span:last-child>span]:font-semibold 2xl:[&>span:last-child>span]:text-[#4E2FD2]',
              isPlan
                ? '2xl:h-[31px] 2xl:items-center 2xl:gap-x-3'
                : '2xl:col-start-3 2xl:row-start-1 2xl:gap-x-2',
            )}
          />
        </div>
        <QuantityStepper
          className={cn(
            'origin-left scale-[0.86] 2xl:col-start-2 2xl:row-start-1 2xl:h-7 2xl:w-[72px] 2xl:scale-100 2xl:justify-between 2xl:gap-0 2xl:rounded-[4px] 2xl:border-0 2xl:bg-transparent 2xl:px-0 2xl:[&_button]:min-h-5 2xl:[&_button]:min-w-5 2xl:[&_button>span]:h-5 2xl:[&_button>span]:w-5 2xl:[&_button>span]:rounded-[4px] 2xl:[&_button>span]:border 2xl:[&_button>span]:border-[#CED6DE] 2xl:[&_output]:min-w-[8px] 2xl:[&_output]:text-[16px] 2xl:[&_output]:font-normal 2xl:[&_output]:leading-5 2xl:[&_svg]:h-3 2xl:[&_svg]:w-3',
            isPlan && '2xl:hidden',
          )}
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

function ReviewLineName({ line }: { line: ComputedReviewLine }) {
  if (line.categoryId === 'plan' && line.name === 'Cam Unlimited') {
    return (
      <>
        <span className="font-bold">Cam </span>
        <span className="font-bold text-[#4E2FD2]">Unlimited</span>
      </>
    )
  }

  return line.name
}

function ReviewSummary2xl({
  message,
  onCheckout,
  onSave,
  totals,
}: {
  message: string | null
  onCheckout: () => void
  onSave: () => void
  totals: ReviewTotals
}) {
  return (
    <div className="relative hidden 2xl:block 2xl:h-[284px] 2xl:w-[486px]">
      <div className="absolute left-0 top-0 h-[179px] w-full">
        <div className="absolute left-0 top-0 flex h-[131px] w-full items-start gap-[25px]">
          <AssetPlaceholder
            asset={bundleBuilderData.reviewPanel.guarantee.image}
            className="h-[131px] w-[131px] shrink-0"
          />

          <div className="flex h-[131px] w-[330px] shrink-0 items-center">
            <p className="h-20 w-[330px] text-[18px] font-semibold leading-[1.1] tracking-[0.6px] text-[#1F1F1F]">
              <span className="block h-5">
                {bundleBuilderData.reviewPanel.returnsLabel}
              </span>
              <span className="mt-5 block h-10">
                If you’re not totally in love with the product, we will refund
                you 100%.
              </span>
            </p>
          </div>
        </div>

        <div className="absolute left-0 top-[147px] flex h-8 w-full items-center">
          <p className="flex h-[27px] w-[145px] shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-[3px] bg-[#4E2FD2] px-2 text-[16px] font-normal leading-none tracking-[-0.8px] text-white">
            {bundleBuilderData.reviewPanel.financingLabel}
          </p>

          <div className="flex h-8 w-[341px] items-center justify-end gap-2 text-right">
            <span className="flex h-5 items-center justify-end whitespace-nowrap text-right text-[22px] font-medium leading-5 tracking-[0.25px] text-[#6F7882] line-through">
              {formatCurrency(totals.compareAtCents)}
            </span>
            <span className="flex h-8 items-center justify-end whitespace-nowrap text-right text-[28px] font-semibold leading-8 tracking-[-0.04px] text-[#4E2FD2]">
              {formatCurrency(totals.priceCents)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-[187px] flex h-[76px] w-full flex-col gap-1 pt-[10px]">
        <p className="h-[14px] w-full text-center text-[14px] font-semibold leading-[14px] tracking-[-0.06px] text-[#00A288]">
          Congrats! You’re saving {formatCurrency(totals.savingsCents)} on your
          security bundle!
        </p>

        <Button
          className="2xl:h-12 2xl:min-h-12 2xl:w-full 2xl:rounded-[4px] 2xl:border-[#4E2FD2] 2xl:bg-[#4E2FD2] 2xl:px-4 2xl:py-[13px] 2xl:text-[17px] 2xl:font-bold 2xl:leading-none 2xl:tracking-normal 2xl:hover:bg-[#3510D4] 2xl:[&>span]:flex 2xl:[&>span]:h-[22px] 2xl:[&>span]:w-[454px] 2xl:[&>span]:items-center 2xl:[&>span]:justify-center"
          fullWidth
          onClick={onCheckout}
        >
          {bundleBuilderData.reviewPanel.actions.checkoutLabel}
        </Button>
      </div>

      <Button
        className="2xl:absolute 2xl:bottom-0 2xl:left-0 2xl:h-[17px] 2xl:min-h-[17px] 2xl:w-full 2xl:rounded-none 2xl:border-transparent 2xl:bg-transparent 2xl:p-0 2xl:text-center 2xl:text-[14px] 2xl:font-normal 2xl:italic 2xl:leading-[1.2] 2xl:tracking-[-0.02px] 2xl:text-[#484848] 2xl:underline 2xl:decoration-solid 2xl:underline-offset-0 2xl:hover:bg-transparent 2xl:hover:text-[#484848] 2xl:[&>span]:h-[17px] 2xl:[&>span]:w-full"
        fullWidth
        onClick={onSave}
        variant="link"
      >
        {bundleBuilderData.reviewPanel.actions.saveLabel}
      </Button>
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
    </div>
  )
}

function ShippingRow() {
  const shipping = bundleBuilderData.reviewPanel.shipping

  return (
    <div className="flex items-center justify-between gap-3 rounded-card bg-surface p-3 xl:p-2 2xl:h-[57px] 2xl:w-full 2xl:rounded-none 2xl:border-t 2xl:border-[#CED6DE] 2xl:bg-transparent 2xl:px-0 2xl:pb-0 2xl:pt-[15px]">
      <div className="flex items-center gap-3 2xl:gap-4">
        <span className="flex h-11 w-11 items-center justify-center 2xl:h-[41px] 2xl:w-[41px] 2xl:rounded-[5px] 2xl:bg-white">
          <Icon name="fast-shipping" size={29} />
        </span>
        <p className="text-sm font-semibold text-text 2xl:text-[18px] 2xl:font-normal 2xl:leading-4 2xl:tracking-[0.5px] 2xl:text-[#0B0D10]">
          {shipping.label}
        </p>
      </div>
      <PriceDisplay
        align="end"
        compareAtCents={shipping.price.compareAtCents}
        currency={bundleBuilderData.currency}
        locale={bundleBuilderData.locale}
        priceCents={shipping.price.priceCents}
        priceLabel={shipping.price.priceLabel}
        size="sm"
        className="2xl:flex-nowrap 2xl:gap-x-2 2xl:[&>span]:text-[16px] 2xl:[&>span]:leading-4 2xl:[&>span]:tracking-[0.5px] 2xl:[&>span:first-child]:font-normal 2xl:[&>span:first-child]:text-[#6F7882] 2xl:[&>span:last-child]:font-semibold 2xl:[&>span:last-child]:text-[#4E2FD2]"
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
