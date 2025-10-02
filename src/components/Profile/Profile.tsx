import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Preloader from '@/components/ui/Preloader'
import { setNotification } from '@/store/notificationStore'
import { useLogout, useUser } from '@/lib/utils/auth.utils'
import { UserRoundCog, X } from 'lucide-react'
import RemoveProofelement from '@/components/RemoveProofElement'


const Profile = ({ onClose }: { onClose: () => void }) => {
  const { data: user } = useUser()

  const [loading, setLoading] = useState(false)
  const proofElementRef = useRef<{ data: any; title: string } | null>(null)
  const [isRemoveProofOpen, setIsRemoveProofOpen] = useState(false)

  const removeProof = <T,>(params: { data: T; title: string }) => {
    proofElementRef.current = { data: params.data, title: params.title }
    setIsRemoveProofOpen(true)
  }

  const handleProofDelete = () => {
    handleDeleteAccount()
    setIsRemoveProofOpen(false)
    proofElementRef.current = null
  }

  const handleProofClose = () => {
    setIsRemoveProofOpen(false)
    proofElementRef.current = null
  }

  const handleLogout = async () => {
    setLoading(true)
    const result = await useLogout()
    result && setLoading(false)
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error
      await supabase.auth.signOut()
    } catch (error: any) {
      setNotification({
        type: 'ERROR',
        status: true,
        message: error.error_description || error.message,
        countdown: 6,
      })
    }
  }

  console.log("🚀 ~ Profile ~ user:", user)

  return (
    <div
      className="absolute top-16 right-auto md:right-0  bg-black/50 backdrop-blur-sm rounded-lg flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl text-white w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-x-2'>
            <UserRoundCog />
            <h2 className="text-2xl font-bold">Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user && (
          <>
            <div className="space-y-4">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Provider:</strong> {user.app_metadata.provider}
              </p>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-500/80 rounded-xl text-white hover:bg-gray-500 transition-colors cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={() => removeProof({ data: null, title: 'You really want to delete account' })}
                className="px-4 py-2 bg-red-500/80 rounded-xl text-white hover:bg-red-500 transition-colors cursor-pointer"
              >
                Delete Account
              </button>
            </div>

            <RemoveProofelement
              modalClasses='bg-white/40'
              isOpen={isRemoveProofOpen}
              title={proofElementRef.current?.title || ''}
              onProofDelete={handleProofDelete}
              onClose={handleProofClose}
            />

          </>
        )}

        {!user && (
          <h3 text-2xl font-bold mb-4>User not found</h3>
        )}

        {loading && <Preloader loading={loading} />}

      </div>
    </div>
  )
}

export default Profile
