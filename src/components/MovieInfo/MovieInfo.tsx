import Image from "next/image";
import StarsRatingComponent from "@/components/StarsRating/StarsRatingComponent";
import GenreBadgeComponent from "@/components/GenreBadge/GenreBadgeComponent"; // перевір шлях до GenreBadge
import MovieTrailerComponent from "@/components/MovieTrailer/MovieTrailerComponent";
import MovieCollectionBlockComponent from "@/components/MovieCollectionBlock/MovieCollectionBlockComponent";

type Genre = {
    id: number;
    name: string;
};

type ProductionCompany = {
    id: number;
    name: string;
    logo_path: string | null;
};

type ProductionCountry = {
    name: string;
};

type SpokenLanguage = {
    name: string;
    english_name?: string;
};

type MovieInfoProps = {
    movie: {
        id: number;
        title: string;
        original_title?: string;
        tagline?: string;
        adult?: boolean;
        vote_average: number;
        vote_count: number;
        runtime: number;
        release_date?: string;
        genres?: Genre[];
        overview?: string;
        belongs_to_collection?: any;
        production_countries?: ProductionCountry[];
        spoken_languages?: SpokenLanguage[];
        production_companies?: ProductionCompany[];
    };
};

const MovieInfo = ({ movie }: MovieInfoProps) => {
    return (
        <div className="flex-1 space-y-6 w-full">
            <div>
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                        {movie.title}
                    </h1>
                    {movie.adult && (
                        <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-md border border-red-500/30">
                            18+
                        </span>
                    )}
                </div>

                {movie.original_title && movie.original_title !== movie.title && (
                    <p className="text-zinc-400 font-medium mt-1 text-base">
                        Original Name: {movie.original_title}
                    </p>
                )}

                {movie.tagline && (
                    <p className="text-zinc-300 italic mt-2 text-lg md:text-xl">
                        "{movie.tagline}"
                    </p>
                )}
            </div>

            {/* Rating, Duration, Date */}
            <div className="flex flex-wrap items-center gap-4 text-base font-semibold">
                <div className="flex items-center gap-3 bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/10">
                    <StarsRatingComponent voteAverage={movie.vote_average} />
                    <span className="text-zinc-500 text-xs">({movie.vote_count} votes)</span>
                </div>

                {movie.runtime > 0 && (
                    <span className="bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/10 text-zinc-200">
                        ⏱ {movie.runtime} min
                    </span>
                )}

                {movie.release_date && (
                    <span className="bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/10 text-zinc-200">
                        📅 {movie.release_date}
                    </span>
                )}
            </div>

            {/* Genres (Використовуємо GenreBadgeComponent) */}
            {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2.5">
                    {movie.genres.map((genre) => (
                        <GenreBadgeComponent
                            key={genre.id}
                            genreId={genre.id}
                            genreName={genre.name}
                        />
                    ))}
                </div>
            )}

            {/* Description */}
            <div className="pt-4 border-t border-white/10">
                <h2 className="text-xl font-bold text-white mb-3">Description</h2>
                <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
                    {movie.overview || "No description available."}
                </p>
            </div>

            {/* Trailer */}
            <MovieTrailerComponent movieId={movie.id} />

            {/* Franchise */}
            {movie.belongs_to_collection && (
                <MovieCollectionBlockComponent collectionInfo={movie.belongs_to_collection} />
            )}

            {/* Countries and Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-base">
                {movie.production_countries && movie.production_countries.length > 0 && (
                    <div>
                        <span className="font-bold text-white block mb-1.5 text-lg">
                            Regions of production:
                        </span>
                        <p className="text-zinc-300">
                            {movie.production_countries.map((c) => c.name).join(", ")}
                        </p>
                    </div>
                )}

                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                    <div>
                        <span className="font-bold text-white block mb-1.5 text-lg">
                            Voiceover / Languages:
                        </span>
                        <p className="text-zinc-300">
                            {movie.spoken_languages.map((l) => l.english_name || l.name).join(", ")}
                        </p>
                    </div>
                )}
            </div>

            {/* Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                    <span className="font-bold text-white text-lg block mb-4">
                        Manufacturing companies:
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                        {movie.production_companies.map((company) => (
                            <div
                                key={company.id}
                                className="bg-white/90 hover:bg-white px-4 py-2 rounded-xl flex items-center justify-center h-12 transition-all border border-white/20 shadow-sm"
                            >
                                {company.logo_path ? (
                                    <div className="relative h-7 w-28">
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                            alt={company.name}
                                            fill
                                            sizes="112px"
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs font-bold text-zinc-900">
                                        {company.name}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieInfo;