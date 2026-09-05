'use client';

import { useRouter, useSearchParams } from "next/navigation";
import type { IMovie } from "@/models/IMovie";
import type { IMovieGenre } from "@/models/IMovieGenre";
import MoviesListCard from "./MoviesListCard";
import Pagination from "./pagination/PaginationComponent";

interface Props {
    movies: IMovie[];
    totalPages: number;
    genres: IMovieGenre[];
    currentPage: number;
    currentGenre: string;
    currentSort: string;
    currentQuery: string;
}

const SORT_OPTIONS = [
    { label: "Most Popular", value: "popularity.desc" },
    { label: "Highest Rated", value: "vote_average.desc" },
    { label: "Newest Releases", value: "primary_release_date.desc" },
    { label: "Title (A-Z)", value: "title.asc" },
];

const MoviesListComponent = ({
                                 movies,
                                 totalPages,
                                 genres,
                                 currentPage,
                                 currentGenre,
                                 currentSort,
                                 currentQuery,
                             }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // helper function for updating URLs
    const updateUrl = (newParams: Record<string, string | null>, shouldScroll = false) => {
        // take current parameters from the URL (to store genres, sorting and query)
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        router.push(`/?${params.toString()}`, { scroll: shouldScroll });
    };

// changing the page only changes the page, preserving genres and sorting
    const handlePageChange = (newPage: number) => {
        updateUrl({ page: newPage.toString() }, true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSortChange = (newSort: string) => {
        updateUrl({ page: "1", sort_by: newSort });
    };

    const handleGenreSelect = (id: number | null) => {
        updateUrl({
            page: "1",
            with_genres: id ? id.toString() : null,
            query: null,
        });
    };


    const selectedGenre = genres.find((g) => String(g.id) === currentGenre);

    return (
        <section className="my-8 w-full max-w-[1700px] mx-auto px-6 sm:px-10 lg:px-16 space-y-6">
            {/* Genres */}
            {genres.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleGenreSelect(null)}
                            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                                !currentGenre
                                    ? "bg-white text-zinc-950 font-bold shadow-md"
                                    : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/10"
                            }`}
                        >
                            All Movies
                        </button>
                        {genres.map((g) => {
                            const isActive = String(g.id) === currentGenre;
                            return (
                                <button
                                    key={g.id}
                                    onClick={() => handleGenreSelect(g.id)}
                                    className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                                        isActive
                                            ? "bg-white text-zinc-950 font-bold shadow-md"
                                            : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/10"
                                    }`}
                                >
                                    {g.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* header + sorting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {currentQuery ? (
                        <span>Search results for: <span className="text-blue-400">{currentQuery}</span></span>
                    ) : selectedGenre ? (
                        <span>Filtered Movies by: <span className="text-blue-400">{selectedGenre.name}</span></span>
                    ) : (
                        "All Movies"
                    )}
                </h2>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">Sort by:</span>
                        <select
                            value={currentSort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="bg-zinc-900 text-zinc-200 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-white/30 cursor-pointer"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-zinc-900 text-zinc-200">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {currentGenre && (
                        <button
                            onClick={() => handleGenreSelect(null)}
                            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                            Reset filter ✕
                        </button>
                    )}
                </div>
            </div>

            {/* films list grid */}
            {movies && movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {movies.map((movie: IMovie, index) => (
                        <MoviesListCard key={movie.id} movie={movie} genres={genres} isFirst={index === 0} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-zinc-500">
                    No movies found.
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </section>
    );
};

export default MoviesListComponent;