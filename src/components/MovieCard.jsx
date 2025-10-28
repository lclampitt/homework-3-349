// src/components/MovieCard.jsx
/* Logan Clampitt - CPSC 349-05 */

// Functional component for displaying a single movie card
export default function MovieCard({ posterPath, title, releaseDate, rating }) {
  // Base image URL for TMDB posters
  const IMG_URL = 'https://image.tmdb.org/t/p/w500';

  // Use movie poster if available, otherwise a placeholder image
  const imgSrc = posterPath
    ? `${IMG_URL}${posterPath}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="movie">
      {/* Movie poster */}
      <img src={imgSrc} alt={title} />

      {/* Movie title */}
      <h3>{title}</h3>

      {/* Release date and rating (fallback to N/A if missing) */}
      <p>Release: {releaseDate || 'N/A'}</p>
      <p>Rating: {typeof rating === 'number' && rating > 0 ? rating.toFixed(1) : 'N/A'}</p>
    </div>
  );
}
