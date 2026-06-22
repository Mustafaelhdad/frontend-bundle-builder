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
      className="w-full max-w-[768px] justify-self-center rounded-none bg-surface-tinted p-4 text-text shadow-none sm:rounded-card sm:shadow-sm md:sticky md:top-[49px] md:w-[399px] md:max-w-[399px] md:overflow-visible md:rounded-[10px] md:bg-[#EDF4FF] md:px-0 md:pb-[31px] md:pt-[15px] md:shadow-none xl:justify-self-start 2xl:static 2xl:min-h-[658px] 2xl:w-full 2xl:max-w-none 2xl:justify-self-stretch 2xl:overflow-visible 2xl:rounded-[10px] 2xl:bg-surface-tinted 2xl:p-0 2xl:shadow-none"
    >
      <div className="space-y-4 md:flex md:w-full md:flex-col md:gap-[10px] md:space-y-0 2xl:mx-auto 2xl:grid 2xl:min-h-[658px] 2xl:w-[1213px] 2xl:grid-cols-[552px_486px] 2xl:items-start 2xl:gap-x-[52px] 2xl:px-[61.5px] 2xl:py-[35px] 2xl:space-y-0">
        <div className="space-y-4 md:flex md:w-full md:flex-col md:gap-[10px] md:space-y-0 2xl:flex 2xl:min-h-[588px] 2xl:w-[552px] 2xl:flex-col 2xl:gap-[7.5px] 2xl:space-y-0">
          <div className="space-y-1 md:flex md:w-full md:flex-col md:gap-[25px] md:space-y-0 2xl:h-[70px] 2xl:gap-0 2xl:space-y-0">
            <p className="hidden text-[12px] font-medium uppercase leading-3 tracking-[1.6px] text-[#484848] md:flex md:h-3 md:w-full md:px-[15px] 2xl:hidden">
              Review
            </p>
            <div className="space-y-1 md:flex md:w-full md:flex-col md:gap-[5px] md:space-y-0">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] md:ml-[20px] md:h-[22px] md:w-[350px] md:text-[22px] md:leading-none md:tracking-[0.6px] 2xl:ml-0 2xl:mr-auto 2xl:h-7 2xl:w-auto 2xl:self-start 2xl:text-left 2xl:text-[28px] 2xl:leading-7 2xl:tracking-[0.6px]">
                {bundleBuilderData.reviewPanel.title}
              </h2>
              <p className="text-sm leading-6 text-text-muted md:ml-[20px] md:h-9 md:w-[350px] md:text-[14px] md:font-medium md:leading-[1.3] md:tracking-[0.6px] md:text-[#1F1F1F]/75 2xl:mx-auto 2xl:h-[42px] 2xl:w-auto 2xl:text-[16px] 2xl:leading-[1.3] 2xl:tracking-[0.6px] 2xl:text-[#1F1F1F]/75">
                Review your personalized protection system designed to keep what
                matters most safe.
              </p>
            </div>
          </div>

          <div className="space-y-4 md:ml-[20px] md:block md:w-[350px] md:space-y-[10px] 2xl:mx-auto 2xl:block 2xl:w-auto 2xl:space-y-[21px]">
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
                    'space-y-2 md:flex md:w-full md:flex-col md:gap-2 md:space-y-0 md:border-t md:border-[#CED6DE] md:pt-[15px] 2xl:border-t 2xl:border-[#CED6DE] 2xl:pt-[15px]',
                    isPlanCategory && 'md:h-[70px] md:flex-col md:gap-2',
                  )}
                  key={category.id}
                >
                  <h3
                    className={cn(
                      'text-xs font-semibold uppercase tracking-[0.18em] text-text-muted md:h-4 md:text-[12px] md:font-normal md:leading-4 md:tracking-[0.36px] md:text-[#A8B2BD]',
                    )}
                  >
                    {category.title}
                  </h3>
                  <div
                    className={cn(
                      'space-y-2 md:space-y-[8px]',
                      isPlanCategory && 'md:h-[31px] md:w-full md:space-y-0',
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

        <div className="grid gap-3 md:hidden">
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

          <div className="space-y-2 md:col-span-2 md:mx-auto md:w-full md:max-w-sm">
            <Button fullWidth onClick={handleCheckout} size="lg">
              {bundleBuilderData.reviewPanel.actions.checkoutLabel}
            </Button>
            <Button fullWidth onClick={handleSave} variant="link">
              {bundleBuilderData.reviewPanel.actions.saveLabel}
            </Button>
          </div>
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

        <div
          aria-live="polite"
          className="min-h-6 text-sm text-text-muted md:hidden"
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
        'grid grid-cols-[44px_1fr] gap-3 rounded-card bg-surface p-3 md:flex md:w-full md:items-center md:rounded-none md:bg-transparent md:p-0',
        isPlan ? 'md:h-[31px] md:gap-[3px]' : 'md:min-h-[41px] md:gap-4',
      )}
    >
      <AssetPlaceholder
        asset={line.image}
        className={cn(
          'flex h-11 w-11 items-center justify-center md:shrink-0 md:overflow-hidden',
          isPlan
            ? 'md:h-[31px] md:w-[26px] md:rounded-none md:bg-transparent md:[&_svg]:h-[31px] md:[&_svg]:w-[26px]'
            : 'md:h-[41px] md:w-[41px] md:rounded-[5px] md:bg-white',
        )}
      />
      <div
        className={cn(
          'min-w-0 space-y-2 md:flex-1 md:items-center md:space-y-0',
          isPlan
            ? 'md:flex md:h-[31px] md:justify-between md:gap-3'
            : 'md:grid md:min-h-[41px] md:grid-cols-[minmax(0,1fr)_72px_auto] md:items-center md:gap-x-3 2xl:grid-cols-[minmax(0,1fr)_72px_auto]',
        )}
      >
        <div className="flex items-start justify-between gap-3 md:contents">
          <p
            className={cn(
              'text-sm font-semibold leading-5 text-text md:col-start-1 md:row-start-1 md:text-[#0B0D10]',
              isPlan
                ? 'md:h-4 md:w-auto md:min-w-max md:whitespace-nowrap md:text-[14px] md:font-bold md:leading-4 md:tracking-[-0.04px]'
                : 'md:w-full md:text-[14px] md:font-medium md:leading-4 md:tracking-[0.5px] 2xl:w-auto 2xl:text-[18px] 2xl:font-normal',
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
              'md:flex-nowrap md:gap-x-1 md:[&>span]:text-[12px] md:[&>span]:leading-3 md:[&>span]:tracking-normal md:[&>span:first-child]:font-normal md:[&>span:first-child]:text-[#6F7882] md:[&>span:last-child]:font-semibold md:[&>span:last-child]:text-[#4E2FD2] md:[&>span:last-child>span]:font-semibold md:[&>span:last-child>span]:text-[#4E2FD2]',
              isPlan
                ? 'md:h-[31px] md:items-center md:gap-x-3'
                : 'md:col-start-3 md:row-start-1 md:h-8 md:flex-col md:items-end md:gap-0 md:[&>span]:h-4 md:[&>span]:text-[14px] md:[&>span]:leading-4 md:[&>span]:tracking-[0.5px] 2xl:h-auto 2xl:w-auto 2xl:flex-row 2xl:items-baseline 2xl:gap-x-2 2xl:[&>span]:h-auto 2xl:[&>span]:text-[16px]',
              !isPlan &&
                !line.price.compareAtCents &&
                !line.price.compareAtLabel &&
                'md:justify-center 2xl:justify-end',
            )}
          />
        </div>
        <QuantityStepper
          className={cn(
            'origin-left scale-[0.86] md:col-start-2 md:row-start-1 md:h-7 md:w-[72px] md:scale-100 md:justify-between md:gap-0 md:rounded-[4px] md:border-0 md:bg-transparent md:px-0 md:py-1 md:[&_button]:min-h-5 md:[&_button]:min-w-5 md:[&_button>span]:h-5 md:[&_button>span]:w-5 md:[&_button>span]:rounded-[4px] md:[&_button>span]:border md:[&_button>span]:border-[#CED6DE] md:[&_output]:min-w-[8px] md:[&_output]:text-[14px] md:[&_output]:font-semibold md:[&_output]:leading-4 md:[&_svg]:h-3 md:[&_svg]:w-3',
            isPlan && 'md:hidden',
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
    <div className="hidden md:ml-[20px] md:flex md:w-[350px] md:flex-col md:gap-[10px] 2xl:hidden">
      <div className="flex w-full flex-col gap-1">
        <div className="flex h-[78px] w-full items-start justify-between">
          <AssetPlaceholder
            asset={bundleBuilderData.reviewPanel.guarantee.image}
            className="h-[78px] w-[78px] shrink-0"
          />

          <div className="flex h-[78px] w-[145px] flex-col items-end gap-2">
            <p className="flex h-[18px] w-[113px] items-center justify-center overflow-hidden whitespace-nowrap rounded-[3px] bg-[#4E2FD2] px-2 py-[5px] text-[12px] font-normal leading-none tracking-[-0.6px] text-white">
              {bundleBuilderData.reviewPanel.financingLabel}
            </p>

            <div className="flex h-8 w-[145px] items-center justify-end gap-2 text-right">
              <span className="flex h-5 w-[60px] items-center justify-end whitespace-nowrap text-[18px] font-medium leading-5 tracking-[0.25px] text-[#6F7882] line-through">
                {formatCurrency(totals.compareAtCents)}
              </span>
              <span className="flex h-8 items-center justify-end whitespace-nowrap text-[28px] font-semibold leading-8 tracking-[-0.04px] text-[#4E2FD2]">
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
        className="h-[17px] min-h-[17px] w-full rounded-none border-transparent bg-transparent !p-0 text-center text-[14px] !font-normal italic leading-[1.2] !tracking-[-0.02px] !text-[#484848] underline decoration-solid !underline-offset-0 hover:bg-transparent hover:!text-[#484848] [&>span]:h-[17px] [&>span]:w-full"
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
    <div className="flex items-center justify-between gap-3 rounded-card bg-surface p-3 md:ml-[20px] md:h-[57px] md:w-[350px] md:rounded-none md:border-t md:border-[#CED6DE] md:bg-transparent md:px-0 md:pb-0 md:pt-[15px] 2xl:mx-0 2xl:w-full">
      <div className="flex items-center gap-3 md:gap-4">
        <span className="flex h-11 w-11 items-center justify-center md:h-[41px] md:w-[41px] md:rounded-[5px] md:bg-white">
          <Icon name="fast-shipping" size={29} />
        </span>
        <p className="text-sm font-semibold text-text md:text-[14px] md:font-medium md:leading-4 md:tracking-[0.5px] md:text-[#0B0D10] 2xl:text-[18px] 2xl:font-normal">
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
        className="md:h-8 md:w-[39px] md:flex-col md:flex-nowrap md:items-end md:gap-0 md:[&>span]:h-4 md:[&>span]:text-[14px] md:[&>span]:leading-4 md:[&>span]:tracking-[0.5px] md:[&>span:first-child]:font-normal md:[&>span:first-child]:text-[#6F7882] md:[&>span:last-child]:font-semibold md:[&>span:last-child]:text-[#4E2FD2] 2xl:h-auto 2xl:w-auto 2xl:flex-row 2xl:items-baseline 2xl:gap-x-2 2xl:[&>span]:h-auto 2xl:[&>span]:text-[16px]"
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
