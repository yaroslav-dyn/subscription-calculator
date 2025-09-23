import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Auth from './components/Auth'
import SubscriptionCalculator from '@/components/SubscriptionCalculator/SubscriptionCalculator'

describe('App', () => {
  test('renders', () => {
    render(
      <Auth>
        <SubscriptionCalculator />
      </Auth>,
    )
    expect(screen.getByText('Subscription Cost Calculator')).toBeDefined()
  })
})
