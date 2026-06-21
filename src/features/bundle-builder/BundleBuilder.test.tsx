// @vitest-environment jsdom
// @vitest-environment-options {"url":"http://localhost"}

import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useBundleBuilderStore } from '../../store/useBundleBuilderStore'
import { BundleBuilder } from './BundleBuilder'

describe('BundleBuilder included selections', () => {
  beforeEach(() => {
    useBundleBuilderStore.getState().resetToInitialState()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the selected plan in its step with locked quantity controls', () => {
    const { container } = render(<BundleBuilder />)
    const planHeader = getRequiredElement<HTMLButtonElement>(
      container,
      '#bundle-step-header-plan',
    )

    fireEvent.click(planHeader)

    const planPanel = getRequiredElement<HTMLElement>(
      container,
      '#bundle-step-panel-plan',
    )

    expect(
      within(planPanel).getByRole('heading', { name: 'Cam Unlimited' }),
    ).toBeInTheDocument()
    expect(
      within(planPanel).getByRole('button', {
        name: 'Decrease Cam Unlimited quantity',
      }),
    ).toBeDisabled()
    expect(planHeader).toHaveTextContent('1 selected')
  })

  it('keeps the hub required while allowing the motion sensor to be removed and re-added', () => {
    const { container } = render(<BundleBuilder />)
    const sensorsHeader = getRequiredElement<HTMLButtonElement>(
      container,
      '#bundle-step-header-sensors',
    )

    fireEvent.click(sensorsHeader)

    const sensorsPanel = getRequiredElement<HTMLElement>(
      container,
      '#bundle-step-panel-sensors',
    )
    const motionSensorCard = within(sensorsPanel)
      .getByRole('heading', { name: 'Wyze Sense Motion Sensor' })
      .closest('article')
    const hubCard = within(sensorsPanel)
      .getByRole('heading', { name: 'Wyze Sense Hub (Required)' })
      .closest('article')

    expect(motionSensorCard).not.toBeNull()
    expect(hubCard).not.toBeNull()

    const motionSensorControls = within(motionSensorCard as HTMLElement)
    const quantityOutput = motionSensorControls.getByText('2', {
      selector: 'output',
    })
    const decreaseMotionSensor = motionSensorControls.getByRole('button', {
      name: 'Decrease Wyze Sense Motion Sensor quantity',
    })

    fireEvent.click(decreaseMotionSensor)
    fireEvent.click(decreaseMotionSensor)

    expect(quantityOutput).toHaveTextContent('0')
    expect(sensorsHeader).toHaveTextContent('1 selected')

    fireEvent.click(
      motionSensorControls.getByRole('button', {
        name: 'Increase Wyze Sense Motion Sensor quantity',
      }),
    )

    expect(quantityOutput).toHaveTextContent('1')
    expect(sensorsHeader).toHaveTextContent('2 selected')
    expect(
      within(hubCard as HTMLElement).getByRole('button', {
        name: 'Decrease Wyze Sense Hub quantity',
      }),
    ).toBeDisabled()
  })

  it('places the optional MicroSD card in extra protection and supports re-adding it', () => {
    const { container } = render(<BundleBuilder />)
    const protectionHeader = getRequiredElement<HTMLButtonElement>(
      container,
      '#bundle-step-header-extra-protection',
    )

    fireEvent.click(protectionHeader)

    const protectionPanel = getRequiredElement<HTMLElement>(
      container,
      '#bundle-step-panel-extra-protection',
    )
    const accessoryCard = within(protectionPanel)
      .getByRole('heading', { name: 'Wyze MicroSD Card (256GB)' })
      .closest('article')

    expect(accessoryCard).not.toBeNull()

    const accessoryControls = within(accessoryCard as HTMLElement)
    const quantityOutput = accessoryControls.getByText('2', {
      selector: 'output',
    })
    const decreaseAccessory = accessoryControls.getByRole('button', {
      name: 'Decrease Wyze MicroSD Card (256GB) quantity',
    })

    fireEvent.click(decreaseAccessory)
    fireEvent.click(decreaseAccessory)

    expect(quantityOutput).toHaveTextContent('0')
    expect(protectionHeader).toHaveTextContent('0 selected')

    fireEvent.click(
      accessoryControls.getByRole('button', {
        name: 'Increase Wyze MicroSD Card (256GB) quantity',
      }),
    )

    expect(quantityOutput).toHaveTextContent('1')
    expect(protectionHeader).toHaveTextContent('1 selected')
  })
})

function getRequiredElement<ElementType extends Element>(
  container: HTMLElement,
  selector: string,
) {
  const element = container.querySelector<ElementType>(selector)

  if (!element) {
    throw new Error(`Expected element matching "${selector}"`)
  }

  return element
}
