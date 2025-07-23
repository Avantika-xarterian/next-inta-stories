'use client'

import { motion } from 'framer-motion'
import { StoryUser } from '../types'
import ActiveUserStoryViewer from './ActiveUserStoryPreview'
import InactiveUserStoryPreview from './InactiveUserStoryPreview'
import SingleUserStoryViewer from './SingleUserStoryViewer'

interface StoryViewerProps {
  users: StoryUser[]
  currentUserIndex: number
  onNext: () => void
  onPrev: () => void
  onComplete: () => void
  onUserSelect: (index: number) => void
}

export default function StoryViewer({
  users,
  currentUserIndex,
  onNext,
  onPrev,
  onComplete,
  onUserSelect
}: StoryViewerProps) {
  const visibleIndices = Array.from({ length: 5 }, (_, i) => currentUserIndex - 2 + i)

  const renderUserPreview = (user: StoryUser | undefined, index: number) => {
    if (!user) {
      return <div key={`placeholder-${index}`} style={{width: '190px', height: '45vh'}} className="w-190 h-45vh" />
    }

    const isActive = index === currentUserIndex
    const containerClass = `
      relative rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out
      ${isActive ? 'w-440 px-9 h-90 z-10' : 'w-190 h-45vh z-0'}
    `

    return (
      <motion.div
        key={user.id}
        initial={{ opacity: 1, scale: isActive ? 1 : 0.9 }}
        animate={{ opacity: 1, scale: isActive ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={() => !isActive && onUserSelect(index)}
        className={containerClass}
      >
        {isActive ? (
          <ActiveUserStoryViewer
            user={user}
            onPrev={onPrev}
            onComplete={onComplete}
            isFirstUser={index === 0}
            isLastUser={index === users.length - 1}
          />
        ) : (
          <InactiveUserStoryPreview user={user} />
        )}
      </motion.div>
    )
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center gap-6 w-full h-full relative overflow-visible px-12">
        {visibleIndices.map(index => renderUserPreview(users[index], index))}
      </div>

      {/* Mobile View */}
      <div className="md:hidden h-full w-full flex items-center justify-center">
        <div className="w-full h-full">
          <SingleUserStoryViewer
            user={users[currentUserIndex]}
            isActive={true}
            onNext={onNext}
            onPrev={onPrev}
            onComplete={onComplete}
          />
        </div>
      </div>
    </>
  )
}
