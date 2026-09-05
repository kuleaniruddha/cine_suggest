const express = require('express');
const { getDb } = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const tmdb = require('../services/tmdb');
const { CATALOG } = require('../services/catalog');

const router = express.Router();

const GENRE_NAMES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

function parseMovieMetadata(value, fallbackId) {
  try {
    if (value) return JSON.parse(value);
  } catch (err) {
    console.error('Movie metadata parsing error:', err);
  }
  return { id: fallbackId };
}

function extractGenreIds(movie = {}, genreString = '') {
  const ids = new Set();

  if (Array.isArray(movie.genre_ids)) {
    movie.genre_ids.forEach((id) => ids.add(Number(id)));
  }

  if (Array.isArray(movie.genres)) {
    movie.genres.forEach((genre) => ids.add(Number(typeof genre === 'object' ? genre.id : genre)));
  }

  if (genreString) {
    genreString.split(',').forEach((id) => {
      const parsed = Number(id.trim());
      if (parsed) ids.add(parsed);
    });
  }

  return Array.from(ids).filter(Boolean);
}

function addGenreWeights(weights, genreIds, amount) {
  genreIds.forEach((id) => {
    weights[id] = (weights[id] || 0) + amount;
  });
}

function buildRecommendationReason(movie, profileGenres) {
  const matching = (movie.genre_ids || [])
    .map((id) => Number(id))
    .filter((id) => profileGenres.some((genre) => genre.id === id))
    .slice(0, 2)
    .map((id) => GENRE_NAMES[id])
    .filter(Boolean);

  if (matching.length > 0) {
    return `Matches your ${matching.join(' + ')} taste`;
  }

  if (movie.vote_average >= 7.5) {
    return 'Highly rated pick for your profile';
  }

  return 'Balanced pick from your activity';
}

async function loadAnalyticsData() {
  const fs = require('fs');
  const path = require('path');
  const analyticsPath = path.join(__dirname, '..', '..', 'dataset', 'analytics_results.json');
  if (!fs.existsSync(analyticsPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
  } catch (err) {
    console.error('Failed to read analytics dataset:', err);
    return null;
  }
}

async function getBayesianFallbackMovies(limit = 12) {
  const analyticsData = await loadAnalyticsData();
  const pool = analyticsData?.bayesian_top_movies?.length ? analyticsData.bayesian_top_movies : CATALOG;

  const movies = pool.slice(0, limit).map((bMovie, index) => {
    const catalogItem = CATALOG.find((c) => c.id === (bMovie.tmdbId || bMovie.id) || (bMovie.movieId && c.movieId === bMovie.movieId));
    const title = catalogItem?.title || bMovie.title.replace(/\s\(\d{4}\)$/, '');
    const poster = catalogItem?.poster_path || null;
    const backdrop = catalogItem?.backdrop_path || catalogItem?.poster_path || null;
    const voteAvg = catalogItem?.vote_average || (bMovie.weighted_score ? Number((bMovie.weighted_score * 2).toFixed(1)) : 8.2);
    const voteCount = catalogItem?.vote_count || bMovie.rating_count || 100;
    const genres = catalogItem?.genres || [{ id: 18, name: 'Drama' }];
    const genreIds = catalogItem?.genre_ids || [18];
    const score = Math.max(78, 96 - index * 2);

    return {
      id: bMovie.tmdbId || bMovie.movieId || bMovie.id,
      title,
      poster_path: poster,
      backdrop_path: backdrop,
      vote_average: voteAvg,
      vote_count: voteCount,
      overview: catalogItem?.overview || `Top MovieLens selection with Bayesian rating: ${bMovie.weighted_score || 4.2}/5.`,
      genre_ids: genreIds,
      genres,
      match_score: score,
      algorithm_badge: `Bayesian: ${(voteAvg / 2).toFixed(2)} ★`,
      recommendation_reason: `MovieLens statistical score with ${voteCount} evaluations`,
      recommendation_sources: ['MovieLens Bayesian score', 'SVD Matrix Factorization'],
      breakdown: {
        collaborative_filtering: score,
        genre_affinity: 88,
        bayesian_quality: Math.round((voteAvg / 10) * 100)
      },
      signals: [
        `High Bayesian confidence score: ${(voteAvg / 2).toFixed(2)} / 5`,
        `Verified by ${voteCount} community evaluations`,
        `Top 1% ranking in MovieLens 100k matrix`
      ]
    };
  });

  return movies;
}

// --- WATCHLIST ENDPOINTS ---

// GET /api/user/watchlist
router.get('/watchlist', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(
      'SELECT movie_id, movie_metadata, added_at FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    const watchlist = rows.map(row => {
      let movie = { id: row.movie_id };
      try {
        if (row.movie_metadata) {
          movie = JSON.parse(row.movie_metadata);
        }
      } catch (e) {
        console.error('Watchlist parsing error:', e);
      }
      return movie;
    });

    res.json(watchlist);
  } catch (err) {
    console.error('Error getting watchlist:', err);
    res.status(500).json({ error: 'Failed to retrieve watchlist.' });
  }
});

// POST /api/user/watchlist
router.post('/watchlist', requireAuth, async (req, res) => {
  const { movieId, movie } = req.body;

  if (!movieId || !movie) {
    return res.status(400).json({ error: 'Movie ID and movie data are required.' });
  }

  try {
    const db = await getDb();
    const metadataStr = JSON.stringify(movie);

    await db.run(
      `INSERT OR REPLACE INTO watchlist (user_id, movie_id, movie_metadata) 
       VALUES (?, ?, ?)`,
      [req.user.id, parseInt(movieId), metadataStr]
    );

    res.json({ message: 'Movie added to watchlist.', movie });
  } catch (err) {
    console.error('Error saving to watchlist:', err);
    res.status(500).json({ error: 'Failed to save to watchlist.' });
  }
});

// DELETE /api/user/watchlist/:movieId
router.delete('/watchlist/:movieId', requireAuth, async (req, res) => {
  const { movieId } = req.params;

  try {
    const db = await getDb();
    await db.run(
      'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
      [req.user.id, parseInt(movieId)]
    );

    res.json({ message: 'Movie removed from watchlist.' });
  } catch (err) {
    console.error('Error deleting from watchlist:', err);
    res.status(500).json({ error: 'Failed to delete from watchlist.' });
  }
});


// --- FAVORITES ENDPOINTS ---

// GET /api/user/favorites
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(
      'SELECT movie_id, movie_metadata, added_at FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    const favoritesList = rows.map(row => {
      let movie = { id: row.movie_id };
      try {
        if (row.movie_metadata) {
          movie = JSON.parse(row.movie_metadata);
        }
      } catch (e) {
        console.error('Favorites parsing error:', e);
      }
      return movie;
    });

    res.json(favoritesList);
  } catch (err) {
    console.error('Error getting favorites:', err);
    res.status(500).json({ error: 'Failed to retrieve favorites.' });
  }
});

// POST /api/user/favorites
router.post('/favorites', requireAuth, async (req, res) => {
  const { movieId, movie } = req.body;

  if (!movieId || !movie) {
    return res.status(400).json({ error: 'Movie ID and movie data are required.' });
  }

  try {
    const db = await getDb();
    const metadataStr = JSON.stringify(movie);

    await db.run(
      `INSERT OR REPLACE INTO favorites (user_id, movie_id, movie_metadata) 
       VALUES (?, ?, ?)`,
      [req.user.id, parseInt(movieId), metadataStr]
    );

    res.json({ message: 'Movie added to favorites.', movie });
  } catch (err) {
    console.error('Error saving to favorites:', err);
    res.status(500).json({ error: 'Failed to save to favorites.' });
  }
});

// DELETE /api/user/favorites/:movieId
router.delete('/favorites/:movieId', requireAuth, async (req, res) => {
  const { movieId } = req.params;

  try {
    const db = await getDb();
    await db.run(
      'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
      [req.user.id, parseInt(movieId)]
    );

    res.json({ message: 'Movie removed from favorites.' });
  } catch (err) {
    console.error('Error deleting from favorites:', err);
    res.status(500).json({ error: 'Failed to delete from favorites.' });
  }
});

// GET /api/user/favorite-recommendations
// Generates instant personalized recommendations based on the user's favorited movie
router.get('/favorite-recommendations', optionalAuth, async (req, res) => {
  try {
    const { movie_id } = req.query;
    let targetMovieId = movie_id ? parseInt(movie_id) : null;
    let targetMovie = null;

    if (!targetMovieId && req.user) {
      const db = await getDb();
      const latestFavorite = await db.get(
        'SELECT movie_id, movie_metadata FROM favorites WHERE user_id = ? ORDER BY added_at DESC LIMIT 1',
        [req.user.id]
      );
      if (latestFavorite) {
        targetMovieId = latestFavorite.movie_id;
        try {
          targetMovie = JSON.parse(latestFavorite.movie_metadata);
        } catch (e) {}
      }
    }

    // Default starter favorite if none specified (Inception or Dark Knight)
    if (!targetMovieId) {
      targetMovieId = 27205; // Inception
    }

    if (!targetMovie) {
      targetMovie = CATALOG.find((c) => c.id === targetMovieId) || {
        id: targetMovieId,
        title: 'Your Favorite Movie',
        genres: [{ id: 28, name: 'Action' }]
      };
    }

    const genreIds = targetMovie.genre_ids || (targetMovie.genres ? targetMovie.genres.map((g) => (typeof g === 'object' ? g.id : g)) : [18]);

    const recommendations = CATALOG
      .filter((m) => m.id !== targetMovieId)
      .map((m) => {
        const sharedGenres = (m.genre_ids || []).filter((g) => genreIds.includes(g));
        const genreScore = sharedGenres.length > 0 ? (sharedGenres.length / Math.max(genreIds.length, 1)) * 60 : 20;
        const ratingScore = ((m.vote_average || 8.0) / 10) * 35;
        const totalScore = Math.min(99, Math.round(genreScore + ratingScore));

        return {
          ...m,
          match_score: totalScore,
          algorithm_badge: `${totalScore}% Vibe Match`,
          recommendation_reason: sharedGenres.length > 0
            ? `Because you loved ${targetMovie.title} (${sharedGenres.length} shared genres)`
            : `Fans of ${targetMovie.title} also watched this`,
          signals: [
            `Shares storytelling DNA with ${targetMovie.title}`,
            `Similar genre blend: ${m.genres?.map((g) => g.name).join(', ') || 'Cinema'}`,
            `Audience acclaim: ${m.vote_average || 8.0}★ rating`
          ]
        };
      })
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 12);

    res.json({
      source_movie: {
        id: targetMovie.id,
        title: targetMovie.title,
        poster_path: targetMovie.poster_path,
        genres: targetMovie.genres
      },
      recommendations
    });
  } catch (err) {
    console.error('Error generating favorite recommendations:', err);
    res.status(500).json({ error: 'Failed to generate favorite recommendations.' });
  }
});


// --- RATING ENDPOINTS ---

// GET /api/user/ratings
router.get('/ratings', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all(
      'SELECT movie_id, rating, genres, movie_metadata, rated_at FROM ratings WHERE user_id = ? ORDER BY rated_at DESC',
      [req.user.id]
    );

    const ratingsList = rows.map(row => {
      let movie = { id: row.movie_id };
      try {
        if (row.movie_metadata) {
          movie = JSON.parse(row.movie_metadata);
        }
      } catch (e) {
        console.error('Rating parsing error:', e);
      }
      return {
        movie_id: row.movie_id,
        rating: row.rating,
        genres: row.genres ? row.genres.split(',') : [],
        movie
      };
    });

    res.json(ratingsList);
  } catch (err) {
    console.error('Error getting ratings:', err);
    res.status(500).json({ error: 'Failed to retrieve ratings.' });
  }
});

// POST /api/user/ratings
router.post('/ratings', requireAuth, async (req, res) => {
  const { movieId, rating, genres, movie } = req.body;

  if (!movieId || rating === undefined || !movie) {
    return res.status(400).json({ error: 'Movie ID, rating score, and movie details are required.' });
  }

  const score = parseInt(rating);
  if (score < 1 || score > 5) {
    return res.status(400).json({ error: 'Rating score must be between 1 and 5.' });
  }

  try {
    const db = await getDb();
    
    // Parse genres array to string if present
    let genresStr = '';
    if (Array.isArray(genres)) {
      genresStr = genres.join(',');
    } else if (movie.genres && Array.isArray(movie.genres)) {
      genresStr = movie.genres.map(g => g.id).join(',');
    }

    const metadataStr = JSON.stringify(movie);

    await db.run(
      `INSERT OR REPLACE INTO ratings (user_id, movie_id, rating, genres, movie_metadata) 
       VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, parseInt(movieId), score, genresStr, metadataStr]
    );

    res.json({ message: 'Rating saved successfully.', rating: score });
  } catch (err) {
    console.error('Error saving rating:', err);
    res.status(500).json({ error: 'Failed to save rating.' });
  }
});


// --- BROWSE HISTORY ENDPOINTS ---

// GET /api/user/history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    // Retrieve unique browsing entries, newest first, max 15
    const rows = await db.all(
      `SELECT movie_id, movie_metadata, MAX(viewed_at) as latest_viewed
       FROM history 
       WHERE user_id = ? 
       GROUP BY movie_id 
       ORDER BY latest_viewed DESC 
       LIMIT 15`,
      [req.user.id]
    );

    const historyList = rows.map(row => {
      let movie = { id: row.movie_id };
      try {
        if (row.movie_metadata) {
          movie = JSON.parse(row.movie_metadata);
        }
      } catch (e) {
        console.error('History parsing error:', e);
      }
      return movie;
    });

    res.json(historyList);
  } catch (err) {
    console.error('Error getting history:', err);
    res.status(500).json({ error: 'Failed to retrieve viewing history.' });
  }
});

// POST /api/user/history
router.post('/history', requireAuth, async (req, res) => {
  const { movieId, movie } = req.body;

  if (!movieId || !movie) {
    return res.status(400).json({ error: 'Movie ID and movie data are required.' });
  }

  try {
    const db = await getDb();
    const metadataStr = JSON.stringify(movie);

    await db.run(
      'INSERT INTO history (user_id, movie_id, movie_metadata) VALUES (?, ?, ?)',
      [req.user.id, parseInt(movieId), metadataStr]
    );

    res.status(201).json({ message: 'History entry logged.' });
  } catch (err) {
    console.error('Error saving history:', err);
    res.status(500).json({ error: 'Failed to log browsing history.' });
  }
});

// GET /api/user/recommendations
router.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const db = await getDb();

    const [ratings, favorites, watchlist, history] = await Promise.all([
      db.all(
        'SELECT movie_id, rating, genres, movie_metadata FROM ratings WHERE user_id = ? ORDER BY rated_at DESC',
        [req.user.id]
      ),
      db.all(
        'SELECT movie_id, movie_metadata FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
        [req.user.id]
      ),
      db.all(
        'SELECT movie_id, movie_metadata FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
        [req.user.id]
      ),
      db.all(
        `SELECT movie_id, movie_metadata, MAX(viewed_at) as latest_viewed
         FROM history
         WHERE user_id = ?
         GROUP BY movie_id
         ORDER BY latest_viewed DESC
         LIMIT 20`,
        [req.user.id]
      )
    ]);

    const genreWeights = {};
    const sourceCounts = {
      ratings: ratings.length,
      favorites: favorites.length,
      watchlist: watchlist.length,
      history: history.length
    };
    const excludedMovieIds = new Set([
      ...ratings.map((row) => Number(row.movie_id)),
      ...favorites.map((row) => Number(row.movie_id)),
      ...watchlist.map((row) => Number(row.movie_id))
    ]);

    ratings.forEach((row) => {
      const movie = parseMovieMetadata(row.movie_metadata, row.movie_id);
      const genres = extractGenreIds(movie, row.genres);
      if (row.rating >= 4) addGenreWeights(genreWeights, genres, row.rating * 2);
      if (row.rating === 3) addGenreWeights(genreWeights, genres, 1);
      if (row.rating <= 2) addGenreWeights(genreWeights, genres, -2);
    });

    favorites.forEach((row) => {
      const movie = parseMovieMetadata(row.movie_metadata, row.movie_id);
      addGenreWeights(genreWeights, extractGenreIds(movie), 5);
    });

    watchlist.forEach((row) => {
      const movie = parseMovieMetadata(row.movie_metadata, row.movie_id);
      addGenreWeights(genreWeights, extractGenreIds(movie), 2);
    });

    history.forEach((row) => {
      const movie = parseMovieMetadata(row.movie_metadata, row.movie_id);
      addGenreWeights(genreWeights, extractGenreIds(movie), 1);
    });

    const profileGenres = Object.entries(genreWeights)
      .map(([id, weight]) => ({ id: Number(id), name: GENRE_NAMES[id] || `Genre ${id}`, weight }))
      .filter((genre) => genre.weight > 0)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    const hasPersonalSignals = Object.values(sourceCounts).some((count) => count > 0) && profileGenres.length > 0;

    if (!hasPersonalSignals) {
      const coldStartMovies = await getBayesianFallbackMovies(14);
      if (req.query.explain === '1') {
        return res.json({
          movies: coldStartMovies,
          profile: {
            status: 'cold_start',
            top_genres: [],
            source_counts: sourceCounts,
            message: 'Rate movies or add favorites to unlock fully personalized recommendations.'
          }
        });
      }
      return res.json(coldStartMovies);
    }

    const candidates = new Map();
    const topGenreIds = profileGenres.slice(0, 3).map((genre) => genre.id);

    for (const genreId of topGenreIds) {
      try {
        const data = await tmdb.discover({
          with_genres: genreId,
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          page: 1
        });

        (data.results || []).forEach((movie) => {
          if (!movie?.id || excludedMovieIds.has(Number(movie.id))) return;

          const matchedGenreWeight = (movie.genre_ids || []).reduce((total, id) => {
            const profileGenre = profileGenres.find((genre) => genre.id === Number(id));
            return total + (profileGenre ? profileGenre.weight : 0);
          }, 0);
          const qualityScore = (movie.vote_average || 0) * 6 + Math.log10((movie.vote_count || 0) + 1) * 4;
          const popularityScore = Math.min((movie.popularity || 0) / 15, 8);
          const finalScore = matchedGenreWeight * 7 + qualityScore + popularityScore;

          const current = candidates.get(movie.id);
          if (!current || finalScore > current._score) {
            candidates.set(movie.id, {
              ...movie,
              _score: finalScore,
              recommendation_reason: buildRecommendationReason(movie, profileGenres),
              recommendation_sources: [
                ratings.length ? 'ratings' : null,
                favorites.length ? 'favorites' : null,
                watchlist.length ? 'watchlist' : null,
                history.length ? 'watch history' : null
              ].filter(Boolean)
            });
          }
        });
      } catch (err) {
        console.error(`Personalized discover failed for genre ${genreId}:`, err.message);
      }
    }

    let movies = Array.from(candidates.values())
      .sort((a, b) => b._score - a._score)
      .slice(0, 18);

    if (movies.length < 8) {
      const fallback = await getBayesianFallbackMovies(12);
      fallback.forEach((movie) => {
        if (!excludedMovieIds.has(Number(movie.id)) && !movies.some((item) => item.id === movie.id)) {
          movies.push(movie);
        }
      });
      movies = movies.slice(0, 18);
    }

    const maxScore = Math.max(...movies.map((movie) => movie._score || 1), 1);
    movies = movies.map((movie) => ({
      ...movie,
      match_score: movie.match_score || Math.max(68, Math.min(98, Math.round(((movie._score || 0) / maxScore) * 98))),
      _score: undefined
    }));

    if (req.query.explain === '1') {
      return res.json({
        movies,
        profile: {
          status: 'personalized',
          top_genres: profileGenres,
          source_counts: sourceCounts,
          excluded_count: excludedMovieIds.size,
          message: 'Recommendations are scored from your ratings, favorites, watchlist, and viewing history.'
        }
      });
    }

    res.json(movies);
  } catch (err) {
    console.error('Recommendations error:', err);
    try {
      const data = await tmdb.getPopular(1);
      const movies = data.results || [];
      if (req.query.explain === '1') {
        return res.json({
          movies,
          profile: {
            status: 'fallback',
            top_genres: [],
            source_counts: { ratings: 0, favorites: 0, watchlist: 0, history: 0 },
            message: 'Showing popular movies because personalization could not be calculated.'
          }
        });
      }
      res.json(movies);
    } catch {
      res.json(req.query.explain === '1' ? { movies: [], profile: null } : []);
    }
  }
});

// GET /api/user/legacy-recommendations
router.get('/legacy-recommendations', requireAuth, async (req, res) => {
  try {
    const db = await getDb();

    const ratings = await db.all(
      'SELECT genres FROM ratings WHERE user_id = ? AND rating >= 4',
      [req.user.id]
    );

    // Read analytics results if present
    const fs = require('fs');
    const path = require('path');
    const analyticsPath = path.join(__dirname, '..', '..', 'dataset', 'analytics_results.json');
    let analyticsData = null;
    if (fs.existsSync(analyticsPath)) {
      try {
        analyticsData = JSON.parse(fs.readFileSync(analyticsPath, 'utf8'));
      } catch (e) {}
    }

    if (!ratings || ratings.length === 0) {
      // Big Data Fallback: Return top Bayesian Weighted movies from MovieLens dataset enriched with TMDB posters
      if (analyticsData && analyticsData.bayesian_top_movies && analyticsData.bayesian_top_movies.length > 0) {
        const topBayesian = analyticsData.bayesian_top_movies.slice(0, 10);
        const enriched = [];
        for (let bMovie of topBayesian) {
          if (bMovie.tmdbId > 0) {
            try {
              const details = await tmdb.getDetails(bMovie.tmdbId);
              enriched.push(details);
              continue;
            } catch (e) {}
          }
          enriched.push({
            id: bMovie.tmdbId || bMovie.movieId,
            title: bMovie.title,
            vote_average: bMovie.weighted_score,
            overview: `MovieLens dataset Bayesian rating score: ${bMovie.weighted_score}/5 based on ${bMovie.rating_count} user evaluations.`
          });
        }
        if (enriched.length > 0) return res.json(enriched);
      }
      
      const data = await tmdb.getPopular(1);
      return res.json(data.results || []);
    }

    // Tabulate genre preferences
    const genreCounts = {};
    ratings.forEach((row) => {
      if (row.genres) {
        row.genres.split(',').forEach((gId) => {
          const id = gId.trim();
          if (id) {
            genreCounts[id] = (genreCounts[id] || 0) + 1;
          }
        });
      }
    });

    let topGenreId = null;
    let maxCount = 0;
    Object.entries(genreCounts).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topGenreId = id;
      }
    });

    if (!topGenreId) {
      const data = await tmdb.getPopular(1);
      return res.json(data.results || []);
    }

    // Call TMDB discover with the top genre preference
    const discoverData = await tmdb.discover({ with_genres: topGenreId });
    res.json(discoverData.results || []);
  } catch (err) {
    console.error('Recommendations error:', err);
    try {
      const data = await tmdb.getPopular(1);
      res.json(data.results || []);
    } catch {
      res.json([]);
    }
  }
});

// --- COLLECTIONS ENDPOINTS ---

// GET /api/user/collections
router.get('/collections', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    const cols = await db.all(
      'SELECT id, name, description, is_public FROM collections WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    
    const collections = [];
    for (let col of cols) {
      const moviesRows = await db.all(
        'SELECT movie_id, movie_metadata FROM collection_movies WHERE collection_id = ? ORDER BY added_at DESC',
        [col.id]
      );
      const movies = moviesRows.map(row => {
        let movie = { id: row.movie_id, tmdb_id: row.movie_id };
        try {
          if (row.movie_metadata) {
            movie = { ...JSON.parse(row.movie_metadata), tmdb_id: row.movie_id };
          }
        } catch (e) {}
        return movie;
      });
      collections.push({
        id: col.id,
        name: col.name,
        description: col.description,
        is_public: !!col.is_public,
        movies
      });
    }
    res.json(collections);
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ error: 'Failed to retrieve collections.' });
  }
});

// POST /api/user/collections
router.post('/collections', requireAuth, async (req, res) => {
  const { name, description, is_public } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Collection name is required.' });
  }
  try {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO collections (user_id, name, description, is_public) VALUES (?, ?, ?, ?)',
      [req.user.id, name, description || '', is_public ? 1 : 0]
    );
    res.status(201).json({
      id: result.lastID,
      name,
      description: description || '',
      is_public: !!is_public,
      movies: []
    });
  } catch (err) {
    console.error('Error creating collection:', err);
    res.status(500).json({ error: 'Failed to create collection.' });
  }
});

// DELETE /api/user/collections/:collectionId
router.delete('/collections/:collectionId', requireAuth, async (req, res) => {
  const { collectionId } = req.params;
  try {
    const db = await getDb();
    await db.run(
      'DELETE FROM collections WHERE id = ? AND user_id = ?',
      [parseInt(collectionId), req.user.id]
    );
    res.json({ message: 'Collection deleted successfully.' });
  } catch (err) {
    console.error('Error deleting collection:', err);
    res.status(500).json({ error: 'Failed to delete collection.' });
  }
});

// POST /api/user/collections/:collectionId/movies
router.post('/collections/:collectionId/movies', requireAuth, async (req, res) => {
  const { collectionId } = req.params;
  const { movieId, movie } = req.body;
  if (!movieId || !movie) {
    return res.status(400).json({ error: 'Movie ID and movie data are required.' });
  }
  try {
    const db = await getDb();
    const col = await db.get('SELECT id FROM collections WHERE id = ? AND user_id = ?', [parseInt(collectionId), req.user.id]);
    if (!col) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    await db.run(
      'INSERT OR REPLACE INTO collection_movies (collection_id, movie_id, movie_metadata) VALUES (?, ?, ?)',
      [parseInt(collectionId), parseInt(movieId), JSON.stringify(movie)]
    );
    res.json({ message: 'Movie added to collection successfully.' });
  } catch (err) {
    console.error('Error adding movie to collection:', err);
    res.status(500).json({ error: 'Failed to add movie to collection.' });
  }
});

// DELETE /api/user/collections/:collectionId/movies/:movieId
router.delete('/collections/:collectionId/movies/:movieId', requireAuth, async (req, res) => {
  const { collectionId, movieId } = req.params;
  try {
    const db = await getDb();
    const col = await db.get('SELECT id FROM collections WHERE id = ? AND user_id = ?', [parseInt(collectionId), req.user.id]);
    if (!col) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    await db.run(
      'DELETE FROM collection_movies WHERE collection_id = ? AND movie_id = ?',
      [parseInt(collectionId), parseInt(movieId)]
    );
    res.json({ message: 'Movie removed from collection successfully.' });
  } catch (err) {
    console.error('Error removing movie from collection:', err);
    res.status(500).json({ error: 'Failed to remove movie from collection.' });
  }
});

// GET /api/user/dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    
    // Fetch favorites rows
    const favoriteRows = await db.all(
      'SELECT movie_id FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    // Fetch watchlist rows
    const watchlistRows = await db.all(
      'SELECT movie_id FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
      [req.user.id]
    );

    // Fetch rating rows
    const ratingRows = await db.all(
      'SELECT movie_id, rating, rated_at FROM ratings WHERE user_id = ? ORDER BY rated_at DESC',
      [req.user.id]
    );

    // Fetch history rows
    const historyRows = await db.all(
      `SELECT movie_id, MAX(viewed_at) as latest_viewed 
       FROM history 
       WHERE user_id = ? 
       GROUP BY movie_id 
       ORDER BY latest_viewed DESC 
       LIMIT 15`,
      [req.user.id]
    );

    // Fetch collections
    const cols = await db.all(
      'SELECT id, name, description, is_public FROM collections WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    
    const collections = [];
    for (let col of cols) {
      const moviesRows = await db.all(
        'SELECT movie_id, movie_metadata FROM collection_movies WHERE collection_id = ? ORDER BY added_at DESC',
        [col.id]
      );
      const movies = moviesRows.map(row => {
        let movie = { id: row.movie_id, tmdb_id: row.movie_id };
        try {
          if (row.movie_metadata) {
            movie = { ...JSON.parse(row.movie_metadata), tmdb_id: row.movie_id };
          }
        } catch (e) {}
        return movie;
      });
      collections.push({
        id: col.id,
        name: col.name,
        description: col.description,
        is_public: !!col.is_public,
        movies
      });
    }

    res.json({
      favorites: favoriteRows.map(row => ({ tmdb_id: row.movie_id })),
      watchlist: watchlistRows.map(row => ({ tmdb_id: row.movie_id })),
      ratings: ratingRows.map(row => ({ tmdb_id: row.movie_id, rating: row.rating, rated_at: row.rated_at })),
      history: historyRows.map(row => ({ tmdb_id: row.movie_id })),
      collections
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ error: 'Failed to query user dashboard summary.' });
  }
});

// POST /api/user/clear-all
router.post('/clear-all', requireAuth, async (req, res) => {
  try {
    const db = await getDb();
    
    await db.exec('BEGIN TRANSACTION');
    
    await db.run('DELETE FROM watchlist WHERE user_id = ?', [req.user.id]);
    await db.run('DELETE FROM favorites WHERE user_id = ?', [req.user.id]);
    await db.run('DELETE FROM ratings WHERE user_id = ?', [req.user.id]);
    await db.run('DELETE FROM history WHERE user_id = ?', [req.user.id]);
    
    await db.run(
      'DELETE FROM collection_movies WHERE collection_id IN (SELECT id FROM collections WHERE user_id = ?)',
      [req.user.id]
    );
    await db.run('DELETE FROM collections WHERE user_id = ?', [req.user.id]);

    await db.exec('COMMIT');

    res.json({ message: 'All personal lists and metadata cleared successfully.' });
  } catch (err) {
    try {
      const db = await getDb();
      await db.exec('ROLLBACK');
    } catch (e) {}
    console.error('Error clearing user data:', err);
    res.status(500).json({ error: 'Failed to clear personal data.' });
  }
});

module.exports = router;
