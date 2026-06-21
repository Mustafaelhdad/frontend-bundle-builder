import { Icon } from '../../../components/ui'
import type { IconName } from '../../../components/ui'
import type { StepId } from '../../../types/bundle-builder'

type StepIconProps = {
  stepId: StepId
}

export function StepIcon({ stepId }: StepIconProps) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-icon-muted sm:h-11 sm:w-10 xl:h-5 xl:w-5 2xl:h-[31px] 2xl:w-[30px]">
      <Icon
        className="h-5 w-5 sm:h-7 sm:w-7 xl:h-5 xl:w-5 2xl:h-[30px] 2xl:w-[30px]"
        name={stepIconNameById[stepId]}
        size={28}
      />
    </span>
  )
}

const stepIconNameById = {
  cameras: 'security-camera-step',
  plan: 'plan-step',
  sensors: 'sensor-step',
  'extra-protection': 'extra-protection-step',
} as const satisfies Record<StepId, IconName>
