'use client';

import { type FormEvent, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchMoviesApi } from "@/services/movies.api";
import type { IMovie } from "@/models/IMovie";

const SearchInputComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<IMovie[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Синхронізація з URL: якщо параметру query немає (наприклад, перейшли на Головну), інпут очищається
    useEffect(() => {
        const urlQuery = searchParams.get("query");
        if (!urlQuery) {
            setSearchQuery("");
        }
    }, [searchParams]);

    // Live-search підказки з затримкою 300ms
    useEffect(() => {
        const query = searchQuery.trim();

        if (!query) {
            setSuggestions([]);
            setIsOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const data = await searchMoviesApi(query, 1);
                setSuggestions(data.results ? data.results.slice(0, 5) : []);
                setIsOpen(true);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Закриття випадаючого списку при кліку поза ним
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e?: FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = searchQuery.trim();

        if (trimmed) {
            router.push(`/?query=${encodeURIComponent(trimmed)}`);
        } else {
            router.push("/");
        }

        // Очищаємо інпут та закриваємо підказки після відправки
        setSearchQuery("");
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full md:w-80 lg:w-96">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.trim() && setIsOpen(true)}
                    placeholder="Search movies..."
                    className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 text-white placeholder-zinc-400 rounded-xl border border-white/15 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-inner"
                />
                <button
                    type="submit"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-base border-none bg-transparent cursor-pointer"
                >
                    🔍
                </button>
            </form>

            {/* Выпадающий список с подсказками */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-xs text-zinc-400 animate-pulse">
                            Searching...
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="divide-y divide-white/5">
                            {suggestions.map((movie) => {
                                const poster = movie.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                                    : null;

                                return (
                                    <Link
                                        key={movie.id}
                                        href={`/movie/${movie.id}`}
                                        onClick={() => {
                                            setIsOpen(false);
                                            setSearchQuery(""); // Очищаем инпут при клике на фильм
                                        }}
                                        className="flex items-center gap-3 p-2.5 hover:bg-zinc-800 transition-colors group"
                                    >
                                        {poster ? (
                                            <Image
                                                src={poster}
                                                alt={movie.title}
                                                width={36}
                                                height={48}
                                                priority
                                                className="w-9 h-12 object-cover rounded-md shrink-0 border border-white/10"
                                            />
                                        ) : (
                                            <div className="w-9 h-12 bg-zinc-800 rounded-md border border-white/10 flex items-center justify-center text-[10px] text-zinc-500 text-center">
                                                No Img
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                                {movie.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                                                {movie.release_date && (
                                                    <span>{movie.release_date.split("-")[0]}</span>
                                                )}
                                                {movie.vote_average > 0 && (
                                                    <span className="text-amber-400">
                                                        ★ {movie.vote_average.toFixed(1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => handleSearch()}
                                className="w-full py-2.5 text-center text-xs font-semibold text-blue-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                            >
                                See all results for "{searchQuery}"
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-xs text-zinc-400">
                            No movies found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchInputComponent;