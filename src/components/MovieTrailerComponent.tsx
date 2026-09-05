import {Results} from "@/models/IMovieVideo";
import {getMovieVideos} from "@/services/movies.api";

type MovieTrailerProps = {
    movieId: number;
};

const MovieTrailerComponent = async ({ movieId }: MovieTrailerProps) => {
    let trailerKey: string | null = null;

    try {
        const videos: Results[] = await getMovieVideos(movieId);

        // 1. looking for the official trailer from YouTube
        // 2. if there is no official one, we take any Trailer
        // 3. if there is no Trailer, we take the first available video
        const video =
            videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
            videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
            videos[0];

        if (video) {
            trailerKey = video.key;
        }
    } catch (error) {
        console.error("Error fetching movie videos:", error);
    }

    if (!trailerKey) return null;

    return (
        <div className="pt-6 border-t border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white">Trailer</h2>
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Movie Trailer"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default MovieTrailerComponent;