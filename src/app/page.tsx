import {getAllMovies, getAllUpcomingMovies, getMovieGenres, searchMoviesApi} from "@/services/movies.api";
import MoviesListComponent from "@/components/MoviesListComponent";
import UpcomingMoviesComponent from "@/components/UpcomingMoviesComponent";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    with_genres?: string;
    sort_by?: string;
    query?: string;
  }>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  // getting paarms from url
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const genreId = params.with_genres || "";
  const sortBy = params.sort_by || "popularity.desc";
  const query = params.query || "";

  // loading data from server
  const genresPromise = getMovieGenres();
  const upcomingMoviesPromise = getAllUpcomingMovies()
  const moviesPromise = query
      ? searchMoviesApi(query, page)
      : getAllMovies(page, genreId, sortBy);

  const [genres, upcomingMovies, moviesData] = await Promise.all([genresPromise, upcomingMoviesPromise, moviesPromise]);

  return (
      <main>
        <UpcomingMoviesComponent upcomingMovies={upcomingMovies} genres={genres} />
        <MoviesListComponent
            movies={moviesData.results}
            totalPages={moviesData.total_pages}
            genres={genres}
            currentPage={page}
            currentGenre={genreId}
            currentSort={sortBy}
            currentQuery={query}
        />
      </main>
  );
};

export default HomePage;