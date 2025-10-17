import { createRoute } from '@tanstack/react-router'
import SubscriptionRate from './SubscriptionRate'
import type { RootRoute } from '@tanstack/react-router';
import Auth from '@/components/Auth'

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/subscription-rate',
    component: () => (
      <Auth>
        <SubscriptionRate classes="p-4 min-h-screen" hidePanelHeading={true} isPage={true} />
      </Auth>
    ),
  })
