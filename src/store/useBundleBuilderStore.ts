import { create } from 'zustand'
import bundleBuilderData from '../data/bundle-builder'
import type {
  BuilderProduct,
  IncludedReviewItem,
  ProductVariant,
  QuantityConfig,
  StepId,
  VariantBuilderProduct,
} from '../types/bundle-builder'

export const BUNDLE_BUILDER_STORAGE_KEY = 'wyze-bundle-builder-configuration'
export const BUNDLE_BUILDER_STORAGE_VERSION = 1

export type QuantityTarget =
  | {
      type: 'variant'
      productId: string
      variantId: string
    }
  | {
      type: 'product'
      productId: string
    }
  | {
      type: 'includedItem'
      includedItemId: string
    }

export type RestoreStatus = 'idle' | 'restored' | 'empty' | 'invalid'

export type BundleBuilderSnapshot = {
  activeStepId: StepId
  selectedVariantByProductId: Record<string, string>
  variantQuantities: Record<string, Record<string, number>>
  productQuantities: Record<string, number>
  includedItemQuantities: Record<string, number>
}

export type PersistedBundleBuilderState = {
  version: typeof BUNDLE_BUILDER_STORAGE_VERSION
  savedAt: string
  state: BundleBuilderSnapshot
}

export type BundleBuilderStore = BundleBuilderSnapshot & {
  lastSavedAt: string | null
  restoreStatus: RestoreStatus
  selectActiveVariant: (productId: string, variantId: string) => void
  increaseQuantity: (target: QuantityTarget) => void
  decreaseQuantity: (target: QuantityTarget) => void
  setQuantity: (target: QuantityTarget, quantity: number) => void
  openStep: (stepId: StepId) => void
  advanceToNextStep: () => void
  saveConfiguration: () => boolean
  restoreSavedConfiguration: () => RestoreStatus
  resetInvalidPersistedData: () => void
  resetToInitialState: () => void
}

type IndexedProduct = {
  product: BuilderProduct
  variantsById: Map<string, ProductVariant>
}

type BundleBuilderIndex = {
  stepIds: Set<StepId>
  orderedStepIds: StepId[]
  productsById: Map<string, IndexedProduct>
  includedItemsById: Map<string, IncludedReviewItem>
}

const bundleBuilderIndex = createBundleBuilderIndex()
const initialSnapshot = createInitialSnapshot(bundleBuilderIndex)

export const useBundleBuilderStore = create<BundleBuilderStore>((set, get) => ({
  ...initialSnapshot,
  lastSavedAt: null,
  restoreStatus: 'idle',
  selectActiveVariant: (productId, variantId) => {
    const indexedProduct = bundleBuilderIndex.productsById.get(productId)

    if (!indexedProduct?.variantsById.has(variantId)) {
      return
    }

    set((state) => ({
      selectedVariantByProductId: {
        ...state.selectedVariantByProductId,
        [productId]: variantId,
      },
    }))
  },
  increaseQuantity: (target) => {
    updateQuantity(set, get, target, 1)
  },
  decreaseQuantity: (target) => {
    updateQuantity(set, get, target, -1)
  },
  setQuantity: (target, quantity) => {
    setQuantity(set, target, quantity)
  },
  openStep: (stepId) => {
    if (!bundleBuilderIndex.stepIds.has(stepId)) {
      return
    }

    set({ activeStepId: stepId })
  },
  advanceToNextStep: () => {
    const currentStepIndex = bundleBuilderIndex.orderedStepIds.indexOf(
      get().activeStepId,
    )
    const nextStepId = bundleBuilderIndex.orderedStepIds[currentStepIndex + 1]

    if (!nextStepId) {
      return
    }

    set({ activeStepId: nextStepId })
  },
  saveConfiguration: () => {
    const savedAt = new Date().toISOString()
    const persistedState: PersistedBundleBuilderState = {
      version: BUNDLE_BUILDER_STORAGE_VERSION,
      savedAt,
      state: getSnapshot(get()),
    }

    const storage = getBrowserStorage()

    if (!storage) {
      return false
    }

    try {
      storage.setItem(
        BUNDLE_BUILDER_STORAGE_KEY,
        JSON.stringify(persistedState),
      )
    } catch {
      return false
    }

    set({
      lastSavedAt: savedAt,
      restoreStatus: 'idle',
    })

    return true
  },
  restoreSavedConfiguration: () => {
    const storage = getBrowserStorage()

    if (!storage) {
      set({ restoreStatus: 'empty' })
      return 'empty'
    }

    let rawPersistedState: string | null

    try {
      rawPersistedState = storage.getItem(BUNDLE_BUILDER_STORAGE_KEY)
    } catch {
      set({ restoreStatus: 'empty' })
      return 'empty'
    }

    if (!rawPersistedState) {
      set({ restoreStatus: 'empty' })
      return 'empty'
    }

    const persistedState = parsePersistedState(rawPersistedState)

    if (!persistedState) {
      get().resetInvalidPersistedData()
      return 'invalid'
    }

    const sanitizedSnapshot = sanitizeSnapshot(persistedState.state)

    if (!sanitizedSnapshot) {
      get().resetInvalidPersistedData()
      return 'invalid'
    }

    set({
      ...sanitizedSnapshot,
      lastSavedAt: persistedState.savedAt,
      restoreStatus: 'restored',
    })

    return 'restored'
  },
  resetInvalidPersistedData: () => {
    removePersistedState()

    set({
      ...initialSnapshot,
      lastSavedAt: null,
      restoreStatus: 'invalid',
    })
  },
  resetToInitialState: () => {
    set({
      ...initialSnapshot,
      lastSavedAt: null,
      restoreStatus: 'idle',
    })
  },
}))

function createBundleBuilderIndex(): BundleBuilderIndex {
  return {
    stepIds: new Set(bundleBuilderData.steps.map((step) => step.id)),
    orderedStepIds: [...bundleBuilderData.steps]
      .sort((firstStep, secondStep) => firstStep.order - secondStep.order)
      .map((step) => step.id),
    productsById: new Map(
      bundleBuilderData.products.map((product) => [
        product.id,
        {
          product,
          variantsById: new Map(
            isVariantProduct(product)
              ? product.variants.map((variant) => [variant.id, variant])
              : [],
          ),
        },
      ]),
    ),
    includedItemsById: new Map(
      bundleBuilderData.includedReviewItems.map((item) => [item.id, item]),
    ),
  }
}

function createInitialSnapshot(
  index: BundleBuilderIndex,
): BundleBuilderSnapshot {
  const selectedVariantByProductId: BundleBuilderSnapshot['selectedVariantByProductId'] =
    {}
  const variantQuantities: BundleBuilderSnapshot['variantQuantities'] = {}
  const productQuantities: BundleBuilderSnapshot['productQuantities'] = {}
  const includedItemQuantities: BundleBuilderSnapshot['includedItemQuantities'] =
    {}

  index.productsById.forEach(({ product }) => {
    if (isVariantProduct(product)) {
      selectedVariantByProductId[product.id] = product.selectedVariantId
      variantQuantities[product.id] = Object.fromEntries(
        product.variants.map((variant) => [
          variant.id,
          clampQuantity(variant.quantity.initial, variant.quantity),
        ]),
      )
      return
    }

    productQuantities[product.id] = clampQuantity(
      product.quantity.initial,
      product.quantity,
    )
  })

  index.includedItemsById.forEach((item) => {
    includedItemQuantities[item.id] = clampQuantity(
      item.quantity.initial,
      item.quantity,
    )
  })

  return {
    activeStepId:
      bundleBuilderData.steps.find((step) => step.initiallyOpen)?.id ??
      getFirstStepId(index),
    selectedVariantByProductId,
    variantQuantities,
    productQuantities,
    includedItemQuantities,
  }
}

function updateQuantity(
  set: (
    partial:
      | Partial<BundleBuilderStore>
      | ((state: BundleBuilderStore) => Partial<BundleBuilderStore>),
  ) => void,
  get: () => BundleBuilderStore,
  target: QuantityTarget,
  delta: number,
) {
  const currentQuantity = getQuantity(get(), target)

  if (currentQuantity === null) {
    return
  }

  setQuantity(set, target, currentQuantity + delta)
}

function setQuantity(
  set: (
    partial:
      | Partial<BundleBuilderStore>
      | ((state: BundleBuilderStore) => Partial<BundleBuilderStore>),
  ) => void,
  target: QuantityTarget,
  quantity: number,
) {
  const quantityConfig = getQuantityConfig(target)

  if (!quantityConfig || quantityConfig.readonly) {
    return
  }

  const nextQuantity = clampQuantity(quantity, quantityConfig)

  if (target.type === 'variant') {
    set((state) => ({
      variantQuantities: {
        ...state.variantQuantities,
        [target.productId]: {
          ...state.variantQuantities[target.productId],
          [target.variantId]: nextQuantity,
        },
      },
    }))
    return
  }

  if (target.type === 'product') {
    set((state) => ({
      productQuantities: {
        ...state.productQuantities,
        [target.productId]: nextQuantity,
      },
    }))
    return
  }

  set((state) => ({
    includedItemQuantities: {
      ...state.includedItemQuantities,
      [target.includedItemId]: nextQuantity,
    },
  }))
}

function getQuantity(
  state: BundleBuilderSnapshot,
  target: QuantityTarget,
): number | null {
  if (target.type === 'variant') {
    return state.variantQuantities[target.productId]?.[target.variantId] ?? null
  }

  if (target.type === 'product') {
    return state.productQuantities[target.productId] ?? null
  }

  return state.includedItemQuantities[target.includedItemId] ?? null
}

function getQuantityConfig(target: QuantityTarget): QuantityConfig | null {
  if (target.type === 'variant') {
    const indexedProduct = bundleBuilderIndex.productsById.get(target.productId)

    return indexedProduct?.variantsById.get(target.variantId)?.quantity ?? null
  }

  if (target.type === 'product') {
    const indexedProduct = bundleBuilderIndex.productsById.get(target.productId)

    if (!indexedProduct || isVariantProduct(indexedProduct.product)) {
      return null
    }

    return indexedProduct.product.quantity
  }

  return (
    bundleBuilderIndex.includedItemsById.get(target.includedItemId)?.quantity ??
    null
  )
}

function getSnapshot(state: BundleBuilderSnapshot): BundleBuilderSnapshot {
  return {
    activeStepId: state.activeStepId,
    selectedVariantByProductId: state.selectedVariantByProductId,
    variantQuantities: state.variantQuantities,
    productQuantities: state.productQuantities,
    includedItemQuantities: state.includedItemQuantities,
  }
}

function sanitizeSnapshot(
  snapshot: BundleBuilderSnapshot,
): BundleBuilderSnapshot | null {
  if (!isRecord(snapshot)) {
    return null
  }

  const activeStepId = bundleBuilderIndex.stepIds.has(snapshot.activeStepId)
    ? snapshot.activeStepId
    : initialSnapshot.activeStepId

  const selectedVariantByProductId = sanitizeSelectedVariants(
    snapshot.selectedVariantByProductId,
  )
  const variantQuantities = sanitizeVariantQuantities(
    snapshot.variantQuantities,
  )
  const productQuantities = sanitizeProductQuantities(
    snapshot.productQuantities,
  )
  const includedItemQuantities = sanitizeIncludedItemQuantities(
    snapshot.includedItemQuantities,
  )

  return {
    activeStepId,
    selectedVariantByProductId,
    variantQuantities,
    productQuantities,
    includedItemQuantities,
  }
}

function sanitizeSelectedVariants(
  selectedVariants: BundleBuilderSnapshot['selectedVariantByProductId'],
) {
  const nextSelectedVariants = {
    ...initialSnapshot.selectedVariantByProductId,
  }

  if (!isRecord(selectedVariants)) {
    return nextSelectedVariants
  }

  Object.entries(selectedVariants).forEach(([productId, variantId]) => {
    if (typeof variantId !== 'string') {
      return
    }

    const indexedProduct = bundleBuilderIndex.productsById.get(productId)

    if (!indexedProduct?.variantsById.has(variantId)) {
      return
    }

    nextSelectedVariants[productId] = variantId
  })

  return nextSelectedVariants
}

function sanitizeVariantQuantities(
  variantQuantities: BundleBuilderSnapshot['variantQuantities'],
) {
  const nextVariantQuantities = structuredClone(
    initialSnapshot.variantQuantities,
  )

  if (!isRecord(variantQuantities)) {
    return nextVariantQuantities
  }

  Object.entries(variantQuantities).forEach(
    ([productId, quantitiesByVariant]) => {
      if (!isRecord(quantitiesByVariant)) {
        return
      }

      const indexedProduct = bundleBuilderIndex.productsById.get(productId)

      if (!indexedProduct) {
        return
      }

      Object.entries(quantitiesByVariant).forEach(([variantId, quantity]) => {
        const quantityConfig =
          indexedProduct.variantsById.get(variantId)?.quantity

        if (!quantityConfig) {
          return
        }

        nextVariantQuantities[productId][variantId] = clampQuantity(
          quantity,
          quantityConfig,
        )
      })
    },
  )

  return nextVariantQuantities
}

function sanitizeProductQuantities(
  productQuantities: BundleBuilderSnapshot['productQuantities'],
) {
  const nextProductQuantities = { ...initialSnapshot.productQuantities }

  if (!isRecord(productQuantities)) {
    return nextProductQuantities
  }

  Object.entries(productQuantities).forEach(([productId, quantity]) => {
    const indexedProduct = bundleBuilderIndex.productsById.get(productId)

    if (!indexedProduct || isVariantProduct(indexedProduct.product)) {
      return
    }

    nextProductQuantities[productId] = clampQuantity(
      quantity,
      indexedProduct.product.quantity,
    )
  })

  return nextProductQuantities
}

function sanitizeIncludedItemQuantities(
  includedItemQuantities: BundleBuilderSnapshot['includedItemQuantities'],
) {
  const nextIncludedItemQuantities = {
    ...initialSnapshot.includedItemQuantities,
  }

  if (!isRecord(includedItemQuantities)) {
    return nextIncludedItemQuantities
  }

  Object.entries(includedItemQuantities).forEach(([itemId, quantity]) => {
    const item = bundleBuilderIndex.includedItemsById.get(itemId)

    if (!item) {
      return
    }

    nextIncludedItemQuantities[itemId] = clampQuantity(quantity, item.quantity)
  })

  return nextIncludedItemQuantities
}

function parsePersistedState(
  rawPersistedState: string,
): PersistedBundleBuilderState | null {
  try {
    const parsedState = JSON.parse(rawPersistedState) as unknown

    if (!isRecord(parsedState)) {
      return null
    }

    if (parsedState.version !== BUNDLE_BUILDER_STORAGE_VERSION) {
      return null
    }

    if (typeof parsedState.savedAt !== 'string') {
      return null
    }

    if (!isRecord(parsedState.state)) {
      return null
    }

    return parsedState as PersistedBundleBuilderState
  } catch {
    return null
  }
}

function clampQuantity(quantity: unknown, config: QuantityConfig) {
  const numericQuantity =
    typeof quantity === 'number' && Number.isFinite(quantity)
      ? quantity
      : config.initial
  const roundedQuantity = Math.max(0, Math.floor(numericQuantity))
  const minimumQuantity = Math.max(0, config.min)
  const maximumQuantity = config.max ?? Number.POSITIVE_INFINITY

  return Math.min(Math.max(roundedQuantity, minimumQuantity), maximumQuantity)
}

function getBrowserStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isVariantProduct(
  product: BuilderProduct,
): product is VariantBuilderProduct {
  return Array.isArray(product.variants)
}

function getFirstStepId(index: BundleBuilderIndex) {
  return index.orderedStepIds[0] ?? 'cameras'
}

function removePersistedState() {
  try {
    getBrowserStorage()?.removeItem(BUNDLE_BUILDER_STORAGE_KEY)
  } catch {
    return
  }
}
