import { Button, Icon, cn } from '../../../components/ui'
import type { BuilderProduct, BuilderStep } from '../../../types/bundle-builder'
import { ProductCard } from './ProductCard'
import { StepIcon } from './StepIcon'

type AccordionStepProps = {
  step: BuilderStep
  products: BuilderProduct[]
  isOpen: boolean
  selectedCount: number
  onOpen: () => void
  onNext?: () => void
}

export function AccordionStep({
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

  return (
    <article className="overflow-hidden rounded-none bg-surface sm:rounded-card sm:border sm:border-border-soft">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className={cn(
          'w-full text-left transition-colors hover:bg-primary-soft/60 focus-visible:outline-none',
          isOpen && 'bg-surface-tinted/70',
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
        <span className="hidden min-h-16 items-center gap-3 px-4 py-3 sm:flex sm:px-5">
          <StepIcon stepId={step.id} />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold tracking-[0.18em] text-text-muted">
              {step.eyebrow}
            </span>
            <span className="mt-1 block text-lg font-semibold leading-none tracking-[0.03em] text-text">
              {step.title}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-primary">
            {isOpen ? `${selectedCount} selected` : null}
            <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} />
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          aria-labelledby={headerId}
          className="bg-surface-tinted/70 px-3 py-4 sm:border-t sm:border-border-soft sm:px-5 sm:py-5"
          id={panelId}
          role="region"
        >
          <div className="-mx-3 -mt-4 mb-4 border-t border-border-soft sm:hidden" />
          {products.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-[13px] md:grid-cols-[repeat(3,224.6px)] md:justify-center">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="rounded-card border border-dashed border-border bg-surface px-4 py-5 text-sm leading-6 text-text-muted">
              This step is pre-populated in the initial system and will be
              managed from the review panel.
            </p>
          )}

          {step.nextButtonLabel && onNext ? (
            <div className="mt-5 flex justify-end">
              <Button
                className="w-full sm:w-auto"
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
