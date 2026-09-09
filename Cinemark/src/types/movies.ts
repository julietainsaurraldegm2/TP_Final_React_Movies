export interface Movies {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
}

export interface Actor {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Review {
    id: string;
    author: string;
    content: string;
    created_at: string;
    author_details?: {
        rating?: number | null;
    };
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official?: boolean;
}