export type StepId = 'cameras' | 'plan' | 'sensors' | 'extra-protection'

export type ReviewCategoryId = 'cameras' | 'sensors' | 'accessories' | 'plan'

export type BillingPeriod = 'month'

export type AssetReference = {
  assetKey: string
  alt: string
  figmaNodeId?: string
}

export type Price = {
  priceCents: number
  compareAtCents?: number
  billingPeriod?: BillingPeriod
  priceLabel?: string
  compareAtLabel?: string
}

export type QuantityConfig = {
  initial: number
  min: number
  max?: number
  readonly?: boolean
}

export type ProductVariant = {
  id: string
  label: string
  image: AssetReference
  swatchLabel?: string
  quantity: QuantityConfig
}

export type BuilderProductBase = {
  id: string
  stepId: StepId
  categoryId: ReviewCategoryId
  name: string
  reviewName?: string
  description: string
  learnMoreHref: string
  badgeLabel?: string
  image: AssetReference
  price: Price
}

export type VariantBuilderProduct = BuilderProductBase & {
  variants: ProductVariant[]
  selectedVariantId: string
  quantity?: never
}

export type SimpleBuilderProduct = BuilderProductBase & {
  variants?: never
  selectedVariantId?: never
  quantity: QuantityConfig
}

export type BuilderProduct = VariantBuilderProduct | SimpleBuilderProduct

export type IncludedReviewItem = {
  id: string
  stepId: StepId
  categoryId: ReviewCategoryId
  name: string
  description?: string
  image: AssetReference
  quantity: QuantityConfig
  price: Price
  required?: boolean
}

export type ReviewLineItem = {
  id: string
  categoryId: ReviewCategoryId
  name: string
  image: AssetReference
  quantity: number
  price: Price
  sourceProductId?: string
  sourceVariantId?: string
  sourceIncludedItemId?: string
  required?: boolean
}

export type ReviewCategory = {
  id: ReviewCategoryId
  title: string
}

export type BuilderStep = {
  id: StepId
  order: number
  eyebrow: string
  title: string
  icon: AssetReference
  initiallyOpen: boolean
  nextButtonLabel?: string
  productIds: string[]
  includedItemIds: string[]
}

export type ReviewPanel = {
  title: string
  categories: ReviewCategory[]
  initialLineItems: ReviewLineItem[]
  shipping: {
    label: string
    price: Price
    excludedFromTotals: boolean
  }
  guarantee: {
    label: string
    image: AssetReference
  }
  returnsLabel: string
  financingLabel: string
  totals: {
    compareAtCents: number
    priceCents: number
    savingsCents: number
  }
  actions: {
    checkoutLabel: string
    saveLabel: string
  }
}

export type BundleBuilderData = {
  currency: 'USD'
  locale: 'en-US'
  steps: BuilderStep[]
  products: BuilderProduct[]
  includedReviewItems: IncludedReviewItem[]
  reviewPanel: ReviewPanel
}
