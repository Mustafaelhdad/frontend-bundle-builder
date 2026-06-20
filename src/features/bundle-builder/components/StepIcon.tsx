import { Icon } from '../../../components/ui'
import type { IconName } from '../../../components/ui'
import type { StepId } from '../../../types/bundle-builder'

type StepIconProps = {
  stepId: StepId
}

export function StepIcon({ stepId }: StepIconProps) {
  return (
    <span className="flex h-11 w-10 shrink-0 items-center justify-center text-icon-muted">
      <Icon name={stepIconNameById[stepId]} size={28} />
    </span>
  )
}

const stepIconNameById = {
  cameras: 'security-camera-step',
  plan: 'plan-step',
  sensors: 'sensor-step',
  'extra-protection': 'extra-protection-step',
} as const satisfies Record<StepId, IconName>
