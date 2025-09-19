import { createRoute, RootRoute } from '@tanstack/react-router'
import SubscriptionCalculator from './SubscriptionCalculator'
import Auth from '../Auth'


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
