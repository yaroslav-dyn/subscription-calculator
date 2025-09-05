import { Link } from '@tanstack/react-router'
import { Calculator } from 'lucide-react'

export default function Header() {
  return (
    <header className="mx-auto py-4">
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
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
          <Link to="/">
            <Calculator className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </Link>
        </div>
      </div>
    </header>
  )
}
