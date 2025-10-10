import { createRoute } from '@tanstack/react-router'
import SubscriptionRate from './SubscriptionRate'
import type { RootRoute } from '@tanstack/react-router';

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/subscription-rate',
    component: () => (
      <SubscriptionRate classes="p-4 min-h-screen" hidePanelHeading={true} isPage={true} />
    ),
  })
