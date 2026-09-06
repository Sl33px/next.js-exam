import Link from "next/link";
import type { IMovie } from "@/models/IMovie";
import type { IMovieGenre } from "@/models/IMovieGenre";
import PosterPreviewComponent from "../PosterPreview/PosterPreviewComponent";
import GenreBadgeComponent from "../GenreBadge/GenreBadgeComponent";

type Props = {
    movie: IMovie;
    isFirst?: boolean;
    genres?: IMovieGenre[];
};

const MoviesListCardComponent = ({ movie, isFirst = false, genres = [] }: Props) => {
    if (!movie) return null;

    const genresMap = new Map(genres.map((g) => [g.id, g.name]));

    return (
        <Link
            href={`/movie/${movie.id}`}
            className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-white/10 flex flex-col justify-between hover:border-white/30 transition-all duration-300 h-full w-full"
        >
            <PosterPreviewComponent
                posterPath={movie.poster_path}
                title={movie.title || movie.original_title}
                priority={isFirst}
                className="rounded-none border-none"
            />

            <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {movie.title || movie.original_title}
                    </h3>

                    <p className="text-xs text-zinc-400 mt-1">
                        ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    </p>
                </div>

                {movie.genre_ids && movie.genre_ids.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 min-h-[24px] items-end">
                        {movie.genre_ids.slice(0, 2).map((id) => (
                            <GenreBadgeComponent
                                key={id}
                                genreId={id}
                                genreName={genresMap.get(id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MoviesListCardComponent;