import React from 'react'
import { version } from '../../package.json'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    //border-t border-gray-300 
    <footer className="bg-white/10  shadow-xl text-center text-sm text-gray-300 py-4 t-8">
      <small className="text-sm">
        {' '}
        &copy; {currentYear} Subscription Calculator. {version}v
      </small>
    </footer>
  )
}

export default Footer
