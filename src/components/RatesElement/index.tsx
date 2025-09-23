import { createRoute } from '@tanstack/react-router'
import RatesElement from './RatesElement'
import type { RootRoute } from '@tanstack/react-router';

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/currency-rate',
    component: () => (
      <RatesElement classes="p-4" hidePanelHeading={true} isPage={true} />
    ),
  })
