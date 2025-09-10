import { Link } from '@tanstack/react-router'
import { Calculator } from 'lucide-react'

export default function Header() {
  return (
    <header className="mx-auto pt-12">
      {/* <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/tanstack-query">TanStack Query</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/store">Store</Link>
        </div>
      </nav> */}
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
          <Link to="/">
            <Calculator className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </Link>
        </div>
      </div>
    </header>
  )
}
