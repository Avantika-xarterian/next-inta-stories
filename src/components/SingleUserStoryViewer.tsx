'use client'

import { useRef } from 'react'
// import { useStoryPlayer } from '../hooks/useStoryPlayer'
import { StoryUser } from '../types'
import { useStoryPlayer } from './hooks/useStoryPlayer'

interface Props {
  user: StoryUser
  isActive: boolean
  onPrev: () => void
  onComplete: () => void
}

export default function SingleUserStoryViewer({ user, isActive, onPrev, onComplete }: Props) {
  const touchStartRef = useRef(0)

  const {
    currentStory,
    currentIndex,
    progress,
    total,
    imageError,
    handleNext,
    handlePrev,
    handleMediaError,
    setIsPaused
  } = useStoryPlayer({
    user,
    isActive,
    onPrev,
    onComplete
  })

  const handleTouchStart = () => {
    setIsPaused(true)
    touchStartRef.current = Date.now()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false)
    const duration = Date.now() - touchStartRef.current
    if (duration < 300) {
      const { left, width } = e.currentTarget.getBoundingClientRect()
      const tapX = e.changedTouches[0].clientX - left
      tapX < width / 2 ? handlePrev() : handleNext()
    }
  }

  if (!currentStory) {
    console.error('[Missing Story]', { currentIndex, total })
    return null
  }

  const { type, media } = currentStory

  return (
    <div className="relative w-full h-full bg-[#14181C] flex flex-col rounded-xl overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Progress bars */}
      {/* <div className="flex gap-1 p-2 absolute top-0 left-0 right-0 z-10">
        {Array.from({ length: total }).map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{
                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div> */}

      <ProgressBar total={total} currentIndex={currentIndex} progress={progress} />

      {/* Media */}
      <div
        className="flex-1 relative flex items-center justify-center cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {type === 'image' ? (
           <ImageWithFallback
            fill
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={currentStory?.media}
            fallbackSrc="/assets/PlaceholderStories.svg"
            alt={currentStory?.id || "Story"}
            className="max-w-full max-h-full object-cover"
            placeholder="blur"
            blurDataURL="/assets/PlaceholderStories.svg"
            onLoad={() => setIsPaused(false)}
            onError={handleMediaError}
          />
        ) : (
          <video
            src={media}
            className="max-w-full max-h-full object-cover"
            autoPlay={isActive}
            muted
            playsInline
            onLoadedData={() => setIsPaused(false)}
            onEnded={handleNext}
            onError={handleMediaError}
          />
        )}
      </div>
    </div>
  )
}
