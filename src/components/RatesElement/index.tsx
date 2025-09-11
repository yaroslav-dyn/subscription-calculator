import { createRoute, RootRoute } from '@tanstack/react-router'
import RatesElement from './RatesElement'

export default (parentRoute: RootRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/currency-rate',
    component: () => <RatesElement classes='p-4' hidePanelHeading={true} isPage={true} />
  })
