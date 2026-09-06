import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieById } from "@/services/movies.api";
import MovieCollectionBlockComponent from "@/components/MovieCollectionBlock/MovieCollectionBlockComponent";
import MovieTrailerComponent from "@/components/MovieTrailer/MovieTrailerComponent";
import StarsRatingComponent from "@/components/StarsRating/StarsRatingComponent";
import PosterPreviewComponent from "@/components/PosterPreview/PosterPreviewComponent";
import {Metadata} from "next";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    try {
        const movie = await getMovieById(id);

        return {
            title: `${movie.title} | MoviesApp`,
            description: movie.overview || `Watch ${movie.title} online`,
            openGraph: {
                title: movie.title,
                description: movie.overview,
                images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
            },
        };
    } catch {
        return {
            title: 'Movie Not Found | MoviesApp',
        };
    }
}


const MovieDetailsPage = async ({ params }: Props) => {
    const { id } = await params;

    let movie;
    try {
        movie = await getMovieById(id);
    } catch (error) {
        notFound();
    }

    if (!movie) {
        notFound();
    }

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
        : movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.png";

    const formatCurrency = (amount: number) => {
        return amount > 0 ? `$${amount.toLocaleString()}` : "Unknown";
    };

    return (
        <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
            {/* Blurred background */}
            <div
                className="fixed inset-0 bg-cover bg-center blur-lg opacity-25 scale-105 pointer-events-none transform-gpu"
                style={{ backgroundImage: `url(${backdropUrl})` }}
            />

            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 pointer-events-none" />

            {/* Content */}
            <article className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm group"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                        <span>Home</span>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                    {/* Left column */}
                    <div className="w-full sm:w-80 md:w-96 shrink-0 mx-auto md:mx-0 space-y-6">
                        <PosterPreviewComponent
                            posterPath={movie.poster_path}
                            title={movie.title || "Movie poster"}
                            priority
                            sizes="(max-width: 768px) 100vw, 384px"
                            className="shadow-2xl"
                        />

                        <div className="bg-zinc-900/80 p-6 rounded-2xl border border-white/10 space-y-3.5 text-base">
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-zinc-400 font-medium">Status</span>
                                <span className="font-semibold text-zinc-100">{movie.status}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-zinc-400 font-medium">Budget</span>
                                <span className="font-semibold text-zinc-100">{formatCurrency(movie.budget)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-zinc-400 font-medium">Box office receipts</span>
                                <span className="font-semibold text-zinc-100">{formatCurrency(movie.revenue)}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/10 pb-2">
                                <span className="text-zinc-400 font-medium">Original language</span>
                                <span className="font-semibold text-zinc-100 uppercase">{movie.original_language}</span>
                            </div>
                            {movie.homepage && (
                                <div className="pt-2 text-center">
                                    <a
                                        href={movie.homepage}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:text-blue-300 hover:underline font-semibold text-sm break-all"
                                    >
                                        Official site ↗
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column */}
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

                        {/* Genres */}
                        {movie.genres && movie.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2.5">
                                {movie.genres.map((genre) => (
                                    <Link
                                        key={genre.id}
                                        href={`/?with_genres=${genre.id}`}
                                        className="bg-white/10 hover:bg-white/20 text-zinc-200 text-sm font-semibold px-4 py-1.5 rounded-full border border-white/10 transition-colors"
                                    >
                                        {genre.name}
                                    </Link>
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
                </div>
            </article>
        </div>
    );
};

export default MovieDetailsPage;