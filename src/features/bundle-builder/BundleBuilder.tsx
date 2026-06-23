import { useEffect, useMemo } from 'react'
import bundleBuilderData from '../../data/bundle-builder'
import { useBundleBuilderStore } from '../../store/useBundleBuilderStore'
import type {
  BuilderProduct,
  VariantBuilderProduct,
} from '../../types/bundle-builder'
import { AccordionStep } from './components/AccordionStep'
import { BuilderHeader } from './components/BuilderHeader'
import { ReviewPanel } from './components/ReviewPanel'

export function BundleBuilder() {
  const activeStepId = useBundleBuilderStore((state) => state.activeStepId)
  const variantQuantities = useBundleBuilderStore(
    (state) => state.variantQuantities,
  )
  const productQuantities = useBundleBuilderStore(
    (state) => state.productQuantities,
  )
  const includedItemQuantities = useBundleBuilderStore(
    (state) => state.includedItemQuantities,
  )
  const openStep = useBundleBuilderStore((state) => state.openStep)
  const advanceToNextStep = useBundleBuilderStore(
    (state) => state.advanceToNextStep,
  )
  const restoreSavedConfiguration = useBundleBuilderStore(
    (state) => state.restoreSavedConfiguration,
  )

  useEffect(() => {
    restoreSavedConfiguration()
  }, [restoreSavedConfiguration])

  const productsById = useMemo(
    () =>
      new Map(
        bundleBuilderData.products.map((product) => [product.id, product]),
      ),
    [],
  )
  const includedItemsById = useMemo(
    () =>
      new Map(
        bundleBuilderData.includedReviewItems.map((item) => [item.id, item]),
      ),
    [],
  )

  return (
    <main className="min-h-screen bg-page px-0 py-[31px] text-text sm:px-6 md:px-8 xl:px-8 xl:py-[49px] 2xl:px-[122px]">
      <div className="mx-auto grid max-w-[1440px] gap-5 md:gap-7 xl:grid-cols-[minmax(0,768px)_399px] xl:items-start xl:justify-center xl:gap-[29px] 2xl:max-w-none 2xl:grid-cols-1 2xl:gap-[33px]">
        <section className="w-full min-w-0 max-w-[768px] justify-self-center space-y-[13px] xl:justify-self-end 2xl:max-w-none 2xl:justify-self-center">
          <div className="sm:hidden">
            <BuilderHeader />
          </div>
          <div className="space-y-0 sm:space-y-[13px]">
            {bundleBuilderData.steps.map((step) => {
              const stepProducts = getStepProducts(
                step.productIds,
                productsById,
              )
              const stepIncludedItems = step.includedItemIds.flatMap(
                (includedItemId) => {
                  const item = includedItemsById.get(includedItemId)
                  return item ? [item] : []
                },
              )

              return (
                <AccordionStep
                  includedItems={stepIncludedItems}
                  isOpen={activeStepId === step.id}
                  key={step.id}
                  onNext={step.nextButtonLabel ? advanceToNextStep : undefined}
                  onOpen={() => openStep(step.id)}
                  products={stepProducts}
                  selectedCount={getSelectedCountForStep({
                    includedItemIds: step.includedItemIds,
                    productIds: step.productIds,
                    productQuantities,
                    productsById,
                    variantQuantities,
                    includedItemQuantities,
                  })}
                  step={step}
                />
              )
            })}
          </div>
        </section>
        <ReviewPanel />
      </div>
    </main>
  )
}

function getStepProducts(
  productIds: string[],
  productsById: Map<string, BuilderProduct>,
) {
  return productIds.flatMap((productId) => {
    const product = productsById.get(productId)
    return product ? [product] : []
  })
}

function getSelectedCountForStep({
  includedItemIds,
  includedItemQuantities,
  productIds,
  productQuantities,
  productsById,
  variantQuantities,
}: {
  includedItemIds: string[]
  includedItemQuantities: Record<string, number>
  productIds: string[]
  productQuantities: Record<string, number>
  productsById: Map<string, BuilderProduct>
  variantQuantities: Record<string, Record<string, number>>
}) {
  const productCount = productIds.filter((productId) => {
    const product = productsById.get(productId)

    if (!product) {
      return false
    }

    if (isVariantProduct(product)) {
      return Object.values(variantQuantities[productId] ?? {}).some(
        (quantity) => quantity > 0,
      )
    }

    return (productQuantities[productId] ?? 0) > 0
  }).length

  const includedItemCount = includedItemIds.filter(
    (includedItemId) => (includedItemQuantities[includedItemId] ?? 0) > 0,
  ).length

  return productCount + includedItemCount
}

function isVariantProduct(
  product: BuilderProduct,
): product is VariantBuilderProduct {
  return Array.isArray(product.variants)
}
