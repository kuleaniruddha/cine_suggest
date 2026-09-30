import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  firebaseSignOut,
  onAuthStateChanged 
} from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('cineai_auth_token') || '');

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = authToken || localStorage.getItem('cineai_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const authFetch = async (url, options = {}) => {
    const headers = {
      ...getHeaders(),
      ...(options.headers || {})
    };
    return fetch(url, {
      ...options,
      headers
    });
  };

  // Fetch watchlist, ratings, viewing history, favorites, and collections from backend
  const fetchUserData = async () => {
    try {
      const [watchRes, rateRes, histRes, favRes, colRes] = await Promise.all([
        authFetch('/api/user/watchlist'),
        authFetch('/api/user/ratings'),
        authFetch('/api/user/history'),
        authFetch('/api/user/favorites'),
        authFetch('/api/user/collections')
      ]);

      if (watchRes.ok) {
        setWatchlist(await watchRes.json());
      }
      if (rateRes.ok) {
        setUserRatings(await rateRes.json());
      }
      if (histRes.ok) {
        setHistory(await histRes.json());
      }
      if (favRes.ok) {
        setFavorites(await favRes.json());
      }
      if (colRes.ok) {
        setCollections(await colRes.json());
      }
    } catch (err) {
      console.error('Failed to load user profile details:', err);
    }
  };

  const saveUser = (u, token) => {
    if (!u) {
      setUser(null);
      setAuthToken('');
      localStorage.removeItem('cineai_auth_token');
      return null;
    }
    if (token) {
      setAuthToken(token);
      localStorage.setItem('cineai_auth_token', token);
    }
    const hydratedUser = {
      ...u,
      username: u.username || u.displayName || (u.email ? u.email.split('@')[0] : 'User'),
      photoURL: u.photoURL || u.picture || null,
      created_at: u.created_at || new Date().toISOString()
    };
    setUser(hydratedUser);
    return hydratedUser;
  };

  // Verify session on mount
  useEffect(() => {
    let mounted = true;

    const verifyUser = async () => {
      try {
        const res = await authFetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user && mounted) {
            saveUser(data.user);
            await fetchUserData();
          }
        }
      } catch (err) {
        console.error('Session verification failed:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    verifyUser();

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && !user) {
        try {
          const idToken = await fbUser.getIdToken();
          const res = await fetch('/api/auth/firebase-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idToken,
              user: {
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName,
                photoURL: fbUser.photoURL
              }
            })
          });
          if (res.ok && mounted) {
            const data = await res.json();
            saveUser(data.user, data.token);
            await fetchUserData();
          }
        } catch (err) {
          console.error('Firebase auto-sync error:', err);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Google Sign-In with Firebase
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          user: {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          }
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Google Sign-in synchronization failed');
      }

      const data = await res.json();
      const loggedUser = saveUser(data.user, data.token);
      await fetchUserData();
      return loggedUser;
    } catch (err) {
      console.error('Firebase Google Sign-In error:', err);
      throw err;
    }
  };

  const login = async (email, password) => {
    // 1. Try Firebase Email/Password first
    try {
      const fbCred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await fbCred.user.getIdToken();
      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          user: {
            uid: fbCred.user.uid,
            email: fbCred.user.email,
            displayName: fbCred.user.displayName
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const loggedUser = saveUser(data.user, data.token);
        await fetchUserData();
        return loggedUser;
      }
    } catch (fbErr) {
      // If Firebase auth throws (e.g. user registered in local DB), fallback to local login
    }

    // 2. Standard backend DB login fallback
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await res.json();
    const loggedUser = saveUser(data.user, data.token);
    await fetchUserData();
    return loggedUser;
  };

  const register = async (arg1, arg2, arg3) => {
    const email = arg3 ? arg2 : arg1;
    const password = arg3 || arg2;
    const username = arg3 ? arg1 : (email.split('@')[0]);

    // Try creating user in Firebase Auth
    let fbToken = null;
    let fbUid = null;
    try {
      const fbCred = await createUserWithEmailAndPassword(auth, email, password);
      fbToken = await fbCred.user.getIdToken();
      fbUid = fbCred.user.uid;
    } catch (fbErr) {
      console.warn('Firebase user creation note:', fbErr.message);
    }

    if (fbToken) {
      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken: fbToken,
          user: {
            uid: fbUid,
            email,
            displayName: username
          }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const regUser = saveUser(data.user, data.token);
        await fetchUserData();
        return regUser;
      }
    }

    // Standard backend DB registration
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Registration failed');
    }

    const data = await res.json();
    const regUser = saveUser(data.user, data.token);
    await fetchUserData();
    return regUser;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    saveUser(null, '');
    setWatchlist([]);
    setUserRatings([]);
    setHistory([]);
    setFavorites([]);
    setCollections([]);
  };

  // Watchlist Management
  const addToWatchlist = async (movie) => {
    try {
      const res = await authFetch('/api/user/watchlist', {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id, movie }),
      });
      if (res.ok) {
        setWatchlist((prev) => [movie, ...prev.filter(m => m.id !== movie.id)]);
        return true;
      }
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
    }
    return false;
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const res = await authFetch(`/api/user/watchlist/${movieId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
        return true;
      }
    } catch (err) {
      console.error('Failed to remove from watchlist:', err);
    }
    return false;
  };

  const inWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  // Ratings Management
  const rateMovie = async (movieId, ratingScore, movie) => {
    try {
      let resolvedMovie = movie;
      if (!resolvedMovie) {
        const fetchRes = await fetch(`/api/movies/${movieId}`);
        if (fetchRes.ok) {
          resolvedMovie = await fetchRes.json();
        }
      }

      if (!resolvedMovie) {
        console.error('Cannot rate movie without metadata');
        return false;
      }

      const res = await authFetch('/api/user/ratings', {
        method: 'POST',
        body: JSON.stringify({
          movieId,
          rating: ratingScore,
          genres: resolvedMovie.genres ? resolvedMovie.genres.map(g => g.id) : [],
          movie: resolvedMovie
        }),
      });
      if (res.ok) {
        setUserRatings((prev) => {
          const filtered = prev.filter((r) => r.movie_id !== movieId);
          return [{ movie_id: movieId, rating: ratingScore, movie: resolvedMovie }, ...filtered];
        });
        return true;
      }
    } catch (err) {
      console.error('Failed to save rating:', err);
    }
    return false;
  };

  const getUserRating = (movieId) => {
    const ratingObj = userRatings.find((r) => r.movie_id === movieId);
    return ratingObj ? ratingObj.rating : 0;
  };

  // Browsing History Tracking
  const addToHistory = async (movie) => {
    if (!user) return;
    try {
      await authFetch('/api/user/history', {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id, movie }),
      });
      setHistory((prev) => [movie, ...prev.filter(m => m.id !== movie.id)]);
    } catch (err) {
      console.error('Failed to record browsing history:', err);
    }
  };

  // Persisted Favorites triggers
  const addFavorite = async (movie) => {
    try {
      const res = await authFetch('/api/user/favorites', {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id, movie }),
      });
      if (res.ok) {
        setFavorites((prev) => [movie, ...prev.filter(m => m.id !== movie.id)]);
        return true;
      }
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
    return false;
  };

  const removeFavorite = async (movieId) => {
    try {
      const res = await authFetch(`/api/user/favorites/${movieId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((m) => m.id !== movieId));
        return true;
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
    return false;
  };

  const isFavorite = (movieId) => {
    return favorites.some((m) => m.id === movieId);
  };

  const createCollection = async (name, description, isPublic) => {
    try {
      const res = await authFetch('/api/user/collections', {
        method: 'POST',
        body: JSON.stringify({ name, description, is_public: isPublic }),
      });
      if (res.ok) {
        const created = await res.json();
        setCollections((prev) => [created, ...prev]);
        return created;
      }
    } catch (err) {
      console.error('Failed to create collection:', err);
    }
    return null;
  };

  const deleteCollection = async (collectionId) => {
    try {
      const res = await authFetch(`/api/user/collections/${collectionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCollections((prev) => prev.filter((c) => c.id !== collectionId));
        return true;
      }
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
    return false;
  };

  const addMovieToCollection = async (collectionId, movie) => {
    try {
      const res = await authFetch(`/api/user/collections/${collectionId}/movies`, {
        method: 'POST',
        body: JSON.stringify({ movieId: movie.id, movie }),
      });
      if (res.ok) {
        setCollections((prev) =>
          prev.map((c) => {
            if (c.id === collectionId) {
              return { ...c, movies: [movie, ...c.movies.filter((m) => m.id !== movie.id)] };
            }
            return c;
          })
        );
        return true;
      }
    } catch (err) {
      console.error('Failed to add movie to collection:', err);
    }
    return false;
  };

  const removeMovieFromCollection = async (collectionId, movieId) => {
    try {
      const res = await authFetch(`/api/user/collections/${collectionId}/movies/${movieId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCollections((prev) =>
          prev.map((c) => {
            if (c.id === collectionId) {
              return {
                ...c,
                movies: c.movies.filter((m) => m.id !== movieId && m.tmdb_id !== movieId),
              };
            }
            return c;
          })
        );
        return true;
      }
    } catch (err) {
      console.error('Failed to remove movie from collection:', err);
    }
    return false;
  };

  const clearAllData = async () => {
    try {
      const res = await authFetch('/api/user/clear-all', {
        method: 'POST',
      });
      if (res.ok) {
        setWatchlist([]);
        setUserRatings([]);
        setHistory([]);
        setFavorites([]);
        setCollections([]);
        return true;
      }
    } catch (err) {
      console.error('Failed to clear personal data:', err);
    }
    return false;
  };

  const value = {
    user,
    loading,
    watchlist,
    userRatings,
    history,
    favorites,
    login,
    register,
    signInWithGoogle,
    logout,
    addToWatchlist,
    removeFromWatchlist,
    inWatchlist,
    rateMovie,
    getUserRating,
    addToHistory,
    addFavorite,
    removeFavorite,
    isFavorite,
    getHeaders,
    authFetch,
    collections,
    createCollection,
    deleteCollection,
    addMovieToCollection,
    removeMovieFromCollection,
    clearAllData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
