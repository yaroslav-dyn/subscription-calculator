import { supabase } from '@/lib/supabaseClient'
import { settingsStore, updateSettingsPanelStatus } from '@/store/settingsStore'
// import { subscriptionStore, updateSettingsPanelStatus, updateShowDomainStatus, updateShowRatesStatus } from '@/store/subscriptionStore'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Currency, Home, Menu, X, LogOut, Target, Banknote, Globe, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useUser } from '@/lib/utils'

export default function Header() {
  const { data: user } = useUser()
  console.log("🚀 ~ Header ~ user:", user)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="mx-auto p-4 sticky top-0 z-20">
      {user && (
        <>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="text-white">
              <Menu size={28} />
            </button>
          </div>

          {/*SECTION: Mobile Nav */}
          <div
            className={`fixed top-0 left-0 h-full w-[80vw] bg-purple-900 bg-opacity-90 backdrop-blur-sm text-white transform transition-transform duration-300 ease-in-out z-40 min-full ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <div className='flex flex-col justify-between min-h-full'>
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/80 rounded-xl text-white hover:bg-red-500 transition-colors z-50"
                >
                  <LogOut />

                </button>
                <button onClick={() => setIsMenuOpen(false)} className="text-white">
                  <X size={28} />
                </button>
              </div>

              <nav className="flex-1 flex flex-col space-y-4 p-4">
                <Link
                  className="opacity-50 flex items-center space-x-2"
                  activeProps={{ className: `opacity-100` }}
                  activeOptions={{ exact: true }}
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="text-white w-6 h-6" />
                  <span>Home</span>
                </Link>
                <Link
                  className="opacity-50 flex items-center"
                  activeProps={{ className: `opacity-100` }}
                  activeOptions={{ exact: true }}
                  to="/currency-rate"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Currency className="text-white w-6 h-6" />
                  <span> Currency rate</span>
                </Link>
              </nav>

              <PanelsStatus classes="mb-4 justify-around" />
            </div>

          </div>

          {/* Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          )}

          {/*SECTION Desktop nav */}
          <nav className="hidden md:flex flex-row items-center justify-between text-white">

            <div className='flex items-center gap-x-4'>
              <div className="font-semibold">
                <Link className="block opacity-50" activeProps={{ className: `opacity-100` }} to="/">
                  <Home />
                </Link>
              </div>

              <div className="font-semibold uppercase">
                <Link className="block opacity-60" activeProps={{ className: `opacity-100` }} to="/currency-rate">
                  Currency rate
                </Link>
              </div>

            </div>

            <div className='flex items-center gap-x-6'>

              <PanelsStatus />

              <button
                onClick={handleLogout}
                className="px-2 py-1 bg-red-500/80 rounded-xl text-white hover:bg-red-500 transition-colors z-50 cursor-pointer"
              >
                <LogOut />
              </button>

            </div>

          </nav>

        </>
      )}
    </header>
  )
}

const PanelsStatus = ({ classes = '' }: { classes?: string }) => {

  const { settings, rates, domains, summary } = useStore(settingsStore, (state) => (state))

  return (
    <div className={`flex flex-row md:flex-row items-center gap-4 md:gap-4 ${classes}`}>
      <Target size={30} onClick={() => updateSettingsPanelStatus('settings', !settings)} opacity={!settings ? '0.5' : '1'} className="text-white cursor-pointer hover:opacity-100" />

      <Banknote size={34} onClick={() => updateSettingsPanelStatus('rates', !rates)} opacity={!rates ? '0.5' : '1'} className="text-white cursor-pointer hover:opacity-100" />

      <Globe size={26} onClick={() => updateSettingsPanelStatus('domains', !domains)} opacity={!domains ? '0.5' : '1'} className="text-white cursor-pointer hover:opacity-100" />

      <TrendingUp size={26} onClick={() => updateSettingsPanelStatus('summary', !summary)} opacity={!summary ? '0.5' : '1'} className="text-white cursor-pointer hover:opacity-100" />

    </div>
  );
}
