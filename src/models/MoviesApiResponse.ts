import {IMovie} from "@/models/IMovie";

export type MoviesApiResponse = {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
};