import { motion } from 'framer-motion'
import { StoryUser } from '../types'
import ActiveUserStoryViewer from './ActiveUserStoryPreview'
import InactiveUserStoryPreview from './InactiveUserStoryPreview'
// components/UserStoryPreview.tsx
interface UserStoryPreviewProps {
  user?: StoryUser
  index: number
  currentUserIndex: number
  totalUsers: number
  onUserSelect: (index: number) => void
  onPrev: () => void
  onComplete: () => void
}

export default function UserStoryPreview({
  user,
  index,
  currentUserIndex,
  totalUsers,
  onUserSelect,
  onPrev,
  onComplete
}: UserStoryPreviewProps) {
  if (!user) {
    return <div className="w-440 h-90" />
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
          isLastUser={index === totalUsers - 1}
        />
      ) : (
        <InactiveUserStoryPreview user={user} />
      )}
    </motion.div>
  )
}
