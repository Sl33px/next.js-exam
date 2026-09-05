import {MoviesApiResponse} from "@/models/MoviesApiResponse";
import {IMovieGenre} from "@/models/IMovieGenre";
import {IMovieVideo, Results} from "@/models/IMovieVideo";
import {ICollectionMovie} from "@/models/ICollectionMovie";
import {IMovieByID} from "@/models/IMovieByID";
import {IMovie} from "@/models/IMovie";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3/'

const fetchHelperForCaching = async <T>(
    endpoint: string,
    params: Record<string, any> = {},
    revalidateSeconds: number = 3600
): Promise<T> => {
    const searchParams = new URLSearchParams({
        language: "en-US",
        ...params,
    });

    const res = await fetch(`${BASE_URL}${endpoint}?${searchParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
    }

    return res.json();
};

export const getAllMovies = async (
    page: number = 1,
    with_genres?: string,
    sort_by?: string
): Promise<MoviesApiResponse> => {
    const params: Record<string, any> = { page };
    if (with_genres && with_genres.trim() !== "") params.with_genres = with_genres;
    if (sort_by && sort_by.trim() !== "") params.sort_by = sort_by;

    return fetchHelperForCaching<MoviesApiResponse>("/discover/movie", params, 3600);
};

export const getAllUpcomingMovies = async (): Promise<IMovie[]> => {
    const data = await fetchHelperForCaching<{ results: IMovie[] }>("/movie/upcoming", {}, 3600);
    return data.results || [];
};

export const getMovieById = async (movieId: string): Promise<IMovieByID> => {
    return fetchHelperForCaching<IMovieByID>(`/movie/${movieId}`, {}, 86400);
};

export const getCollectionByID = async (collectionId: number): Promise<ICollectionMovie> => {
    return fetchHelperForCaching<ICollectionMovie>(`/collection/${collectionId}`, {}, 86400);
};

export const getMovieVideos = async (movieId: number | string): Promise<Results[]> => {
    const data = await fetchHelperForCaching<IMovieVideo>(`/movie/${movieId}/videos`, {}, 86400);
    return data.results || [];
};

export const getMovieGenres = async (): Promise<IMovieGenre[]> => {
    const data = await fetchHelperForCaching<{ genres: IMovieGenre[] }>("/genre/movie/list", {}, 86400);
    return data.genres || [];
};

export const searchMoviesApi = async (query: string, page: number = 1) => {
    return fetchHelperForCaching<MoviesApiResponse>("/search/movie", { query, page }, 600);
};