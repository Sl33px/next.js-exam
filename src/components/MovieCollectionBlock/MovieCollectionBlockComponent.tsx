'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICollectionMovie, Parts } from "@/models/ICollectionMovie";

type MovieCollectionBlockProps = {
    collectionInfo: {
        id: number;
        name: string;
        poster_path?: string;
    };
};

const MovieCollectionBlockComponent = ({ collectionInfo }: MovieCollectionBlockProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [collectionData, setCollectionData] = useState<ICollectionMovie | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsOpen((prev) => !prev);

        if (!collectionData && !isLoading) {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/movies/collection/${collectionInfo.id}`);
                if (!response.ok) throw new Error("Failed to fetch collection");

                const data = await response.json();
                setCollectionData(data);
            } catch (error) {
                console.error("Failed to fetch collection:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="bg-zinc-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300">
            <button
                type="button"
                onClick={handleToggle}
                className="w-full p-5 flex items-center justify-between gap-4 hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
            >
                <div className="flex items-center gap-4">
                    {collectionInfo.poster_path && (
                        <div className="relative w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-white/10">
                            <Image
                                src={`https://image.tmdb.org/t/p/w200${collectionInfo.poster_path}`}
                                alt={collectionInfo.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div>
                        <span className="text-xs text-blue-400 font-semibold tracking-wide uppercase block">
                            Part of the franchise
                        </span>
                        <h3 className="font-bold text-lg text-white mt-0.5">
                            {collectionInfo.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                            {isOpen ? "Click to collapse" : "Click to view all movies"}
                        </p>
                    </div>
                </div>

                <div
                    className="text-zinc-400 text-xl font-bold pr-2 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                    ▼
                </div>
            </button>

            {isOpen && (
                <div className="border-t border-white/10 bg-black/40 p-4 space-y-3">
                    {isLoading ? (
                        <p className="text-center text-zinc-400 py-4 animate-pulse text-sm">
                            Loading franchise parts...
                        </p>
                    ) : collectionData?.parts && collectionData.parts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                            {collectionData.parts
                                .slice()
                                .sort(
                                    (a, b) =>
                                        new Date(a.release_date).getTime() -
                                        new Date(b.release_date).getTime()
                                )
                                .map((part: Parts) => {
                                    const partPoster = part.poster_path
                                        ? `https://image.tmdb.org/t/p/w92${part.poster_path}`
                                        : "/placeholder.png";

                                    return (
                                        <Link
                                            key={part.id}
                                            href={`/movie/${part.id}`}
                                            className="group flex items-center gap-3 p-2.5 bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200"
                                        >
                                            <div className="relative w-12 h-16 shrink-0 rounded-lg overflow-hidden border border-white/5 group-hover:scale-105 transition-transform">
                                                <Image
                                                    src={partPoster}
                                                    alt={part.name || part.original_name || "Movie poster"}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                                                    {part.name || part.original_name}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                                                    {part.release_date && (
                                                        <span>📅 {part.release_date.split("-")[0]}</span>
                                                    )}
                                                    {part.vote_average > 0 && (
                                                        <span className="text-amber-400 font-medium">
                                                            ★ {part.vote_average.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                        </div>
                    ) : (
                        <p className="text-center text-zinc-500 py-3 text-sm">
                            No parts found.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieCollectionBlockComponent;