import Image from "next/image";

type PosterPreviewProps = {
    posterPath: string | null;
    title: string;
    priority?: boolean;
    className?: string;
    sizes?: string;
};

const PosterPreviewComponent = ({
                           posterPath,
                           title,
                           priority = false,
                           className = "",
                           sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
                       }: PosterPreviewProps) => {
    const imageUrl = posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : "/placeholder.png";

    return (
        <div
            className={`relative w-full aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 ${className}`}
        >
            <Image
                src={imageUrl}
                alt={title || "Movie poster"}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
    );
};

export default PosterPreviewComponent;