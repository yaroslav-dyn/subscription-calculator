import { describe, expect, test, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Auth from './components/Auth'
import SubscriptionCalculator from '@/components/SubscriptionCalculator/SubscriptionCalculator'
import { supabase } from './lib/supabaseClient'

// Mock the supabase client
vi.mock('./lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}))

describe('App', () => {
  
  test('renders', () => {
    render(
      <Auth>
        <SubscriptionCalculator />
      </Auth>,
    )
    expect(screen.getByText('Subscription Cost Calculator')).toBeDefined()
  })

  test('user can sign up', async () => {
    // @ts-expect-error: mock implementation
    supabase.auth.signUp.mockResolvedValueOnce({ error: null })

    render(
      <Auth>
        <SubscriptionCalculator />
      </Auth>,
    )

    // Wait for the component to finish loading and the "Sign In" button to be present
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeDefined()
    })

    // Switch to sign up form
    fireEvent.click(screen.getByText("Don't have an account? Sign Up"))

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your password'), {
      target: { value: 'password123' },
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }))

    // Wait for the async actions to complete
    await waitFor(() => {
      // Check if signUp was called correctly
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    // After successful sign up, the form should switch to the sign in view
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeDefined()
    })
  })

  test('user can sign in', async () => {
    // @ts-expect-error: mock implementation
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ error: null })

    render(
      <Auth>
        <SubscriptionCalculator />
      </Auth>,
    )

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeDefined()
    })

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Your email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Your password'), {
      target: { value: 'password123' },
    })

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }))

    // Wait for the async actions to complete
    await waitFor(() => {
      // Check if signInWithPassword was called correctly
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

})//