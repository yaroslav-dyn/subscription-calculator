import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import SubscriptionCalculator from '@/components/SubscriptionCalculator/SubscriptionCalculator'
import Auth from './components/Auth'

describe('App', () => {

  test('renders', () => {
    render(<Auth>
      <SubscriptionCalculator />
    </Auth>)
    expect(screen.getByText('Subscription Cost Calculator')).toBeDefined()
  })

})
