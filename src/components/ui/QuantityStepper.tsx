import { Icon } from './Icon'
import { cn } from './cn'

export type QuantityStepperProps = {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  min?: number
  max?: number
  disabled?: boolean
  decreaseLabel?: string
  increaseLabel?: string
  label?: string
  className?: string
}

export function QuantityStepper({
  className,
  decreaseLabel = 'Decrease quantity',
  disabled = false,
  increaseLabel = 'Increase quantity',
  label = 'Quantity',
  max,
  min = 0,
  onDecrease,
  onIncrease,
  value,
}: QuantityStepperProps) {
  const canDecrease = !disabled && value > min
  const canIncrease = !disabled && (typeof max !== 'number' || value < max)

  return (
    <div
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-1 rounded-control border border-border bg-surface px-1 text-text',
        disabled && 'opacity-50',
        className,
      )}
      role="group"
    >
      <StepperButton
        ariaLabel={decreaseLabel}
        disabled={!canDecrease}
        iconName="minus"
        onClick={onDecrease}
      />
      <output
        aria-atomic="true"
        aria-live="polite"
        className="min-w-6 text-center text-sm font-semibold tabular-nums"
      >
        {value}
      </output>
      <StepperButton
        ariaLabel={increaseLabel}
        disabled={!canIncrease}
        iconName="plus"
        onClick={onIncrease}
      />
    </div>
  )
}

type StepperButtonProps = {
  ariaLabel: string
  disabled: boolean
  iconName: 'minus' | 'plus'
  onClick: () => void
}

function StepperButton({
  ariaLabel,
  disabled,
  iconName,
  onClick,
}: StepperButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-control text-text transition-colors hover:bg-primary-soft active:bg-primary-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled disabled:hover:bg-transparent"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="flex h-[26px] w-[26px] items-center justify-center rounded-control border border-border bg-surface">
        <Icon name={iconName} size={16} />
      </span>
    </button>
  )
}
