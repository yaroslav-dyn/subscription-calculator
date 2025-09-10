import { Link } from '@tanstack/react-router'
import { Calculator, Home } from 'lucide-react'

export default function Header() {
  return (
    <header className="mx-auto py-3 relative z-20">
      <nav className="flex flex-row text-white">
        <div className="px-2 font-bold">
          <Link className='opacity-50' activeProps={{ className: `opacity-100` }}  to="/">
            <Home  />
          </Link>
        </div>

        <div className="px-2 font-semibold uppercase">
          <Link className='opacity-60' activeProps={{ className: `opacity-100` }} to="/currency-rate">Currency rate</Link>
        </div>

        {/* <div className="px-2 font-bold">
          <Link to="/demo/store">Store</Link>
        </div> */}
      </nav>
      <div className="text-center mt-6">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
          <Link to="/">
            <Calculator className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </Link>
        </div>
      </div>
    </header>
  )
}
