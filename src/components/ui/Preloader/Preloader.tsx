import React from 'react'
import './preloader.css'

interface PreloaderProps {
  loading: boolean
  classes?: string
}

const Preloader: React.FC<PreloaderProps> = ({ loading, classes }) => {
  if (!loading) {
    return null
  }

  return (
    <div className={`preloader-container items-center ${classes}`}>
      <div className="preloader">
        <div className="preloader-dot"></div>
        <div className="preloader-dot"></div>
        <div className="preloader-dot"></div>
      </div>
    </div>
  )
}

export default Preloader
