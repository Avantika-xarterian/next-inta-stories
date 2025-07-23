"use client";
import { StoryUser } from "../types";
import { useState } from "react";
import ImageWithFallback from "./ImageWithFallback";

interface Props {
  user: StoryUser;
}

export default function InactiveUserStoryPreview({ user }: Props) {
  const story = user.stories?.[0];
  if (!story) return null;

  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div  className="bg-[#14181C] relative w-full h-full flex flex-col rounded-xl overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center cursor-pointer">
        {/* <img src={story.media} alt={story.id} className="max-w-full max-h-full object-contain" /> */}
        <ImageWithFallback
          fill
          alt={story.id || "Story Image"}
          src={story.media}
          fallbackSrc="/assets/PlaceholderStories.svg"
          className={`max-w-full max-h-full object-cover transition duration-500 ${
            !isLoaded ? "blur-md scale-105" : ""
          }`}
          placeholder="blur"
          blurDataURL="/assets/PlaceholderStories.svg"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </div>
  );
}
