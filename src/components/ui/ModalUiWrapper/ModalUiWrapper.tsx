import type { ReactNode } from 'react'

interface IModalUiWrapper {
  isOpen: boolean
  children: ReactNode
  modalClasses?: string
}

const ModalUiWrapper = ({ isOpen, children, modalClasses='' }: IModalUiWrapper) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className={`ModalUiWrapper-component fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50`}>
      <div className={`bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl w-full max-w-md ${modalClasses}`}>
        {children}
      </div>
    </div>
  )
}

export default ModalUiWrapper
