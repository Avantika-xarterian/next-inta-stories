'use client'

// import useWindowSize from '@/shared/hooks/windowSize'
import { StoryUser } from '../types'
import useWindowSize from './hooks/windowSize'
import SingleUserStoryViewer from './SingleUserStoryViewer'
import UserStoryPreview from './UserStoryPreview'

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
  onPrev,
  onComplete,
  onUserSelect
}: StoryViewerProps) {
  const visibleIndices = Array.from({ length: 5 }, (_, i) => currentUserIndex - 2 + i)

  const [width] = useWindowSize()
  const isMobile = width && width < 768

  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <SingleUserStoryViewer
          user={users[currentUserIndex]}
          isActive={true}
          onPrev={onPrev}
          onComplete={onComplete}
        />
      </div>
    )
  } else
    return (
      <div className="hidden md:flex items-center justify-center gap-6 w-full h-full relative overflow-visible px-12">
        {visibleIndices?.map(index => (
          <UserStoryPreview
            key={index}
            user={users[index]}
            index={index}
            currentUserIndex={currentUserIndex}
            totalUsers={users?.length}
            onUserSelect={onUserSelect}
            onPrev={onPrev}
            onComplete={onComplete}
          />
        ))}
      </div>
    )
}
