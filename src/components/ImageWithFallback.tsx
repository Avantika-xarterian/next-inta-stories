'use client'

import Image from 'next/image'
import { useState, forwardRef } from 'react'
import type { ImageProps } from 'next/image'

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined
  fallbackSrc: string
}

const ImageWithFallback = forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ src, fallbackSrc, onError, onLoad, ...rest }, ref) => {
    const [hasError, setHasError] = useState(false)

    return (
      <Image
        {...rest}
        ref={ref}
        src={hasError || !src ? fallbackSrc : src}
        onLoad={onLoad}
        onError={(e) => {
          setHasError(true)
          onError?.(e)
        }}
      />
    )
  }
)

ImageWithFallback.displayName = 'ImageWithFallback'
export default ImageWithFallback
