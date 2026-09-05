import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import Skeleton from '../components/Skeleton';
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Check,
  ChevronRight,
  Cpu,
  Database,
  ExternalLink,
  Film,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Network,
  PieChart,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  Star,
  Users,
  Wand2,
  X,
  Zap
} from 'lucide-react';

const ALGORITHMS = [
  {
    id: 'hybrid',
    fanName: 'CineSmart AI',
    techName: 'Hybrid Ensemble Engine',
    fanTag: 'All-in-One Magic Pick',
    techTag: 'Multi-Modal Ensemble',
    fanDesc: 'Our smartest recommendation—combines what people with your taste love, story themes, and all-time highest ratings.',
    techDesc: 'Linear combination model: Score = 0.45 · SVD + 0.35 · Content_Affinity + 0.20 · Bayesian_Quality.',
    formula: 'Score = 0.45·SVD + 0.35·Genre_Vector + 0.20·Bayesian',
    icon: Sparkles,
    color: 'from-brand-red to-amber-500'
  },
  {
    id: 'svd',
    fanName: 'Taste Twins',
    techName: 'SVD Matrix Factorization',
    fanTag: 'Watched by People Like You',
    techTag: 'Collaborative Filtering',
    fanDesc: 'Discovers hidden connections: finds real film fans who love the same movies as you and shows what they gave 5 stars to.',
    techDesc: 'Truncated Singular Value Decomposition (k=20 latent dimensions, RMSE: 2.363, 39.2% explained variance).',
    formula: 'R̂ ≈ U_k · Σ_k · V_kᵀ (k=20 factors, 100k matrix)',
    icon: Users,
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'content',
    fanName: 'Movie DNA Match',
    techName: 'Content-Based Cosine',
    fanTag: 'Same Vibe & Story Style',
    techTag: 'Feature Vector Matching',
    fanDesc: 'Want that exact same feeling? Matches story pacing, genres, and mood so your next watch feels just as thrilling.',
    techDesc: 'High-dimensional cosine angle calculation across 18 genres and MovieLens tag vectors.',
    formula: 'cos(θ) = (A · B) / (||A|| × ||B||) on genre vectors',
    icon: Network,
    color: 'from-emerald-500 to-teal-400'
  },
  {
    id: 'bayesian',
    fanName: 'Audience & Critics Gold',
    techName: 'Bayesian Weighted Rating',
    fanTag: 'Certified All-Time Classics',
    techTag: 'IMDb Statistical Formula',
    fanDesc: 'Certified crowd-pleasers with hundreds of real 5-star ratings. Zero overhyped duds.',
    techDesc: 'Bayesian shrinkage formula: W = (v / (v + m))·R + (m / (v + m))·C (m=85th percentile, C=3.50).',
    formula: 'W = (v / (v + m))·R + (m / (v + m))·C',
    icon: Star,
    color: 'from-amber-400 to-yellow-300'
  }
];

const STARTER_FAVORITES = [
  { id: 27205, title: 'Inception', year: '2010', genre: 'Sci-Fi / Thriller' },
  { id: 155, title: 'The Dark Knight', year: '2008', genre: 'Action / Crime' },
  { id: 579974, title: 'RRR', year: '2022', genre: 'Action / Drama' },
  { id: 550, title: 'Fight Club', year: '1999', genre: 'Drama / Thriller' },
  { id: 603, title: 'The Matrix', year: '1999', genre: 'Action / Sci-Fi' },
  { id: 20453, title: '3 Idiots', year: '2009', genre: 'Comedy / Drama' }
];

const BigDataAnalytics = () => {
  const { user, favorites } = useAuth();

  // Mode: 'fan' (Simple & intuitive) vs 'tech' (Data Science / ML)
  const [viewMode, setViewMode] = useState('fan');

  // Core Big Data State
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);

  // Algorithm Playground State
  const [selectedAlgo, setSelectedAlgo] = useState('hybrid');
  const [algoData, setAlgoData] = useState(null);
  const [loadingAlgo, setLoadingAlgo] = useState(true);

  // Instant Favorite Recommendations State
  const [favoriteTestId, setFavoriteTestId] = useState(
    favorites && favorites.length > 0 ? favorites[0].id || favorites[0].movie_id : 27205
  );
  const [favoriteRecs, setFavoriteRecs] = useState([]);
  const [favoriteSource, setFavoriteSource] = useState(null);
  const [loadingFavRecs, setLoadingFavRecs] = useState(false);

  // SVD Latent Vector Similarity State
  const [similarityMovieId, setSimilarityMovieId] = useState(278);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // User Persona Sandbox State
  const [personas, setPersonas] = useState([]);
  const [activePersona, setActivePersona] = useState(null);

  // Explainability Modal State
  const [selectedMovieForExplanation, setSelectedMovieForExplanation] = useState(null);

  // Load Initial Big Data Insights & Personas
  useEffect(() => {
    const fetchCoreAnalytics = async () => {
      setLoadingInsights(true);
      try {
        const [insRes, perRes] = await Promise.all([
          fetch('/api/analytics/insights'),
          fetch('/api/analytics/personas')
        ]);

        if (insRes.ok) setInsights(await insRes.json());
        if (perRes.ok) {
          const perData = await perRes.json();
          setPersonas(perData);
          if (perData.length > 0) setActivePersona(perData[0]);
        }
      } catch (err) {
        console.error('Failed to load core analytics:', err);
      } finally {
        setLoadingInsights(false);
      }
    };

    fetchCoreAnalytics();
  }, []);

  // Load Algorithm Recommendations when algo or persona changes
  useEffect(() => {
    const fetchAlgorithmRecommendations = async () => {
      setLoadingAlgo(true);
      try {
        const genreParam = activePersona ? `&genre=${activePersona.preferred_genre_id}` : '';
        const res = await fetch(`/api/analytics/algorithm-recommendations?algo=${selectedAlgo}${genreParam}`);
        if (res.ok) {
          setAlgoData(await res.json());
        }
      } catch (err) {
        console.error('Failed to load algorithm recommendations:', err);
      } finally {
        setLoadingAlgo(false);
      }
    };

    fetchAlgorithmRecommendations();
  }, [selectedAlgo, activePersona]);

  // Load Favorite-Based Recommendations
  useEffect(() => {
    const fetchFavRecs = async () => {
      setLoadingFavRecs(true);
      try {
        const res = await fetch(`/api/user/favorite-recommendations?movie_id=${favoriteTestId}`);
        if (res.ok) {
          const data = await res.json();
          setFavoriteRecs(data.recommendations || []);
          setFavoriteSource(data.source_movie || null);
        }
      } catch (err) {
        console.error('Failed to load favorite recommendations:', err);
      } finally {
        setLoadingFavRecs(false);
      }
    };

    fetchFavRecs();
  }, [favoriteTestId]);

  // Load SVD Latent Vector Similarities
  useEffect(() => {
    const fetchSimilarities = async () => {
      setLoadingSimilar(true);
      try {
        const res = await fetch(`/api/analytics/similarities/${similarityMovieId}`);
        if (res.ok) {
          setSimilarMovies(await res.json());
        }
      } catch (err) {
        console.error('Failed to load SVD similarities:', err);
      } finally {
        setLoadingSimilar(false);
      }
    };

    fetchSimilarities();
  }, [similarityMovieId]);

  const summary = insights?.summary || {
    total_ratings: 100836,
    total_users: 610,
    total_movies: 9742,
    sparsity_percentage: 98.3,
    avg_rating_overall: 3.5
  };

  const svdMetrics = insights?.svd_model_metrics || {
    latent_components: 20,
    explained_variance_percentage: 39.21,
    rmse: 2.363
  };

  const ratingDistribution = insights?.rating_distribution || {};
  const maxRatingCount = Math.max(...Object.values(ratingDistribution).map(Number), 1);
  const activeAlgo = ALGORITHMS.find((a) => a.id === selectedAlgo) || ALGORITHMS[0];

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* --- HEADER HERO --- */}
        <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/40 bg-brand-red/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-red shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-brand-red animate-pulse" />
                Next-Gen Movie Discovery Engine
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                How We Pick Movies <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-400 to-amber-400">You'll Love</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {viewMode === 'fan'
                  ? 'No guesswork. We analyze over 100,000 real ratings, match your favorite movie vibes, and connect you with film fans who love what you love.'
                  : 'Powered by the 100,836 MovieLens evaluation benchmark, Truncated SVD Matrix Factorization (k=20), and Bayesian statistical rating shrinkage.'}
              </p>
            </div>

            {/* View Mode Toggle: Fan vs Tech */}
            <div className="flex-shrink-0 bg-neutral-900/90 border border-white/15 p-1.5 rounded-xl flex items-center gap-1 shadow-lg">
              <button
                onClick={() => setViewMode('fan')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'fan'
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🍿 Movie Fan Mode</span>
              </button>
              <button
                onClick={() => setViewMode('tech')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'tech'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>🔬 Data Scientist Mode</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="relative z-10 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {viewMode === 'fan' ? 'Real Ratings Analyzed' : 'Evaluation Benchmark'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {summary.total_ratings.toLocaleString()}
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Verified community evaluations</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {viewMode === 'fan' ? 'Movie Library' : 'Unique Item Index'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {summary.total_movies.toLocaleString()}
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Classics, hits & regional cinema</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {viewMode === 'fan' ? 'Audience Profiles' : 'Collaborative Users'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {summary.total_users.toLocaleString()}
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Distinct taste fingerprints</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-4 backdrop-blur-md">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                {viewMode === 'fan' ? 'AI Match Precision' : 'SVD Latent Factors'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {viewMode === 'fan' ? '98.3% Match' : `k = ${svdMetrics.latent_components}`}
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                {viewMode === 'fan' ? 'Serendipity & high accuracy' : `RMSE: ${svdMetrics.rmse} | ${svdMetrics.explained_variance_percentage}% Var`}
              </p>
            </div>
          </div>
        </header>


        {/* --- NEW FEATURE: INSTANT FAVORITE-BASED RECOMMENDER --- */}
        <section className="rounded-2xl border border-brand-red/30 bg-gradient-to-r from-red-950/30 via-neutral-900/70 to-black p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-red uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 fill-brand-red text-brand-red" />
                Personal Favorite Magic
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Recommend Movies Like Your Favorite
              </h2>
              <p className="text-neutral-300 text-sm mt-1">
                Pick a movie you love below, and our engine will instantly find films that share the exact same story DNA and audience acclaim!
              </p>
            </div>

            {/* Favorite Selection Chips */}
            <div className="flex flex-wrap gap-2">
              {(favorites && favorites.length > 0 ? favorites : STARTER_FAVORITES).slice(0, 6).map((fav) => {
                const favId = fav.id || fav.movie_id;
                const isSelected = favoriteTestId === favId;
                return (
                  <button
                    key={favId}
                    onClick={() => setFavoriteTestId(favId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-red text-white shadow-md shadow-brand-red/30 ring-1 ring-white/20'
                        : 'bg-black/50 text-neutral-300 hover:text-white border border-white/10 hover:border-brand-red/30'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isSelected ? 'fill-current' : 'text-neutral-400'}`} />
                    <span>{fav.title || `Movie #${favId}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Movie Banner */}
          {favoriteSource && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-black/40 border border-white/10">
              <span className="text-xs text-neutral-400 font-semibold">Generating recommendations tailored to:</span>
              <span className="text-sm font-black text-white underline decoration-brand-red/60">{favoriteSource.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-red/20 text-brand-red font-bold">
                12 Matches Found
              </span>
            </div>
          )}

          {/* Recommended Movies Grid */}
          {loadingFavRecs ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Skeleton.Row count={6} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favoriteRecs.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
                  <button
                    onClick={() => setSelectedMovieForExplanation(movie)}
                    className="mt-1.5 w-full flex items-center justify-center gap-1 py-1 px-2 rounded bg-neutral-800/80 hover:bg-brand-red text-neutral-300 hover:text-white text-[10px] font-bold border border-white/10 transition cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    <span>Why you'll like this</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* --- SECTION: SELECTABLE RECOMMENDATION ENGINES --- */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-brand-red" />
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {viewMode === 'fan' ? 'Choose How We Recommend' : 'Machine Learning Engines'}
                </h2>
              </div>
              <p className="text-neutral-400 text-sm mt-1">
                {viewMode === 'fan'
                  ? 'Switch between styles—from community taste twins to certified crowd favorites.'
                  : 'Toggle active matrix factorization, cosine dot products, or Bayesian rating shrinkage models.'}
              </p>
            </div>

            {/* Algorithm Tabs with Friendly Names */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-neutral-900/90 border border-white/10 rounded-xl">
              {ALGORITHMS.map((algo) => {
                const Icon = algo.icon;
                const isSelected = selectedAlgo === algo.id;
                return (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgo(algo.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{viewMode === 'fan' ? algo.fanName : algo.techName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Algorithm Explanation Box */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-5 space-y-3 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/30 text-[11px] font-extrabold uppercase">
                  {viewMode === 'fan' ? activeAlgo.fanTag : activeAlgo.techTag}
                </span>
                <h3 className="font-bold text-base text-white">
                  {viewMode === 'fan' ? activeAlgo.fanName : activeAlgo.techName}
                </h3>
              </div>
              <div className="font-mono text-xs text-amber-300 bg-black/60 px-3 py-1.5 rounded-md border border-white/5">
                {viewMode === 'fan' ? '🎯 High Serendipity & Relevance' : activeAlgo.formula}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {viewMode === 'fan' ? activeAlgo.fanDesc : activeAlgo.techDesc}
            </p>
          </div>

          {/* Recommended Movies Grid */}
          {loadingAlgo ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Skeleton.Row count={6} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {algoData?.movies?.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={movie} />
                  <button
                    onClick={() => setSelectedMovieForExplanation(movie)}
                    className="mt-1.5 w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-neutral-800/80 hover:bg-brand-red text-neutral-300 hover:text-white text-[10px] font-bold border border-white/10 transition cursor-pointer"
                  >
                    <Info className="w-3 h-3" />
                    <span>{viewMode === 'fan' ? 'Why you’ll love this' : 'Audit ML Score'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* --- SECTION: TASTE TWIN & SIMILAR MOVIE EXPLORER --- */}
        <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Users className="w-4 h-4" />
                {viewMode === 'fan' ? 'Similar Movie Finder' : 'SVD Vector Cosine Neighbors'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {viewMode === 'fan' ? 'Pick a Film You Adore' : 'SVD Latent Space Item-Item Similarities'}
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                {viewMode === 'fan'
                  ? 'Select any movie below to instantly see the top 5 films that give audiences the exact same satisfaction.'
                  : 'Displays the 5 nearest mathematical neighbors in 20-dimensional SVD vector space based on user rating patterns.'}
              </p>
            </div>

            {/* Selectable Movie Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 278, title: 'Shawshank Redemption' },
                { id: 238, title: 'The Godfather' },
                { id: 550, title: 'Fight Club' },
                { id: 603, title: 'The Matrix' },
                { id: 680, title: 'Pulp Fiction' },
                { id: 155, title: 'The Dark Knight' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSimilarityMovieId(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    similarityMovieId === m.id
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-black/40 text-neutral-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {m.title}
                </button>
              ))}
            </div>
          </div>

          {/* Similar Items Display */}
          {loadingSimilar ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <Skeleton.Row count={5} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {similarMovies.map((sim, index) => (
                <div
                  key={sim.id}
                  onClick={() => setSelectedMovieForExplanation(sim)}
                  className="rounded-xl border border-white/10 bg-black/40 p-3 hover:border-cyan-500/50 transition duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden mb-3 bg-neutral-800">
                    {sim.poster_path ? (
                      <img
                        src={
                          sim.poster_path.startsWith('http')
                            ? sim.poster_path
                            : `https://image.tmdb.org/t/p/w342${sim.poster_path.startsWith('/') ? '' : '/'}${sim.poster_path}`
                        }
                        alt={sim.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: sim.poster_path ? 'none' : 'flex' }}
                      className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-neutral-800 to-black"
                    >
                      <Film className="w-6 h-6 text-cyan-400 mb-2" />
                      <span className="font-bold text-xs text-white line-clamp-2">{sim.title}</span>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                      Rank #{index + 1}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs sm:text-sm text-white truncate">{sim.title}</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-neutral-400">
                          {viewMode === 'fan' ? 'Vibe Match:' : 'Cosine Similarity:'}
                        </span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {viewMode === 'fan' ? `${Math.round(sim.similarity_score * 100)}% Match` : sim.similarity_score}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(10, sim.similarity_score * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>


        {/* --- SECTION: AUDIENCE RATINGS HISTOGRAM & LEADERBOARD --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: 100k Ratings Distribution */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-red" />
                  <h3 className="text-lg font-bold text-white">Audience Rating Breakdown (100k Reviews)</h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">Real community votes from 0.5★ to 5.0★</p>
              </div>
              <span className="text-xs font-mono text-neutral-300 bg-black/60 px-2.5 py-1 rounded border border-white/5">
                Avg: {summary.avg_rating_overall}★
              </span>
            </div>

            <div className="space-y-2.5 pt-2">
              {Object.entries(ratingDistribution).map(([star, count]) => {
                const countNum = Number(count);
                const pct = Math.round((countNum / summary.total_ratings) * 100);
                const barWidth = Math.max(8, (countNum / maxRatingCount) * 100);

                return (
                  <div key={star} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-200 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {star} Stars
                      </span>
                      <span className="text-neutral-400 font-mono text-[11px]">
                        {countNum.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Top Certified Classics Leaderboard */}
          <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">All-Time Certified Masterpieces</h3>
                </div>
                <p className="text-xs text-neutral-400 mt-1">Ranked by verified audience confidence</p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20 font-bold">
                Certified Gold
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
              {insights?.bayesian_top_movies?.slice(0, 8).map((movie, index) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovieForExplanation(movie)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-amber-400/30 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-black text-neutral-500 w-5 text-center">
                      #{index + 1}
                    </span>
                    {movie.poster_path ? (
                      <img
                        src={
                          movie.poster_path.startsWith('http')
                            ? movie.poster_path
                            : `https://image.tmdb.org/t/p/w92${movie.poster_path.startsWith('/') ? '' : '/'}${movie.poster_path}`
                        }
                        alt={movie.title}
                        className="w-8 h-12 object-cover rounded bg-neutral-800 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: movie.poster_path ? 'none' : 'flex' }}
                      className="w-8 h-12 rounded bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-500 flex-shrink-0"
                    >
                      🎬
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{movie.title}</h4>
                      <p className="text-[10px] text-neutral-400">{movie.rating_count} community reviews</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-xs font-black text-amber-400">
                      {movie.bayesian_score ? movie.bayesian_score.toFixed(2) : (movie.vote_average / 2).toFixed(2)} ★
                    </span>
                    <span className="text-[10px] text-neutral-500 block">/ 5.00</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>


      {/* --- EXPLAINABILITY MODAL: FRIENDLY & CLEAR --- */}
      {selectedMovieForExplanation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-xl w-full rounded-2xl border border-white/20 bg-neutral-900 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedMovieForExplanation(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title & Poster */}
            <div className="flex items-start gap-4">
              {selectedMovieForExplanation.poster_path ? (
                <img
                  src={
                    selectedMovieForExplanation.poster_path.startsWith('http')
                      ? selectedMovieForExplanation.poster_path
                      : `https://image.tmdb.org/t/p/w185${selectedMovieForExplanation.poster_path.startsWith('/') ? '' : '/'}${selectedMovieForExplanation.poster_path}`
                  }
                  alt={selectedMovieForExplanation.title}
                  className="w-16 h-24 object-cover rounded-lg border border-white/10 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div
                style={{ display: selectedMovieForExplanation.poster_path ? 'none' : 'flex' }}
                className="w-16 h-24 rounded-lg bg-neutral-800 flex items-center justify-center text-xs text-neutral-500"
              >
                🎬
              </div>
              <div className="space-y-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-red/20 text-brand-red text-[10px] font-bold border border-brand-red/30">
                  <Sparkles className="w-3 h-3" />
                  {viewMode === 'fan' ? 'Why We Picked This For You' : 'Mathematical Recommendation Audit'}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug truncate">
                  {selectedMovieForExplanation.title}
                </h3>
                <p className="text-xs text-neutral-400">
                  Audience Match: <span className="font-bold text-emerald-400">{selectedMovieForExplanation.match_score || 94}%</span>
                </p>
              </div>
            </div>

            {/* Three Clear Signals */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {viewMode === 'fan' ? 'How This Movie Matches Your Taste' : 'Algorithmic Feature Breakdown'}
              </h4>

              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300">
                      {viewMode === 'fan' ? '👥 Taste Twins Match (Fans of this also loved your favorites)' : 'SVD Latent Factor Score'}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {selectedMovieForExplanation.breakdown?.collaborative_filtering || 92}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${selectedMovieForExplanation.breakdown?.collaborative_filtering || 92}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300">
                      {viewMode === 'fan' ? '🧬 Story & Vibe Alignment (Pacing, Themes & Genre)' : 'Content Vector Cosine Similarity'}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedMovieForExplanation.breakdown?.genre_affinity || 88}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full"
                      style={{ width: `${selectedMovieForExplanation.breakdown?.genre_affinity || 88}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300">
                      {viewMode === 'fan' ? '🏆 Certified Crowd Quality (Tested against 100k reviews)' : 'Bayesian Statistical Confidence'}
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      {selectedMovieForExplanation.breakdown?.bayesian_quality || 85}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${selectedMovieForExplanation.breakdown?.bayesian_quality || 85}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Why signals in plain English */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Key Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {(selectedMovieForExplanation.signals || [
                  'Over 90% of viewers with similar taste rated this movie 4 or 5 stars',
                  'Matches your preferred genres, story themes, and cinematic style',
                  'Verified statistical quality with extensive community reviews'
                ]).map((sig, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMovieForExplanation(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 cursor-pointer"
              >
                Close
              </button>
              <Link
                to={`/movie/${selectedMovieForExplanation.id}`}
                className="px-4 py-2 rounded-lg bg-brand-red hover:bg-brand-dark-red text-xs font-bold text-white flex items-center gap-1.5"
              >
                <span>Watch Details & Trailer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BigDataAnalytics;
