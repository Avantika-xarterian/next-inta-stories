'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StoryUser } from '../types'

interface Props {
  user: StoryUser
  onPrev: () => void
  onComplete: () => void
  isFirstUser: boolean
  isLastUser: boolean
}

export default function ActiveUserStoryViewer({
  user,
  onPrev,
  onComplete,
  isFirstUser,
  isLastUser
}: Props) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [imageError, setImageError] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCalledNext = useRef(false)

  const currentStory = user?.stories[currentStoryIndex]
  const totalStories = user?.stories?.length
  const duration = currentStory?.duration || 5

  useEffect(() => {
    if (!currentStory) return
    setProgress(0)
    setImageError(false)
    hasCalledNext.current = false
  }, [currentStoryIndex])

  const handleNextStory = useCallback(() => {
    if (hasCalledNext.current && progress >= 100) return

    hasCalledNext.current = true

    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex(prev => prev + 1)
    } else {
      onComplete?.()
    }
  }, [currentStoryIndex, totalStories, onComplete, progress])

  const handlePrevStory = useCallback(() => {
    hasCalledNext.current = true
    setProgress(0)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (currentStoryIndex > 0) {
      setTimeout(() => {
        setCurrentStoryIndex(i => i - 1)
      }, 100)
    } else {
      onPrev()
    }
  }, [currentStoryIndex, onPrev])

  useEffect(() => {
    // Step 1: Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    hasCalledNext.current = false

    // Separate function for progress update logic
    const updateProgress = (prevProgress: number): number => {
      const increment = 100 / (duration * 10)
      const newProgress = prevProgress + increment

      const isComplete = newProgress >= 100
      if (isComplete && !hasCalledNext.current) {
        hasCalledNext.current = true
        clearInterval(intervalRef.current!)

        // Defer the next story call
        triggerNextStory()
      }

      return Math.min(newProgress, 100)
    }

    const triggerNextStory = () => {
      setTimeout(() => {
        handleNextStory()
      }, 50)
    }

    // Step 2: Start new interval
    intervalRef.current = setInterval(() => {
      setProgress(updateProgress)
    }, 100)

    // Optional: Clear interval on unmount to avoid memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [duration, handleNextStory])

  const handleClick = (e: React.MouseEvent) => {
    if (hasCalledNext.current) return
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const clickedPrev = e.clientX - left < width / 2
    clickedPrev ? handlePrevStory() : handleNextStory()
  }

  const handleMediaError = () => {
    setImageError(true)
    setTimeout(() => {
      if (currentStoryIndex < totalStories - 1) {
        setCurrentStoryIndex(i => i + 1)
      } else {
        onComplete()
      }
    }, 2000)
  }

  if (!currentStory) return null
  return (
    <div className="relative w-full h-full bg-[#14181C] flex flex-col rounded-xl">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

      <div className="flex gap-1 p-2 absolute top-0 left-0 right-0 z-10">
        {user.stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white transparent-white rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-75 ease-linear"
              style={{
                width:
                  index < currentStoryIndex
                    ? '100%'
                    : index === currentStoryIndex
                      ? `${progress}%`
                      : '0%'
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {!(isFirstUser && currentStoryIndex === 0) && (
          <button
            onClick={handlePrevStory}
            className="absolute -left-9 top-50 transform -translate-y-1/2 z-20 hover:scale-110 transition-transform"
            aria-label="Previous Story"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.75C13.9284 21.75 15.8134 21.1782 17.4168 20.1068C19.0202 19.0355 20.2699 17.5127 21.0078 15.7312C21.7458 13.9496 21.9389 11.9892 21.5627 10.0979C21.1864 8.20655 20.2579 6.46927 18.8943 5.10571C17.5307 3.74215 15.7934 2.81355 13.9021 2.43734C12.0108 2.06114 10.0504 2.25422 8.26883 2.99217C6.48725 3.73013 4.96451 4.97981 3.89317 6.58319C2.82182 8.18657 2.25 10.0716 2.25 12C2.25273 14.585 3.28083 17.0634 5.10872 18.8913C6.93661 20.7192 9.41497 21.7473 12 21.75ZM9.21937 11.4694L12.9694 7.71937C13.0391 7.64969 13.1218 7.59442 13.2128 7.5567C13.3039 7.51899 13.4015 7.49958 13.5 7.49958C13.5985 7.49958 13.6961 7.51899 13.7872 7.5567C13.8782 7.59442 13.9609 7.64969 14.0306 7.71937C14.1003 7.78906 14.1556 7.87178 14.1933 7.96283C14.231 8.05387 14.2504 8.15145 14.2504 8.25C14.2504 8.34855 14.231 8.44613 14.1933 8.53717C14.1556 8.62822 14.1003 8.71094 14.0306 8.78062L10.8103 12L14.0306 15.2194C14.1714 15.3601 14.2504 15.551 14.2504 15.75C14.2504 15.949 14.1714 16.1399 14.0306 16.2806C13.8899 16.4214 13.699 16.5004 13.5 16.5004C13.301 16.5004 13.1101 16.4214 12.9694 16.2806L9.21937 12.5306C9.14964 12.461 9.09432 12.3783 9.05658 12.2872C9.01883 12.1962 8.99941 12.0986 8.99941 12C8.99941 11.9014 9.01883 11.8038 9.05658 11.7128C9.09432 11.6217 9.14964 11.539 9.21937 11.4694Z"
                fill="#434343"
              />
            </svg>
          </button>
        )}

        <div
          className="flex-1 flex items-center justify-center cursor-pointer rounded-xl overflow-hidden"
          onClick={handleClick}
        >
          {currentStory.type === 'image' ? (
            <Image
              src={imageError ? '../assets/PlaceholderStories.svg' : currentStory.media}
              className="rounded-xl object-cover"
              alt="Story"
              fill
              placeholder="blur"
              blurDataURL={'../assets/PlaceholderStories.svg'}
              onLoad={() => (hasCalledNext.current = false)}
              onError={handleMediaError}
            />
          ) : (
            <video
              src={currentStory.media}
              className="max-w-full max-h-full object-cover"
              autoPlay
              muted
              playsInline
              onLoadedData={() => (hasCalledNext.current = false)}
              onEnded={handleNextStory}
              onError={handleMediaError}
            />
          )}
        </div>

        {!(isLastUser && currentStoryIndex === totalStories - 1) && (
          <button
            onClick={handleNextStory}
            className="absolute -right-9 top-50 transform -translate-y-1/2 z-20 hover:scale-110 transition-transform"
            aria-label="Next Story"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96451 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM14.7806 12.5306L11.0306 16.2806C10.9609 16.3503 10.8782 16.4056 10.7872 16.4433C10.6961 16.481 10.5986 16.5004 10.5 16.5004C10.4015 16.5004 10.3039 16.481 10.2128 16.4433C10.1218 16.4056 10.0391 16.3503 9.96938 16.2806C9.8997 16.2109 9.84442 16.1282 9.80671 16.0372C9.769 15.9461 9.74959 15.8485 9.74959 15.75C9.74959 15.6515 9.769 15.5539 9.80671 15.4628C9.84442 15.3718 9.8997 15.2891 9.96938 15.2194L13.1897 12L9.96938 8.78063C9.82865 8.63989 9.74959 8.44902 9.74959 8.25C9.74959 8.05098 9.82865 7.86011 9.96938 7.71937C10.1101 7.57864 10.301 7.49958 10.5 7.49958C10.699 7.49958 10.8899 7.57864 11.0306 7.71937L14.7806 11.4694C14.8504 11.539 14.9057 11.6217 14.9434 11.7128C14.9812 11.8038 15.0006 11.9014 15.0006 12C15.0006 12.0986 14.9812 12.1962 14.9434 12.2872C14.9057 12.3783 14.8504 12.461 14.7806 12.5306Z"
                fill="#434343"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
