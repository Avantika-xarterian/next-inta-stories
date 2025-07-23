"use client";

// import PlaceholderStories from '../assets/PlaceholderStories.svg'
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { StoryUser } from "../types";
import ImageWithFallback from "./ImageWithFallback";
interface SingleUserStoryViewerProps {
  user: StoryUser;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

export default function SingleUserStoryViewer({
  user,
  isActive,
  onPrev,
  onComplete,
}: SingleUserStoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
  const touchStartTimeRef = useRef(0);

  const currentStory = user?.stories[currentStoryIndex];
  const totalStories = user?.stories.length || 0;
  const duration = currentStory?.duration || 5;
  const hasCalledNext = useRef(false);

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setCurrentStoryIndex(0);
    setProgress(0);
    hasCalledNext.current = false;
  }, [user?.id]);

  useEffect(() => {
    setProgress(0);
    hasCalledNext.current = false;
  }, [currentStoryIndex]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isActive || isPaused) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 100 / (duration * 10);

        if (nextProgress >= 100) {
          if (!hasCalledNext.current) {
            hasCalledNext.current = true;

            handleNextStory();
          }
          return 0;
        }

        return nextProgress;
      });
    }, 100);

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [currentStoryIndex, isPaused, duration, isActive]);

  const handleNextStory = () => {
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onComplete?.();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      onPrev();
    }
  };

  const handleTouchStart = () => {
    setIsPaused(true);
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    const touchDuration = Date.now() - touchStartTimeRef.current;

    if (touchDuration < 300) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.changedTouches[0].clientX - rect.left;
      const width = rect.width;

      if (x < width / 2) {
        handlePrevStory();
      } else {
        handleNextStory();
      }
    }
  };

  const handleMediaLoad = () => {
    hasCalledNext.current = false;
  };

  const handleMediaError = () => {
    console.warn("[Media Error]", {
      storyId: currentStory?.id,
      media: currentStory?.media,
    });
    setImageError(true);

    setTimeout(() => {
      if (currentStoryIndex < totalStories - 1) {
        console.warn("[Skipping Story due to error]", {
          from: currentStoryIndex,
          to: currentStoryIndex + 1,
        });
        setCurrentStoryIndex((prev) => prev + 1);
        setProgress(0);
      } else {
        console.warn("[Error on last story] Calling onComplete()");
        onComplete?.();
      }
    }, 2000);
  };

  if (!currentStory) {
    console.error("[Missing Story]", { currentStoryIndex, totalStories });
    return null;
  }

  return (
    <div className="darkBg relative w-full h-full flex flex-col rounded-xl overflow-hidden">
      {/* Progress bars */}
      <div className="flex gap-1 p-2 absolute top-0 left-0 right-0 z-10">
        {Array.from({ length: totalStories }).map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white transparent-white rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  index < currentStoryIndex
                    ? "100%"
                    : index === currentStoryIndex
                    ? `${progress}%`
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* User info */}
      {/* <div className="flex items-center gap-3 p-4 pt-8 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <Image
          src={user?.profilePicture}
          alt={user?.name}
          width={20}
          height={20}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-white font-medium">{user.name}</span>
        <span className="text-white text-sm opacity-75 ml-auto">
          {new Date(currentStory.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div> */}

      {/* Media */}
      <div
        className="flex-1 relative flex items-center justify-center cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentStory.type === "image" ? (
          <ImageWithFallback
            fill
            ref={mediaRef as React.RefObject<HTMLImageElement>}
            src={currentStory?.media}
            fallbackSrc="/assets/PlaceholderStories.svg"
            alt={currentStory?.id || "Story"}
            className="max-w-full max-h-full object-cover"
            placeholder="blur"
            blurDataURL="/assets/PlaceholderStories.svg"
            onLoad={handleMediaLoad}
            onError={handleMediaError}
          />
        ) : (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={currentStory?.media}
            className="max-w-full max-h-full object-cover"
            autoPlay={isActive}
            muted
            playsInline
            onLoadedData={handleMediaLoad}
            // onError={handleMediaError}
            onEnded={handleNextStory}
          />
        )}
      </div>
    </div>
  );
}
