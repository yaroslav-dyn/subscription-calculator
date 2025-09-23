import { createRoute } from '@tanstack/react-router'
import Auth from '../Auth'
import SubscriptionCalculator from './SubscriptionCalculator'
import type { RootRoute } from '@tanstack/react-router';

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/',
    component: () => (
      <Auth>
        <SubscriptionCalculator />
      </Auth>
    ),
    getParentRoute: () => parentRoute,
  })
