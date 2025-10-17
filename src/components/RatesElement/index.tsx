import { createRoute } from '@tanstack/react-router'
import RatesElement from './RatesElement'
import type { RootRoute } from '@tanstack/react-router';
import Auth from '@/components/Auth';

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/currency-rate',
    component: () => (
      <Auth>
        <RatesElement classes="p-4" hidePanelHeading={true} isPage={true} />
      </Auth>
    ),
  })
