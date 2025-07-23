'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import useDebounce from '@/shared/hooks/useDebounce'
import { ViewPortEndpoints } from '@/shared/utils'

import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay: number = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}



const ViewPortEndpoints = ({ breakpoints = [], currentSize }: any) => {
  let isIntersecting = false
  for (let i = 0; i < breakpoints.length; i++) {
    const [start, end] = breakpoints[i]
    if (currentSize > start && currentSize < end) {
      isIntersecting = true
      break
    } else {
      isIntersecting = false
    }
  }
  return { isIntersecting }
}
function useWindowSize() {
  const isIntersecting = useCallback(
    (currentSize: number) =>
      ViewPortEndpoints({
        currentSize,
        breakpoints: [
          [340, 400],
          [550, 590],
          [730, 780],
          [890, 930]
        ]
      } as { breakpoints?: number[][]; currentSize: number }).isIntersecting,
    []
  )
  const [size, setSize] = useState<[number, number] | []>([])
  const [optSize, setOptSize] = useState<[number, number] | []>(
    typeof window !== 'undefined' ? [window.innerWidth, window.innerHeight] : [0, 0]
  )
  const isDirty: { current: boolean } = useRef(false)
  const enhancedSize = useDebounce<[number, number] | []>(size, 200)
  const isPoint: { current: boolean } = useRef(
    isIntersecting(typeof window !== 'undefined' ? window.innerWidth : 0)
  )

  useEffect(() => {
    if (isDirty.current && !isPoint.current) {
      setOptSize(enhancedSize)
    }
  }, [enhancedSize])
  useEffect(() => {
    setOptSize([window.innerWidth, window.innerHeight])
    function updateSize() {
      !isDirty.current && (isDirty.current = true)
      isPoint.current = isIntersecting(window.innerWidth)
      if (isDirty.current && !isPoint.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        setSize([width, height])
      } else if (isPoint.current) {
        const width = window.innerWidth
        const height = window.innerHeight
        setOptSize([width, height])
      }
    }
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])
  return optSize
}
export default useWindowSize
