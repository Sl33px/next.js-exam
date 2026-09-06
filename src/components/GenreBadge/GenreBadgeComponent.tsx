'use client';

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

type GenreBadgeProps = {
    genreId: number | string;
    genreName?: string;
};

const GenreBadgeComponent = ({ genreId, genreName }: GenreBadgeProps) => {
    const router = useRouter();

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/?with_genres=${genreId}&page=1`);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="px-2 py-0.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 rounded-md text-[11px] font-medium transition-colors cursor-pointer inline-block relative z-10"
        >
            {genreName || `Genre #${genreId}`}
        </button>
    );
};

export default GenreBadgeComponent;