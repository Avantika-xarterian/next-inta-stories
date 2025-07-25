interface Story {
    id: string;
    username: string;
    avatar: string;
    media: StoryMedia[];
    timestamp: Date;
    isViewed?: boolean;
}
interface StoryMedia {
    id: string;
    type: string;
    media: string;
    duration?: number;
    timestamp: Date;
}
interface StoryUser {
    id: string;
    name: string;
    title: string;
    stories: StoryMedia[];
    profilePicture: string;
    hasUnviewedStories?: boolean;
}

interface StoriesModalProps {
    users: StoryUser[];
    initialIndex: number;
    onClose: () => void;
}
declare function StoriesModal({ users, onClose, initialIndex }: StoriesModalProps): any;

interface Props {
    user: StoryUser;
    isActive: boolean;
    onPrev: () => void;
    onComplete: () => void;
}
declare function SingleUserStoryViewer({ user, isActive, onPrev, onComplete }: Props): any;

export { SingleUserStoryViewer, StoriesModal };
export type { Story };
