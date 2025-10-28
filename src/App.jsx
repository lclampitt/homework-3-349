// src/App.jsx
import { useEffect, useState } from 'react';
import MovieCard from './components/MovieCard'; // component for displaying individual movies

const BASE_URL = 'https://api.themoviedb.org/3'; // TMDB base API URL

export default function App() {
  // === State Variables ===
  const [movies, setMovies] = useState([]);           // list of movies to display
  const [currentPage, setCurrentPage] = useState(1);  // current page number
  const [totalPages, setTotalPages] = useState(1);    // total pages available
  const [query, setQuery] = useState('');             // search input value
  const [sort, setSort] = useState('popularity.desc'); // sorting type
  const [loading, setLoading] = useState(false);      // loading indicator
  const [error, setError] = useState('');             // error message state

  // TMDB API key (uses .env if available, fallback key otherwise)
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'fa0f5bf822a32bcc3c343178a64e12ac';

  // === Build API URL based on user actions (sort/search/page) ===
  const buildUrl = () => {
    // default: discover popular movies
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${currentPage}&sort_by=${sort}`;

    // filter out movies with few votes when sorting by rating
    if (sort.includes('vote_average')) url += '&vote_count.gte=50';

    // use search endpoint if user is typing
    if (query.trim()) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}&page=${currentPage}`;
    }

    return url;
  };

  // === Fetch Movies from TMDB API ===
  useEffect(() => {
    let ignore = false; // helps cancel state updates if component unmounts

    async function run() {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(buildUrl()); // fetch data from TMDB
        const data = await res.json();

        if (!ignore) {
          // update movies and pagination info
          setMovies(Array.isArray(data.results) ? data.results : []);
          setTotalPages(data.total_pages || 1);
        }
      } catch (e) {
        if (!ignore) setError('Failed to load movies.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run(); // execute API call
    return () => { ignore = true; }; // cleanup
  }, [currentPage, sort, query]); // refetch when these values change

  // === Pagination Handlers ===
  const prev = () => setCurrentPage(p => Math.max(1, p - 1));
  const next = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // === JSX UI ===
  return (
    <>
      {/* ===== Header ===== */}
      <header>
        <h1>Movie Explorer</h1>

        {/* Search + Sort Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={e => { setQuery(e.target.value); setCurrentPage(1); }} // reset to page 1 when searching
          />

          <select
            value={sort}
            onChange={e => { setSort(e.target.value || 'popularity.desc'); setQuery(''); setCurrentPage(1); }} // update sort, clear search
          >
            <option value="">Sort By</option>
            <option value="release_date.asc">Release Date (Asc)</option>
            <option value="release_date.desc">Release Date (Desc)</option>
            <option value="vote_average.asc">Rating (Asc)</option>
            <option value="vote_average.desc">Rating (Desc)</option>
          </select>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main id="movieContainer">
        {/* Conditional rendering for loading/error/empty states */}
        {loading && <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Loading...</p>}
        {error && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'crimson' }}>{error}</p>}
        {!loading && !error && movies.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No movies found.</p>
        )}

        {/* Render all movies as MovieCard components */}
        {movies.map(m => (
          <MovieCard
            key={m.id}
            posterPath={m.poster_path}
            title={m.title}
            releaseDate={m.release_date}
            rating={m.vote_average}
          />
        ))}
      </main>

      {/* ===== Footer ===== */}
      <footer>
        <button onClick={prev} disabled={currentPage <= 1}>Previous</button>
        <span id="pageInfo">Page {currentPage} of {totalPages}</span>
        <button onClick={next} disabled={currentPage >= totalPages}>Next</button>
      </footer>
    </>
  );
}
