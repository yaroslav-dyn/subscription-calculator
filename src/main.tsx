import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRouter,
} from '@tanstack/react-router'

// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from './components/Header'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'
import SubscriptionCalculator from './components/SubscriptionCalculator'
import CurrencyRate from './components/RatesElement'
import SubscriptionRate from './routes/SubscriptionRate'
import NotFound from './components/404'
import Footer from './components/Footer.tsx'
import NotificationDrawer from './components/NotificationDrawer'

const rootRoute = createRootRoute({
  component: () => (
    <main className="base__page-bg min-h-screen">
      <Header />
      <Outlet />
      <Footer />
      <NotificationDrawer />
      {/* <TanStackRouterDevtools /> */}
    </main>
  ),
  notFoundComponent: () => <NotFound />,
})


const routeTree = rootRoute.addChildren([
  SubscriptionCalculator(rootRoute),
  CurrencyRate(rootRoute),
  SubscriptionRate(rootRoute)
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
reportWebVitals(console.log)
