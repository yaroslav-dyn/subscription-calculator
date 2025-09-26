import { X } from 'lucide-react'
import ModalUiWrapper from '@/components/ui/ModalUiWrapper'

interface IRemoveProofElement {
  isOpen: boolean
  title: string
  onProofDelete: () => void
  onClose: () => void
}

const RemoveProofelement = ({
  isOpen,
  title,
  onProofDelete,
  onClose,
}: IRemoveProofElement) => {
  if (!isOpen) return

  return (
    <ModalUiWrapper isOpen={isOpen}>
      <div className="RemoveProofElement-component">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-lg">
            {title || 'You realy want to delete'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded-xl text-white/80 hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onProofDelete}
            className="px-4 py-2 bg-red-500/80 rounded-xl text-white hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalUiWrapper>

  )
}

export default RemoveProofelement
