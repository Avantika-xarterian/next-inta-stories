// hooks/useStoryPlayer.ts
import { useCallback, useEffect, useRef, useState } from 'react'
import { StoryUser } from '../types'

export function useStoryPlayer({
  user,
  isActive = true,
  onPrev,
  onComplete
}: {
  user: StoryUser
  isActive?: boolean
  onPrev: () => void
  onComplete: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasAdvanced = useRef(false)

  const total = user?.stories.length || 0
  const currentStory = user?.stories?.[currentIndex]
  const duration = currentStory?.duration || 5

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      onComplete()
    }
    setProgress(0)
  }, [currentIndex, total, onComplete])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
    } else {
      onPrev()
    }
    setProgress(0)
  }, [currentIndex, onPrev])

  const handleMediaError = useCallback(() => {
    setImageError(true)
    setTimeout(() => {
      if (currentIndex < total - 1) {
        setCurrentIndex(i => i + 1)
      } else {
        onComplete()
      }
      setProgress(0)
    }, 2000)
  }, [currentIndex, total, onComplete])

  useEffect(() => {
    setProgress(0)
    hasAdvanced.current = false
  }, [currentIndex])

  useEffect(() => {
    clearTimer()

    if (!isActive || isPaused || !currentStory) return

    const increment = 100 / (duration * 10)

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment
        if (next >= 100 && !hasAdvanced.current) {
          hasAdvanced.current = true
          clearTimer()
          setTimeout(handleNext, 50)
        }
        return Math.min(next, 100)
      })
    }, 100)

    return clearTimer
  }, [duration, isPaused, isActive, handleNext, currentStory])

  useEffect(() => {
    setCurrentIndex(0)
    setProgress(0)
    hasAdvanced.current = false
  }, [user?.id])

  return {
    currentStory,
    currentIndex,
    progress,
    total,
    imageError,
    setImageError,
    handleNext,
    handlePrev,
    handleMediaError,
    setIsPaused
  }
}
