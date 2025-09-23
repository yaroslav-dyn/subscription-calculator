import React from 'react'
import { version } from '../../package.json'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="text-center text-sm text-gray-500 py-4 border-t border-gray-300 mt-8">
      <small className="text-sm">
        {' '}
        &copy; {currentYear} Subscription Calculator. {version}v
      </small>
    </footer>
  )
}

export default Footer
