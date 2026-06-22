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
      className="w-full max-w-[768px] justify-self-center rounded-none bg-surface-tinted px-0 pb-[31px] pt-[15px] text-text shadow-none sm:rounded-card sm:shadow-sm md:sticky md:top-[49px] md:w-[399px] md:max-w-[399px] md:overflow-visible md:rounded-[10px] md:bg-[#EDF4FF] md:px-0 md:pb-[31px] md:pt-[15px] md:shadow-none xl:justify-self-start 2xl:static 2xl:min-h-[658px] 2xl:w-full 2xl:max-w-none 2xl:justify-self-stretch 2xl:overflow-visible 2xl:rounded-[10px] 2xl:bg-surface-tinted 2xl:p-0 2xl:shadow-none"
    >
      <div className="flex w-full flex-col gap-[5px] md:gap-[10px] 2xl:mx-auto 2xl:grid 2xl:min-h-[658px] 2xl:w-[1213px] 2xl:grid-cols-[552px_486px] 2xl:items-start 2xl:gap-x-[52px] 2xl:px-[61.5px] 2xl:py-[35px]">
        <div className="flex w-full flex-col gap-[10px] md:gap-[10px] 2xl:flex 2xl:min-h-[588px] 2xl:w-[552px] 2xl:flex-col 2xl:gap-[7.5px]">
          <div className="flex w-full flex-col gap-[25px] 2xl:h-[70px] 2xl:gap-0">
            <p className="flex h-[10px] w-full px-[15px] text-[10px] font-medium uppercase leading-[10px] tracking-[1.6px] text-[#484848] md:h-3 md:text-[12px] md:leading-3 2xl:hidden">
              Review
            </p>
            <div className="mx-auto flex w-[350px] max-w-[calc(100vw-20px)] flex-col gap-[5px] md:ml-[20px] md:w-[350px] 2xl:ml-0 2xl:mr-auto 2xl:w-auto 2xl:self-start">
              <h2 className="h-[22px] text-[28px] font-semibold leading-none tracking-[0.6px] text-[#1F1F1F] md:h-[22px] md:text-[22px] md:leading-none md:tracking-[0.6px] 2xl:h-7 2xl:w-auto 2xl:text-left 2xl:text-[28px] 2xl:leading-7">
                {bundleBuilderData.reviewPanel.title}
              </h2>
              <p className="h-8 w-full text-[12px] font-medium leading-[1.3] tracking-[0.6px] text-[#1F1F1F]/75 md:h-9 md:text-[14px] md:leading-[1.3] md:tracking-[0.6px] md:text-[#1F1F1F]/75 2xl:mx-auto 2xl:h-[42px] 2xl:w-auto 2xl:text-[16px] 2xl:leading-[1.3] 2xl:tracking-[0.6px]">
                Review your personalized protection system designed to keep what
                matters most safe.
              </p>
            </div>
          </div>

          <div className="mx-auto flex w-[350px] max-w-[calc(100vw-20px)] flex-col gap-[10px] md:ml-[20px] md:w-[350px] 2xl:mx-auto 2xl:w-auto 2xl:gap-[21px]">
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
                    'flex w-full flex-col gap-2 border-t border-[#CED6DE] pt-[15px] md:gap-2 2xl:border-t 2xl:border-[#CED6DE] 2xl:pt-[15px]',
                    isPlanCategory && 'md:h-[70px] md:flex-col md:gap-2',
                  )}
                  key={category.id}
                >
                  <h3
                    className={cn(
                      'h-4 text-[14px] font-normal uppercase leading-4 tracking-[0.36px] text-[#A8B2BD] md:h-4 md:text-[12px] md:font-normal md:leading-4 md:tracking-[0.36px] md:text-[#A8B2BD]',
                    )}
                  >
                    {category.title}
                  </h3>
                  <div
                    className={cn(
                      'flex flex-col gap-[8px]',
                      isPlanCategory && 'md:h-[31px] md:w-full md:gap-0',
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

        <ReviewSummaryCompact
          message={checkoutMessage ?? saveMessage}
          onCheckout={handleCheckout}
          onSave={handleSave}
          totals={totals}
        />

        <ReviewSummary2xl
          message={checkoutMessage ?? saveMessage}
          onCheckout={handleCheckout}
          onSave={handleSave}
          totals={totals}
        />

        <div aria-live="polite" className="sr-only md:hidden">
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
  const hasCompareAtPrice =
    typeof line.price.compareAtCents === 'number' ||
    Boolean(line.price.compareAtLabel)

  return (
    <div
      className={cn(
        'flex w-full items-center rounded-none bg-transparent p-0',
        isPlan
          ? 'h-[31px] gap-[3px]'
          : 'h-[41px] gap-4 md:h-auto md:min-h-[41px]',
      )}
    >
      <AssetPlaceholder
        asset={line.image}
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden',
          isPlan
            ? 'h-[31px] w-[26px] rounded-none bg-transparent [&_svg]:h-[31px] [&_svg]:w-[26px]'
            : 'h-[41px] w-[41px] rounded-[5px] bg-white',
        )}
      />
      <div
        className={cn(
          'min-w-0 flex-1 items-center',
          isPlan
            ? 'flex h-[31px] justify-between gap-3'
            : 'grid min-h-[41px] grid-cols-[minmax(0,1fr)_72px_max-content] gap-x-3 md:h-auto md:min-h-[41px] md:grid-cols-[minmax(0,1fr)_72px_max-content] md:gap-x-3 2xl:grid-cols-[minmax(0,1fr)_72px_max-content]',
        )}
      >
        <div className="contents">
          <p
            className={cn(
              'col-start-1 row-start-1 text-[#0B0D10]',
              isPlan
                ? 'h-4 w-auto min-w-max whitespace-nowrap text-[14px] font-bold leading-4 tracking-[-0.04px]'
                : 'line-clamp-2 w-full min-w-0 text-[14px] font-medium leading-4 tracking-[0.5px] 2xl:w-auto 2xl:text-[18px] 2xl:font-normal',
            )}
            title={line.name}
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
              'flex-nowrap gap-x-1 [&>span]:text-[12px] [&>span]:leading-3 [&>span]:tracking-normal [&>span:first-child]:font-normal [&>span:first-child]:text-[#6F7882] [&>span:last-child]:font-semibold [&>span:last-child]:text-[#4E2FD2] [&>span:last-child>span]:font-semibold [&>span:last-child>span]:text-[#4E2FD2]',
              isPlan
                ? 'ml-auto h-[31px] shrink-0 items-center gap-x-3'
                : 'col-start-3 row-start-1 h-8 min-w-max flex-col items-end gap-0 max-md:!flex-nowrap max-md:!gap-0 max-md:!gap-x-0 max-md:!gap-y-0 [&>span]:h-4 [&>span]:whitespace-nowrap [&>span:first-child]:text-[12px] [&>span:first-child]:leading-4 max-md:[&>span:first-child]:tracking-[0.005em] md:[&>span:first-child]:text-[14px] md:[&>span:first-child]:tracking-[0.5px] [&>span:last-child]:text-[14px] [&>span:last-child]:leading-4 max-md:[&>span:last-child]:tracking-[0.005em] md:[&>span:last-child]:tracking-[0.5px] 2xl:h-auto 2xl:flex-row 2xl:items-baseline 2xl:gap-x-2 2xl:[&>span]:h-auto 2xl:[&>span]:text-[16px]',
              !isPlan &&
                !hasCompareAtPrice &&
                '!h-4 self-center !justify-center 2xl:!h-auto 2xl:!justify-end',
            )}
          />
        </div>
        {!isPlan ? (
          <QuantityStepper
            className="col-start-2 row-start-1 h-7 w-[72px] justify-between gap-0 rounded-[4px] border-0 bg-transparent px-0 py-1 [&_button]:min-h-5 [&_button]:min-w-5 [&_button>span]:h-5 [&_button>span]:w-5 [&_button>span]:rounded-[4px] [&_button>span]:border [&_button>span]:border-[#CED6DE] [&_output]:min-w-[8px] [&_output]:text-[14px] [&_output]:font-semibold [&_output]:leading-4 [&_svg]:h-3 [&_svg]:w-3"
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
        ) : null}
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

function ReviewSummaryCompact({
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
    <div className="mx-auto flex w-[350px] max-w-[calc(100vw-20px)] flex-col gap-[8px] md:ml-[20px] md:gap-[10px] 2xl:hidden">
      <div className="flex w-full flex-col gap-1">
        <div className="flex h-[78px] w-full items-start justify-between">
          <AssetPlaceholder
            asset={bundleBuilderData.reviewPanel.guarantee.image}
            className="h-[78px] w-[78px] shrink-0"
          />

          <div className="flex h-[78px] w-max min-w-[172px] flex-col items-end gap-2 pt-[6px] md:pt-0">
            <p className="flex h-[18px] w-[113px] items-center justify-center overflow-hidden whitespace-nowrap rounded-[3px] bg-[#4E2FD2] px-2 py-[5px] text-[12px] font-normal leading-none tracking-[-0.6px] text-white">
              {bundleBuilderData.reviewPanel.financingLabel}
            </p>

            <div className="grid h-8 min-w-[172px] grid-cols-[max-content_max-content] items-center justify-end gap-x-3 text-right">
              <span className="flex h-5 items-center justify-end whitespace-nowrap text-[18px] font-medium leading-5 tracking-[0.25px] text-[#6F7882] line-through">
                {formatCurrency(totals.compareAtCents)}
              </span>
              <span className="flex h-8 items-center justify-end whitespace-nowrap text-[24px] font-bold leading-8 tracking-[-0.03px] text-[#4E2FD2] md:text-[28px] md:font-semibold md:tracking-[-0.04px]">
                {formatCurrency(totals.priceCents)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex h-[74px] w-full flex-col gap-1 pt-[10px]">
          <p className="h-3 w-full text-center text-[12px] font-semibold leading-none tracking-[-0.06px] text-[#00A288]">
            Congrats! You’re saving {formatCurrency(totals.savingsCents)} on
            your security bundle!
          </p>

          <Button
            className="h-12 min-h-12 w-full gap-2 !rounded-[4px] border-[#4E2FD2] bg-[#4E2FD2] px-[16px] py-[13px] text-[17px] !font-bold leading-none tracking-normal text-white hover:bg-[#3510D4] [&>span]:flex [&>span]:h-[22px] [&>span]:w-[318px] [&>span]:items-center [&>span]:justify-center"
            fullWidth
            onClick={onCheckout}
          >
            {bundleBuilderData.reviewPanel.actions.checkoutLabel}
          </Button>
        </div>
      </div>

      <Button
        className="h-[14px] min-h-[14px] w-full rounded-none border-transparent bg-transparent !p-0 text-center text-[12px] !font-normal italic leading-[1.2] !tracking-[-0.02px] !text-[#484848] underline decoration-solid !underline-offset-0 hover:bg-transparent hover:!text-[#484848] md:h-[17px] md:min-h-[17px] md:text-[14px] [&>span]:h-[14px] [&>span]:w-full md:[&>span]:h-[17px]"
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
    <div className="mx-auto flex h-[57px] w-[calc(100%-20px)] max-w-[350px] items-center justify-between gap-3 rounded-none border-t border-[#CED6DE] bg-transparent px-0 pb-0 pt-[15px] md:ml-[20px] md:w-[350px] md:max-w-none 2xl:mx-0 2xl:w-full">
      <div className="flex items-center gap-3">
        <span className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-[5px] bg-white">
          <Icon name="fast-shipping" size={29} />
        </span>
        <p className="text-[16px] font-normal leading-4 tracking-[0.5px] text-[#0B0D10] md:text-[14px] md:font-medium md:leading-4 md:tracking-[0.5px] md:text-[#0B0D10] 2xl:text-[18px] 2xl:font-normal">
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
        className="h-8 w-[39px] flex-col !flex-nowrap items-end !gap-0 !gap-x-0 !gap-y-0 [&>span]:h-4 [&>span]:text-[14px] [&>span]:leading-4 [&>span]:tracking-[0.5px] [&>span:first-child]:font-normal [&>span:first-child]:text-[#6F7882] [&>span:last-child]:font-semibold [&>span:last-child]:text-[#4E2FD2] 2xl:h-auto 2xl:w-auto 2xl:flex-row 2xl:items-baseline 2xl:!gap-x-2 2xl:[&>span]:h-auto 2xl:[&>span]:text-[16px]"
      />
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
