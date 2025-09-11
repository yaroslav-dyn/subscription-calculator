import { createRoute, RootRoute } from '@tanstack/react-router'
import SubscriptionCalculator from './SubscriptionCalculator'

export default (parentRoute: RootRoute) =>
  createRoute({
    path: '/',
    component: SubscriptionCalculator,
    getParentRoute: () => parentRoute
  })
