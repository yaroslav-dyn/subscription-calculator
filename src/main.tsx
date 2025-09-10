import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryDemo from './routes/demo.tanstack-query.tsx'
import StoreDemo from './routes/demo.store.tsx'
import Header from './components/Header'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import App from './App.tsx'
import SubscriptionCalculator from './components/SubscriptionCalculator'
import CurrencyRate from './components/RatesElement'
import NotFound from './components/404'

const rootRoute = createRootRoute({
  component: () => (
    <main className="base__page-bg min-h-screen">
      <Header />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </main>
  ),
  notFoundComponent: () => <NotFound />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/demo',
  component: App,
})

const CalculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SubscriptionCalculator,
})

const CurrencyRateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/currency-rate',
  component: () => <CurrencyRate hidePanelHeading={true} isPage={true} />,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  CalculatorRoute,
  CurrencyRateRoute,
  TanStackQueryDemo(rootRoute),
  StoreDemo(rootRoute),
])

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
