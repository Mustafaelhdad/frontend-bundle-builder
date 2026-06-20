import type { SVGAttributes } from 'react'
import { cn } from './cn'

export type IconName =
  | 'camera'
  | 'check'
  | 'chevron-down'
  | 'chevron-up'
  | 'minus'
  | 'plus'
  | 'shield'
  | 'truck'

export type IconProps = SVGAttributes<SVGSVGElement> & {
  name: IconName
  decorative?: boolean
  label?: string
  size?: number
}

export function Icon({
  className,
  decorative = true,
  label,
  name,
  size = 20,
  ...props
}: IconProps) {
  const accessibleProps =
    decorative || !label
      ? { 'aria-hidden': true, role: undefined }
      : { 'aria-label': label, role: 'img' }

  return (
    <svg
      className={cn('shrink-0', className)}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...accessibleProps}
      {...props}
    >
      {iconPaths[name]}
    </svg>
  )
}

const iconPaths: Record<IconName, React.ReactNode> = {
  camera: (
    <>
      <path
        d="M4.75 7.75A2.75 2.75 0 0 1 7.5 5h9A2.75 2.75 0 0 1 19.25 7.75v8.5A2.75 2.75 0 0 1 16.5 19h-9a2.75 2.75 0 0 1-2.75-2.75v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16.75 8.25h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.2"
      />
    </>
  ),
  check: (
    <path
      d="m5 12.5 4.25 4L19 7"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  ),
  'chevron-down': (
    <path
      d="m6 9 6 6 6-6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  ),
  'chevron-up': (
    <path
      d="m6 15 6-6 6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  ),
  minus: (
    <path
      d="M6 12h12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  ),
  plus: (
    <path
      d="M12 6v12M6 12h12"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    />
  ),
  shield: (
    <path
      d="M12 3.75 5.75 6v5.25c0 4.1 2.62 7.72 6.25 9 3.63-1.28 6.25-4.9 6.25-9V6L12 3.75Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  ),
  truck: (
    <>
      <path
        d="M3.75 7.25h10.5v8.5H3.75v-8.5ZM14.25 10h3.35l2.65 2.7v3.05h-6v-5.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M7 18.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM17 18.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </>
  ),
}
