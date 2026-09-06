'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { IMovie } from "@/models/IMovie";
import MoviesListCardComponent from "../MoviesListCard/MoviesListCardComponent";
import type {IMovieGenre} from "@/models/IMovieGenre";

type Props = {
    upcomingMovies: IMovie[];
    genres?: IMovieGenre[];
};

const UpcomingMoviesComponent = ({ upcomingMovies, genres = [] }: Props) => {
    if (!upcomingMovies || upcomingMovies.length === 0) return null;
    const genresMap = new Map(genres.map((g) => [g.id, g.name]));

    return (
        <section className="my-8 px-4 md:px-8 w-full max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                    Coming Soon
                </h2>
            </div>

            <Swiper
                spaceBetween={16}
                slidesPerView={2}
                breakpoints={{
                    480: { slidesPerView: 3, spaceBetween: 16 },
                    768: { slidesPerView: 4, spaceBetween: 20 },
                    1024: { slidesPerView: 5, spaceBetween: 20 },
                    1280: { slidesPerView: 6, spaceBetween: 24 },
                }}
            >
                {upcomingMovies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <MoviesListCardComponent movie={movie} genres={genres}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default UpcomingMoviesComponent;