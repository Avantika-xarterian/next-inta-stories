'use client'
import '../styles/globals.css'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { StoryUser } from '../types'
import StoryViewer from './StoryViewer'

interface StoriesModalProps {
  users: StoryUser[]
  initialIndex: number
  onClose: () => void
}

export default function StoriesModal({ users, onClose, initialIndex }: StoriesModalProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialIndex)

  // ✅ DEBUG LOGS
    console.log('🟢 v2')
  console.log('🟢 StoriesModal rendered')
  console.log('🧍 Users:', users)
  console.log('🎯 initialIndex:', initialIndex)
  console.log('📌 currentUserIndex:', currentUserIndex)
  console.log('🎥 Current user stories:', users?.[currentUserIndex]?.stories)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('🛑 Escape key pressed. Closing modal.')
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleUserChange = (direction: 'next' | 'prev') => {
    console.log(`↔ Switching user direction: ${direction}`)
    if (direction === 'next' && currentUserIndex < users.length - 1) {
      const newIndex = currentUserIndex + 1
      setCurrentUserIndex(newIndex)
    } else if (direction === 'prev' && currentUserIndex > 0) {
      const newIndex = currentUserIndex - 1
      setCurrentUserIndex(newIndex)
    }
  }

  const handleStoryComplete = () => {
    console.log('✅ Story complete')
    if (currentUserIndex < users.length - 1) {
      handleUserChange('next')
    } else {
      onClose()
    }
  }

  return (
    <div style={{backgroundColor: '#0F1011'}} className="fixed inset-0 bg-dark2 z-[9999] flex items-center justify-center">
      <div className="relative w-full h-full mx-auto">
        <button
          onClick={() => {
            console.log('❌ Close button clicked')
            onClose()
          }}
          className="absolute top-4 right-4 z-50 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
        >
          <X />
        </button>

        <StoryViewer
          users={users}
          currentUserIndex={currentUserIndex}
          onNext={() => {
            console.log('➡️ Next story clicked')
            setCurrentUserIndex(i => (i < users.length - 1 ? i + 1 : i))
          }}
          onPrev={() => {
            console.log('⬅️ Prev story clicked')
            setCurrentUserIndex(i => (i > 0 ? i - 1 : i))
          }}
          onComplete={handleStoryComplete}
          onUserSelect={index => {
            console.log('👆 User story selected', index)
            setCurrentUserIndex(index)
          }}
        />
      </div>
    </div>
  )
}
