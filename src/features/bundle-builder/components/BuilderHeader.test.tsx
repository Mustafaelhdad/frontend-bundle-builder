import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BuilderHeader } from './BuilderHeader'

describe('BuilderHeader', () => {
  it('renders the mobile and desktop bundle-builder headlines', () => {
    const markup = renderToStaticMarkup(<BuilderHeader />)

    expect(markup).toContain('Bundle Builder')
    expect(markup).toMatch(/Let(?:'|&#x27;)s get started!/)
    expect(markup).toContain('Build your home security system')
    expect(markup).toContain(
      'Choose your cameras, plan, sensors, and extra protection.',
    )
  })
})
