export interface Parts {
    adult: boolean;
    backdrop_path: string;
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string;
    media_type: string;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    release_date: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface ICollectionMovie {
    id: number;
    name: string;
    original_language: string;
    original_name: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    parts: Parts[];
}