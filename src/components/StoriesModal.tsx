'use client'
import '../styles/tailwind.css';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
    if (direction === 'next' && currentUserIndex < users?.length - 1) {
      const newIndex = currentUserIndex + 1
      setCurrentUserIndex(newIndex)
    } else if (direction === 'prev' && currentUserIndex > 0) {
      const newIndex = currentUserIndex - 1
      setCurrentUserIndex(newIndex)
    }
  }

  //TODO-now  handleUserChange should use handleStoryComplete
  const handleStoryComplete = () => {
    if (currentUserIndex < users.length - 1) {
      handleUserChange('next')
    } else {
      onClose()
    }
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 darkBg z-[9999] flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
      >
        {/* //TODO-V2  should be configurable for V2  */}
        <X />
      </button>

      <StoryViewer
        users={users}
        currentUserIndex={currentUserIndex}
        onNext={() => setCurrentUserIndex(i => (i < users.length - 1 ? i + 1 : i))}
        onPrev={() => setCurrentUserIndex(i => (i > 0 ? i - 1 : i))}
        onComplete={handleStoryComplete}
        onUserSelect={index => setCurrentUserIndex(index)}
      />

      {/* //INFO Navigation arrows for desktop to skip to next one for V2*/}
      {/* <div className="hidden md:block">
          {currentUserIndex > 0 && (
            <button
              onClick={() => handleUserChange('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {currentUserIndex < allUsers.length - 1 && (
            <button
              onClick={() => handleUserChange('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div> */}
      {/* </div> */}
    </section>
  )
}
