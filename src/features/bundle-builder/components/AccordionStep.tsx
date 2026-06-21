import { Button, Icon, cn } from '../../../components/ui'
import type {
  BuilderProduct,
  BuilderStep,
  IncludedReviewItem,
} from '../../../types/bundle-builder'
import { IncludedItemCard } from './IncludedItemCard'
import { ProductCard } from './ProductCard'
import { StepIcon } from './StepIcon'

type AccordionStepProps = {
  step: BuilderStep
  products: BuilderProduct[]
  includedItems: IncludedReviewItem[]
  isOpen: boolean
  selectedCount: number
  onOpen: () => void
  onNext?: () => void
}

export function AccordionStep({
  includedItems,
  isOpen,
  onNext,
  onOpen,
  products,
  selectedCount,
  step,
}: AccordionStepProps) {
  const panelId = `bundle-step-panel-${step.id}`
  const headerId = `bundle-step-header-${step.id}`
  const arrowIcon = isOpen ? 'step-arrow-up' : 'step-arrow-down'
  const cardCount = products.length + includedItems.length

  return (
    <article
      className={cn(
        'overflow-hidden rounded-none bg-surface sm:border sm:border-border-soft 2xl:border-0',
        isOpen &&
          '2xl:rounded-[10px] 2xl:border-0 2xl:bg-surface-tinted 2xl:pt-[15px]',
      )}
    >
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={cn(
          'w-full text-left transition-colors hover:bg-primary-soft/60 focus-visible:outline-none 2xl:block 2xl:hover:bg-transparent',
          isOpen && 'bg-surface-tinted/70',
          isOpen && '2xl:bg-transparent',
        )}
        id={headerId}
        onClick={onOpen}
        type="button"
      >
        <span className="block sm:hidden">
          <span
            className={cn(
              'block border-b border-border px-5 py-2 text-[10px] font-medium uppercase leading-none tracking-[1.6px] text-[#484848]',
              step.order > 1 && 'border-t',
            )}
          >
            {step.eyebrow}
          </span>
          <span className="flex min-h-[74px] items-center gap-3 px-5 py-4">
            <StepIcon stepId={step.id} />
            <span className="min-w-0 flex-1 text-lg font-semibold leading-none tracking-normal text-[#0b0d10]">
              {step.title}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-center text-sm font-medium leading-4 text-primary">
              {selectedCount} selected
              <Icon name={arrowIcon} size={12} />
            </span>
          </span>
        </span>
        <span className="hidden sm:block 2xl:hidden">
          <span className="flex min-h-16 items-center gap-3 px-4 py-3 sm:px-5 xl:min-h-12 xl:px-3 xl:py-2">
            <StepIcon stepId={step.id} />
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold tracking-[0.18em] text-text-muted xl:text-[9px]">
                {step.eyebrow}
              </span>
              <span className="mt-1 block text-lg font-semibold leading-none tracking-[0.03em] text-text xl:text-base xl:tracking-normal">
                {step.title}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-primary xl:text-xs">
              {isOpen ? `${selectedCount} selected` : null}
              <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} />
            </span>
          </span>
        </span>
        <span
          className={cn(
            'hidden 2xl:block',
            !isOpen && '2xl:flex 2xl:flex-col 2xl:gap-[5px]',
          )}
        >
          <span
            className={cn(
              'block text-[12px] font-medium uppercase tracking-[1.6px] text-[#484848]',
              isOpen
                ? 'border-b border-border px-3 pb-1 leading-none'
                : 'h-3 px-[15px] leading-3',
            )}
          >
            {step.eyebrow}
          </span>
          <span
            className={cn(
              'flex items-center',
              isOpen
                ? 'min-h-[30px] gap-2 px-3 py-2'
                : 'h-[71px] gap-2 border-y-[0.5px] border-[#1F1F1F] px-[15px] py-5',
            )}
          >
            <StepIcon stepId={step.id} />
            <span className="min-w-0 flex-1 text-[28px] font-semibold leading-none tracking-normal text-[#0B0D10]">
              {step.title}
            </span>
            <span className="flex h-4 shrink-0 items-center gap-1 text-center text-[14px] font-normal leading-4 text-[#4E2FD2]">
              {isOpen ? `${selectedCount} selected` : null}
              <Icon name={arrowIcon} size={12} />
            </span>
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          aria-labelledby={headerId}
          className="bg-surface-tinted/70 px-3 py-4 sm:border-t sm:border-border-soft sm:px-5 sm:py-5 xl:px-[10px] xl:py-[10px] 2xl:border-t-0 2xl:px-[11px] 2xl:pb-[15px]"
          id={panelId}
          role="region"
        >
          <div className="-mx-3 -mt-4 mb-4 border-t border-border-soft sm:hidden" />
          {cardCount > 0 ? (
            <div
              className={cn(
                'grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-[13px]',
                cardCount >= 5
                  ? 'xl:grid-cols-5 xl:gap-[8px] 2xl:grid-cols-[repeat(5,224.6px)] 2xl:justify-center 2xl:gap-[17px]'
                  : 'sm:grid-cols-[repeat(auto-fit,224.6px)] sm:justify-center xl:grid-cols-[repeat(auto-fit,224.6px)] xl:justify-center xl:gap-[8px] 2xl:grid-cols-[repeat(auto-fit,224.6px)] 2xl:justify-center 2xl:gap-[17px]',
              )}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {includedItems.map((item) => (
                <IncludedItemCard item={item} key={item.id} />
              ))}
            </div>
          ) : (
            <p className="rounded-card border border-dashed border-border bg-surface px-4 py-5 text-sm leading-6 text-text-muted">
              This step is pre-populated in the initial system and will be
              managed from the review panel.
            </p>
          )}

          {step.nextButtonLabel && onNext ? (
            <div className="mt-[10px] flex justify-center">
              <Button
                className="w-full rounded-[6px] sm:w-auto xl:min-h-8 xl:px-8 xl:py-1 xl:text-xs 2xl:h-[39px] 2xl:min-h-[39px] 2xl:w-auto 2xl:min-w-[266px] 2xl:max-w-full 2xl:whitespace-nowrap 2xl:rounded-[7px] 2xl:border-[#4E2FD2] 2xl:px-6 2xl:py-[5px] 2xl:text-[18px] 2xl:leading-6 2xl:tracking-normal 2xl:text-[#4E2FD2]"
                onClick={onNext}
                variant="outline"
              >
                {step.nextButtonLabel}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
