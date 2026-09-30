export interface User {
    id: string;
    email: string;
    name: string;
    program: string;
    branch: string;
    year: number;
    avatarUrl: string;
    status: string;
    createdAt: string;

}

export interface Post {
    id: string;
    userId: string;
    type: 'learning_request' | 'teaching_offer';
    subject: string;
    description: string;
    tags: string[];
    status: string;
    createdAt: string;
    user: Pick<User, 'id' | 'name' | 'program' | 'branch' | 'year' | 'avatarUrl'>;
}

export interface Connection {
    id: string;
    requesterId: string;
    receiverId: string;
    postId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    requester: Pick<User, 'id' | 'name' | 'avatarUrl' | 'program' | 'branch' | 'year'>;
    receiver: Pick<User, 'id' | 'name' | 'avatarUrl' | 'program' | 'branch' | 'year'>;
    post: Pick<Post, 'id' | 'subject' | 'type'>;
    session: {
        id: string;
        scheduledAt: string;
        status: 'upcoming' | 'Upcoming' | 'completed' | 'did_not_happen';
    } | null;
}

export interface Review {
    id: string;
    connectionId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: Pick<User, 'id' | 'name' | 'avatarUrl'>;
}

export interface ProfileSummary {
    acceptedConnections: number;
    lessonsTaught: number;
    lessonsLearned: number;
    averageRating: number;
    reviewCount: number;
}