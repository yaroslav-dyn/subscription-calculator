import { Link } from '@tanstack/react-router'
import { Currency, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="mx-auto py-3 sticky top-0 z-20">
      {/* Mobile menu button */}
      <div className="md:hidden px-2">
        <button onClick={() => setIsMenuOpen(true)} className="text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Side Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-purple-900 bg-opacity-90 backdrop-blur-sm text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsMenuOpen(false)} className="text-white">
            <X size={28} />
          </button>
        </div>
        <nav className="flex flex-col space-y-4 p-4">
          <Link
            className="opacity-60 flex items-center space-x-2"
            activeProps={{ className: `opacity-100` }}
            to="/"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="text-white w-6 h-6" />
            <span>Home</span>
          </Link>
          <Link
            className="opacity-60 flex items-center space-x-2"
            activeProps={{ className: `opacity-100` }}
            to="/currency-rate"
            onClick={() => setIsMenuOpen(false)}
          >
            <Currency className="text-white w-6 h-6" />
          <span>  Currency rate</span>
          </Link>
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Desktop nav */}
      <nav className="hidden md:flex flex-row text-white">
        <div className="px-2 font-bold">
          <Link className="opacity-50" activeProps={{ className: `opacity-100` }} to="/">
            <Home />
          </Link>
        </div>

        <div className="px-2 font-semibold uppercase">
          <Link className="opacity-60" activeProps={{ className: `opacity-100` }} to="/currency-rate">
            Currency rate
          </Link>
        </div>
      </nav>


    </header>
  )
}
