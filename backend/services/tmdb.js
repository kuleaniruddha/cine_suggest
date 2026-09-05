const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { CATALOG } = require('./catalog');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config(); // fallback local load

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const cache = new Map();

// Circuit breaker state to prevent 10s hanging when network / ISP blocks TMDB
let tmdbOnline = true;
let circuitBreakerResetAt = 0;

function isTmdbAvailable() {
  if (!tmdbOnline) {
    if (Date.now() > circuitBreakerResetAt) {
      tmdbOnline = true; // Retry once after interval
      return true;
    }
    return false;
  }
  return true;
}

function tripCircuitBreaker() {
  tmdbOnline = false;
  circuitBreakerResetAt = Date.now() + 15 * 60 * 1000; // 15 min cool-off
  console.warn('[CineAI Engine] TMDB network connection unreachable. Activating ultra-fast local Big Data catalog fallback.');
}

const MOVIELENS_TO_TMDB_GENRES = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Children: 10751,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Fantasy: 14,
  'Film-Noir': 80,
  Horror: 27,
  IMAX: 12,
  Musical: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Sci-Fi': 878,
  Thriller: 53,
  War: 10752,
  Western: 37
};

function mapMovieLensGenres(genres = '') {
  return genres
    .split('|')
    .map((genre) => MOVIELENS_TO_TMDB_GENRES[genre])
    .filter(Boolean);
}

function mapGenreObjects(genres = '') {
  return genres
    .split('|')
    .map((name) => ({ id: MOVIELENS_TO_TMDB_GENRES[name], name: name === 'Sci-Fi' ? 'Science Fiction' : name }))
    .filter((genre) => genre.id);
}

// Load precomputed Big Data analytics dataset
const analyticsPath = path.join(__dirname, '..', '..', 'dataset', 'analytics_results.json');
let fallbackMovies = [];
try {
  if (fs.existsSync(analyticsPath)) {
    const analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
    if (analytics.bayesian_top_movies) {
      fallbackMovies = analytics.bayesian_top_movies.map((m) => {
        const tmdbId = m.tmdbId || m.movieId;
        const catalogItem = CATALOG.find((c) => c.id === tmdbId || c.movieId === m.movieId);
        const year = m.title.match(/\((\d{4})\)$/)?.[1] || '2000';

        return {
          id: tmdbId,
          movieId: m.movieId,
          title: catalogItem?.title || m.title.replace(/\s\(\d{4}\)$/, ''),
          overview: catalogItem?.overview || `MovieLens Dataset Rating: ${m.weighted_score}/5 based on ${m.rating_count} evaluations.`,
          poster_path: catalogItem?.poster_path || null,
          backdrop_path: catalogItem?.backdrop_path || catalogItem?.poster_path || null,
          vote_average: catalogItem?.vote_average || Number((m.weighted_score * 2).toFixed(1)),
          vote_count: m.rating_count,
          release_date: catalogItem?.release_date || `${year}-01-01`,
          original_language: catalogItem?.original_language || 'en',
          genre_ids: catalogItem?.genre_ids || mapMovieLensGenres(m.genres),
          genres: catalogItem?.genres || mapGenreObjects(m.genres),
          popularity: catalogItem?.popularity || 85.0
        };
      });
    }
  }
} catch (e) {
  console.error('Failed to parse fallback analytics dataset:', e);
}

// Merge all catalog movies into fallbackMovies without duplicates
CATALOG.forEach((item) => {
  if (!fallbackMovies.some((m) => m.id === item.id)) {
    fallbackMovies.push(item);
  }
});

function getCached(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }
  return cached.data;
}

function setCached(key, data, durationMs = 10 * 60 * 1000) {
  cache.set(key, {
    data,
    expires: Date.now() + durationMs
  });
}

// Fast local resolver for endpoints
function resolveLocalFallback(endpoint, queryParams = {}) {
  // Videos / trailers
  if (endpoint.includes('/videos')) {
    const movieId = parseInt(endpoint.split('/')[2]) || 1;
    const found = CATALOG.find((c) => c.id === movieId);
    return {
      results: found?.trailer
        ? [
            {
              id: `trailer-${movieId}`,
              key: found.trailer,
              name: `${found.title} - Official Trailer`,
              site: 'YouTube',
              type: 'Trailer'
            }
          ]
        : []
    };
  }

  // Credits / Cast
  if (endpoint.includes('/credits')) {
    return {
      cast: [
        { id: 1, name: 'Lead Cast Member', character: 'Protagonist' },
        { id: 2, name: 'Supporting Cast Member', character: 'Deuteragonist' }
      ]
    };
  }

  // Watch providers
  if (endpoint.includes('/watch/providers')) {
    return { results: {} };
  }

  // Similar movies
  if (endpoint.includes('/similar')) {
    const movieId = parseInt(endpoint.split('/')[2]) || 1;
    const current = CATALOG.find((c) => c.id === movieId);
    let similar = fallbackMovies.filter((m) => m.id !== movieId);
    if (current?.genre_ids?.length) {
      similar = similar.filter((m) => m.genre_ids.some((g) => current.genre_ids.includes(g)));
    }
    return {
      page: 1,
      results: similar.slice(0, 12)
    };
  }

  // Single movie details
  if (
    endpoint.includes('/movie/') &&
    !endpoint.includes('popular') &&
    !endpoint.includes('trending') &&
    !endpoint.includes('discover') &&
    !endpoint.includes('top_rated') &&
    !endpoint.includes('upcoming') &&
    !endpoint.includes('now_playing')
  ) {
    const movieId = parseInt(endpoint.split('/')[2]) || 1;
    const found = fallbackMovies.find((m) => m.id === movieId);
    if (found) return found;

    return {
      id: movieId,
      title: 'Featured Movie Selection',
      overview: 'A top rated movie selection from the MovieLens Big Data dataset.',
      poster_path: null,
      backdrop_path: null,
      vote_average: 8.2,
      vote_count: 500,
      release_date: '2022-01-01',
      genres: [{ id: 18, name: 'Drama' }]
    };
  }

  // Search
  if (endpoint.includes('/search')) {
    const q = (queryParams.query || '').toLowerCase().trim();
    if (!q) return { page: 1, results: [], total_pages: 1, total_results: 0 };

    const matched = fallbackMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        (m.original_title && m.original_title.toLowerCase().includes(q)) ||
        (m.genres && m.genres.some((g) => g.name.toLowerCase().includes(q)))
    );

    return {
      page: 1,
      results: matched.slice(0, 20),
      total_pages: 1,
      total_results: matched.length
    };
  }

  // Discover with language or genre filters
  if (endpoint.includes('/discover')) {
    let results = [...fallbackMovies];

    if (queryParams.with_original_language) {
      const lang = queryParams.with_original_language;
      results = results.filter((m) => m.original_language === lang);
      // If fewer than 4 results, fill with top movies
      if (results.length === 0) {
        results = fallbackMovies.slice(0, 8);
      }
    }

    if (queryParams.with_genres) {
      const genreId = Number(queryParams.with_genres);
      results = results.filter((m) => m.genre_ids.includes(genreId));
      if (results.length === 0) {
        results = fallbackMovies.slice(0, 8);
      }
    }

    return {
      page: 1,
      results: results.slice(0, 20),
      total_pages: 1,
      total_results: results.length
    };
  }

  // Top rated / Trending / Popular
  if (endpoint.includes('top_rated')) {
    const sorted = [...fallbackMovies].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    return { page: 1, results: sorted.slice(0, 20), total_pages: 1, total_results: sorted.length };
  }

  if (endpoint.includes('upcoming') || endpoint.includes('now_playing')) {
    const recent = [...fallbackMovies].sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    return { page: 1, results: recent.slice(0, 20), total_pages: 1, total_results: recent.length };
  }

  // Default popular / trending
  return {
    page: 1,
    results: fallbackMovies.slice(0, 20),
    total_pages: 1,
    total_results: fallbackMovies.length
  };
}

async function fetchFromTMDB(endpoint, queryParams = {}) {
  const apiKey = process.env.TMDB_API_KEY || '3fd2be6906771619919ea10891973601';

  const params = new URLSearchParams({
    api_key: apiKey,
    ...queryParams
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${params.toString()}`;
  const cachedData = getCached(url);
  if (cachedData) {
    return cachedData;
  }

  // If circuit breaker is tripped, return local data instantly without waiting
  if (!isTmdbAvailable()) {
    return resolveLocalFallback(endpoint, queryParams);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500); // Strict 1.5s timeout!

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        tripCircuitBreaker();
      }
      throw new Error(`TMDB status ${response.status}`);
    }

    const data = await response.json();
    setCached(url, data);
    return data;
  } catch (err) {
    // Timeout or network unreachable: trip circuit breaker immediately
    tripCircuitBreaker();
    return resolveLocalFallback(endpoint, queryParams);
  }
}

module.exports = {
  fetchFromTMDB,
  CATALOG,
  fallbackMovies,
  discover: (params) => fetchFromTMDB('/discover/movie', params),
  getDetails: (id) => fetchFromTMDB(`/movie/${id}`),
  getCredits: (id) => fetchFromTMDB(`/movie/${id}/credits`),
  getVideos: (id) => fetchFromTMDB(`/movie/${id}/videos`),
  getSimilar: (id) => fetchFromTMDB(`/movie/${id}/similar`),
  getWatchProviders: (id) => fetchFromTMDB(`/movie/${id}/watch/providers`),
  getPopular: (page = 1) => fetchFromTMDB('/movie/popular', { page }),
  getTrending: (page = 1) => fetchFromTMDB('/trending/movie/day', { page }),
  getTrendingWeek: (page = 1) => fetchFromTMDB('/trending/movie/week', { page }),
  getNowPlaying: (page = 1) => fetchFromTMDB('/movie/now_playing', { page }),
  getUpcoming: (page = 1) => fetchFromTMDB('/movie/upcoming', { page }),
  getTopRated: (page = 1) => fetchFromTMDB('/movie/top_rated', { page }),
  search: (query, page = 1) => fetchFromTMDB('/search/movie', { query, page })
};
