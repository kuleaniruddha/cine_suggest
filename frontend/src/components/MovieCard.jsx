import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Bookmark, Star, Film, Sparkles } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { user, isFavorite, addFavorite, removeFavorite, inWatchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const [imageError, setImageError] = useState(false);

  const tmdbId = movie.id;
  const rating = movie.vote_average || 0;
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const matchScore = movie.match_score;
  const recReason = movie.recommendation_reason;

  const handleCardClick = () => {
    navigate(`/movie/${tmdbId}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (isFavorite(tmdbId)) {
      await removeFavorite(tmdbId);
    } else {
      await addFavorite(movie);
    }
  };

  const handleWatchlistClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (inWatchlist(tmdbId)) {
      await removeFromWatchlist(tmdbId);
    } else {
      await addToWatchlist(movie);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex-shrink-0 w-36 sm:w-44 md:w-48 bg-bg-card rounded-md overflow-hidden shadow-md hover:shadow-xl hover:scale-105 border border-white/5 hover:border-brand-red/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        {movie.poster_path && !imageError ? (
          <img
            src={
              movie.poster_path.startsWith('http')
                ? movie.poster_path
                : `https://image.tmdb.org/t/p/w342${movie.poster_path.startsWith('/') ? '' : '/'}${movie.poster_path}`
            }
            alt={movie.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex flex-col justify-between p-3.5 border-b border-white/5 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-red/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Top header badge */}
            <div className="flex items-center justify-between z-10">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-sm">
                {movie.genres?.[0]?.name || (movie.genre_ids?.[0] ? 'Featured' : 'Movie')}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 font-semibold">{releaseYear}</span>
            </div>

            {/* Center stylized title */}
            <div className="my-auto text-center z-10 px-1 py-3">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-red shadow-inner">
                <Film className="w-4 h-4" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-white line-clamp-3 leading-snug tracking-tight">
                {movie.title}
              </h3>
            </div>

            {/* Bottom rating footer */}
            <div className="flex items-center justify-between z-10 pt-1 border-t border-white/10 text-[10px]">
              <span className="text-neutral-500 font-semibold uppercase tracking-wider">CineAI Pick</span>
              {rating > 0 && (
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hover overlay actions */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          <div className="flex justify-between items-start gap-2 w-full">
            {matchScore ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                {matchScore}% Match
              </span>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                onClick={handleFavoriteClick}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${isFavorite(tmdbId) ? 'bg-brand-red text-white' : 'bg-black/45 hover:bg-neutral-800 text-neutral-300'}`}
                title={isFavorite(tmdbId) ? 'Remove Favorite' : 'Add Favorite'}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={handleWatchlistClick}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${inWatchlist(tmdbId) ? 'bg-amber-500 text-black' : 'bg-black/45 hover:bg-neutral-800 text-neutral-300'}`}
                title={inWatchlist(tmdbId) ? 'Remove Watchlist' : 'Add Watchlist'}
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {recReason && (
              <div className="flex items-start gap-1 text-[9px] text-brand-red font-bold leading-normal mb-1.5">
                <Sparkles className="w-2.5 h-2.5 text-brand-red fill-current mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{recReason}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-white">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
            </div>
            <div className="text-[10px] text-neutral-300 font-medium">Released: {releaseYear}</div>
          </div>
        </div>
      </div>

      {/* Meta text below image (visible when not hovered) */}
      <div className="p-3 space-y-1">
        <h4 className="text-xs sm:text-sm font-semibold truncate text-white leading-normal">{movie.title}</h4>
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-neutral-400">
          <span>{releaseYear}</span>
          {rating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        {movie.algorithm_badge && (
          <div className="pt-1">
            <span className="inline-block px-1.5 py-0.5 rounded bg-brand-red/15 text-brand-red border border-brand-red/30 text-[9px] font-extrabold truncate max-w-full">
              {movie.algorithm_badge}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
