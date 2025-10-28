// src/components/MovieCard.jsx
/* Logan Clampitt - CPSC 349-05 */
export default function MovieCard({ posterPath, title, releaseDate, rating }) {
  const IMG_URL = 'https://image.tmdb.org/t/p/w500';
  const imgSrc = posterPath ? `${IMG_URL}${posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <div className="movie">
      <img src={imgSrc} alt={title} />
      <h3>{title}</h3>
      <p>Release: {releaseDate || 'N/A'}</p>
      <p>Rating: {typeof rating === 'number' && rating > 0 ? rating.toFixed(1) : 'N/A'}</p>
    </div>
  );
}