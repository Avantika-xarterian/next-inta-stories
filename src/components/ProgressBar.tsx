// components/ProgressBar.tsx
'use client'

interface ProgressBarProps {
  total: number
  currentIndex: number
  progress: number
}

export default function ProgressBar({ total, currentIndex, progress }: ProgressBarProps) {
  return (
    <div className="flex gap-1 p-2 absolute top-0 left-0 right-0 z-10">
      {Array.from({ length: total }).map((_, idx) => (
        <div key={idx} className="flex-1 h-1 transparent-white bg-opacity-30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-75 ease-linear"
            style={{
              width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
            }}
          />
        </div>
      ))}
    </div>
  )
}
