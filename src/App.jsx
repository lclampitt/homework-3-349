// src/App.jsx
import { useEffect, useState } from 'react';
import MovieCard from './components/MovieCard';

const BASE_URL = 'https://api.themoviedb.org/3';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popularity.desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'fa0f5bf822a32bcc3c343178a64e12ac';

  const buildUrl = () => {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${currentPage}&sort_by=${sort}`;
    if (sort.includes('vote_average')) url += '&vote_count.gte=50';
    if (query.trim()) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}&page=${currentPage}`;
    }
    return url;
  };

  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(buildUrl());
        const data = await res.json();
        if (!ignore) {
          setMovies(Array.isArray(data.results) ? data.results : []);
          setTotalPages(data.total_pages || 1);
        }
      } catch (e) {
        if (!ignore) setError('Failed to load movies.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => { ignore = true; };
  }, [currentPage, sort, query]);

  const prev = () => setCurrentPage(p => Math.max(1, p - 1));
  const next = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <>
      <header>
        <h1>Movie Explorer</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={e => { setQuery(e.target.value); setCurrentPage(1); }}
          />
          <select value={sort} onChange={e => { setSort(e.target.value || 'popularity.desc'); setQuery(''); setCurrentPage(1); }}>
            <option value="">Sort By</option>
            <option value="release_date.asc">Release Date (Asc)</option>
            <option value="release_date.desc">Release Date (Desc)</option>
            <option value="vote_average.asc">Rating (Asc)</option>
            <option value="vote_average.desc">Rating (Desc)</option>
          </select>
        </div>
      </header>

      <main id="movieContainer">
        {loading && <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Loading...</p>}
        {error && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'crimson' }}>{error}</p>}
        {!loading && !error && movies.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No movies found.</p>
        )}
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

      <footer>
        <button onClick={prev} disabled={currentPage <= 1}>Previous</button>
        <span id="pageInfo">Page {currentPage} of {totalPages}</span>
        <button onClick={next} disabled={currentPage >= totalPages}>Next</button>
      </footer>
    </>
  );
}
