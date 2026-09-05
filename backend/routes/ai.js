const express = require('express');
const tmdb = require('../services/tmdb');
const { CATALOG } = require('../services/catalog');

const router = express.Router();

// Helper to avoid false positive substring matches on short tokens
function matchesPattern(text, pattern) {
  if (pattern.length <= 2) {
    return new RegExp(`(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`, 'i').test(text);
  }
  return text.toLowerCase().includes(pattern.toLowerCase());
}

// Language options
const LANGUAGES = [
  { code: 'en', name: 'English', label: '🌐 Hollywood / English', patterns: ['english', 'hollywood', 'western'] },
  { code: 'te', name: 'Telugu', label: '🇮🇳 Telugu (Tollywood)', patterns: ['telugu', 'tollywood'] },
  { code: 'hi', name: 'Hindi', label: '🇮🇳 Hindi (Bollywood)', patterns: ['hindi', 'bollywood'] },
  { code: 'ta', name: 'Tamil', label: '🇮🇳 Tamil (Kollywood)', patterns: ['tamil', 'kollywood'] },
  { code: 'ml', name: 'Malayalam', label: '🇮🇳 Malayalam', patterns: ['malayalam', 'mollywood', 'kerala'] },
  { code: 'ko', name: 'Korean', label: '🇰🇷 Korean Cinema', patterns: ['korean', 'k-drama', 'k-movie'] },
  { code: 'ja', name: 'Japanese', label: '🇯🇵 Anime / Japanese', patterns: ['japanese', 'anime', 'j-movie'] },
  { code: 'all', name: 'Any', label: '🌍 Any Cinema / Surprise', patterns: ['all cinema', 'any language', 'surprise me', 'world cinema'] }
];

// Genre & Vibe options
const GENRES = [
  { id: 878, name: 'Sci-Fi', label: '🧠 Mind-Bending Sci-Fi', patterns: ['sci-fi', 'scifi', 'science fiction', 'space', 'mind-bending', 'futuristic', 'time travel', 'alien', 'cyberpunk'] },
  { id: 28, name: 'Action', label: '💥 High-Octane Action', patterns: ['action', 'fight', 'action-packed', 'stunts', 'explosive', 'martial arts', 'superhero', 'battle'] },
  { id: 35, name: 'Comedy', label: '😂 Comedy & Laughs', patterns: ['comedy', 'funny', 'humorous', 'hilarious', 'laugh', 'lighthearted', 'sitcom', 'comic'] },
  { id: 27, name: 'Horror', label: '👻 Spine-Chilling Horror', patterns: ['horror', 'hoorir', 'horor', 'scary', 'spooky', 'ghost', 'creepy', 'slasher', 'haunted', 'gore', 'chilling', 'fear', 'supernatural', 'demon', 'witch'] },
  { id: 53, name: 'Thriller', label: '😱 Psychological Thriller', patterns: ['thriller', 'suspense', 'edge of seat', 'twist', 'psychological', 'tense', 'thrill'] },
  { id: 18, name: 'Drama', label: '🎭 Heartfelt Drama', patterns: ['drama', 'emotional', 'deep', 'touching', 'tearjerker', 'inspirational', 'heartfelt'] },
  { id: 10749, name: 'Romance', label: '💖 Romance & Love', patterns: ['romance', 'romantic', 'love', 'date night', 'rom-com', 'couple', 'heartwarming'] },
  { id: 80, name: 'Crime', label: '🕵️ Crime & Mafia', patterns: ['crime', 'mafia', 'gangster', 'underworld', 'cop', 'heist', 'robbery', 'cartel', 'godfather'] },
  { id: 9648, name: 'Mystery', label: '🔍 Suspense & Mystery', patterns: ['mystery', 'detective', 'whodunnit', 'investigation', 'clue', 'puzzle', 'murder mystery'] },
  { id: 16, name: 'Animation', label: '🎨 Animation & Family', patterns: ['animation', 'animated', 'cartoon', 'pixar', 'disney', 'family', 'kids'] },
  { id: 14, name: 'Fantasy', label: '🧙 Epic Fantasy & Mythology', patterns: ['fantasy', 'mythology', 'mythological', 'magic', 'magical', 'epic fantasy', 'folklore', 'dragons'] },
  { id: 12, name: 'Adventure', label: '🗺️ Thrilling Adventure', patterns: ['adventure', 'quest', 'journey', 'expedition', 'treasure', 'survival'] }
];

// Era & Flavor options
const ERAS = [
  { code: 'modern', label: '🚀 Modern Hits (2018+)', patterns: ['modern', 'new', 'latest', 'recent', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'] },
  { code: 'classic', label: '📼 Iconic Classics (90s-2000s)', patterns: ['classic', '90s', '2000s', 'retro', 'vintage', 'old'] },
  { code: 'masterpiece', label: '🏆 Certified Masterpieces', patterns: ['masterpiece', 'gold', 'critically acclaimed', 'highest rated', 'award', 'oscar', 'imdb', 'top rated'] },
  { code: 'entertainer', label: '🍿 Fast-Paced Entertainer', patterns: ['entertainer', 'popcorn', 'fun', 'masala', 'binge', 'fast-paced'] }
];

// POST /api/ai/assistant
router.post('/assistant', async (req, res) => {
  try {
    const { message = '', step = null, context = {} } = req.body;
    const text = (message || '').toLowerCase().trim();

    // 1. Initial Greeting or Reset
    if (!text || text === 'start' || text === 'reset' || text === 'hi' || text === 'hello' || text === 'restart' || text.includes('start over')) {
      return res.json({
        response: "Hey there! 🎬 I'm CineAI, your personal cinema assistant.\n\nLet's find you the perfect movie in 3 quick questions!\n\n👉 **Question 1:** What language or film industry are you in the mood for?",
        recommended_movies: [],
        step: 1,
        context: {},
        options: LANGUAGES.map(l => ({ label: l.label, value: l.code, type: 'language' }))
      });
    }

    // Detect entities in the incoming user text
    let detectedLang = null;
    for (const l of LANGUAGES) {
      if (l.patterns.some(p => matchesPattern(text, p)) || text === l.code || text === l.name.toLowerCase()) {
        detectedLang = l;
        break;
      }
    }

    let detectedGenre = null;
    for (const g of GENRES) {
      if (g.patterns.some(p => matchesPattern(text, p)) || text === String(g.id) || text === g.name.toLowerCase()) {
        detectedGenre = g;
        break;
      }
    }

    let detectedEra = null;
    for (const e of ERAS) {
      if (e.patterns.some(p => matchesPattern(text, p)) || text === e.code) {
        detectedEra = e;
        break;
      }
    }

    // 2. PRIORITY CHECK: Natural Language "movies like [X]" or direct title mention (when not a genre/lang keyword)
    const likeMatch = text.match(/(?:movies?\s+like|similar\s+to|like)\s+([a-z0-9\s:.'-]+)/i);
    let targetMovie = null;
    if (likeMatch) {
      const candidateTitle = likeMatch[1].replace(/recommend|suggest|show me|any/gi, '').trim().toLowerCase();
      if (candidateTitle.length >= 3) {
        targetMovie = CATALOG.find(m => m.title.toLowerCase().includes(candidateTitle) || candidateTitle.includes(m.title.toLowerCase()));
      }
    }
    if (!targetMovie && !detectedGenre && !detectedLang && !detectedEra) {
      const cleanTitle = text.replace(/movie|film|recommend|suggest|show me|watch|any/gi, '').trim();
      if (cleanTitle.length >= 3) {
        targetMovie = CATALOG.find(m => {
          const t = m.title.toLowerCase();
          return t === cleanTitle || t.includes(cleanTitle) || cleanTitle.includes(t);
        });
      }
    }

    if (targetMovie) {
      const targetGenreIds = targetMovie.genre_ids || [];
      const recommended = CATALOG
        .filter(m => m.id !== targetMovie.id)
        .map(m => {
          const shared = (m.genre_ids || []).filter(g => targetGenreIds.includes(g));
          const score = Math.min(99, 72 + shared.length * 9 + Math.round((m.vote_average || 8) * 1.5));
          return {
            ...m,
            match_score: score,
            recommendation_reason: `Shares deep cinematic DNA with ${targetMovie.title} (${shared.length} shared genres)`
          };
        })
        .sort((a, b) => b.match_score - a.match_score)
        .slice(0, 4);

      return res.json({
        response: `Because you're interested in **${targetMovie.title}**, I've curated these 4 films sharing similar themes, tension, and cinematic depth!`,
        recommended_movies: recommended,
        step: 4,
        context: { completed: true },
        options: [
          { label: '🔄 Start Over', value: 'start', type: 'action' },
          { label: '🎲 Surprise Me', value: 'surprise', type: 'action' },
          { label: '👻 Spine-Chilling Horror', value: 'horror', type: 'genre' },
          { label: '🧠 Mind-Bending Sci-Fi', value: 'sci-fi', type: 'genre' }
        ]
      });
    }

    // 3. Resolve Context & Interactive Flow Entities
    const isExplorationMode = step >= 4 || context.completed === true;

    let langCode = null;
    let genreId = null;
    let eraCode = null;

    if (isExplorationMode) {
      // In post-questionnaire exploration mode:
      if (detectedGenre) {
        genreId = detectedGenre.id;
      }
      if (detectedLang) {
        langCode = detectedLang.code;
      } else if (context.language && context.language !== 'all') {
        langCode = context.language;
      }
      if (detectedEra) {
        eraCode = detectedEra.code;
      }
    } else {
      // In 3-step questionnaire mode:
      langCode = detectedLang ? detectedLang.code : (context.language || null);
      genreId = detectedGenre ? detectedGenre.id : (context.genre ? Number(context.genre) : null);
      eraCode = detectedEra ? detectedEra.code : (context.era || null);
    }

    const matchedLang = LANGUAGES.find(l => l.code === langCode);
    const matchedGenre = GENRES.find(g => g.id === genreId);
    const matchedEra = ERAS.find(e => e.code === eraCode);

    // 4. Multi-step Questionnaire Progression (Only when not in exploration mode)
    if (!isExplorationMode) {
      // Step 1 -> Step 2: Language selected, ask Genre
      if (langCode && !genreId && (step === 1 || (!text.includes('recommend') && !text.includes('movie')))) {
        return res.json({
          response: `Awesome pick with **${matchedLang?.name || 'that'}** cinema! 🌟\n\n👉 **Question 2:** What vibe or genre are you craving today?`,
          recommended_movies: [],
          step: 2,
          context: { language: langCode },
          options: GENRES.map(g => ({ label: g.label, value: g.id, type: 'genre' }))
        });
      }

      // Step 2 -> Step 3: Genre selected, ask Era/Flavor
      if (genreId && !eraCode && (step === 2 || (langCode && !text.includes('recommend')))) {
        const langName = matchedLang?.name || 'Any';
        return res.json({
          response: `Love that! **${matchedGenre?.name || 'Genre'}** (${langName}) sounds fantastic. 🍿\n\n👉 **Question 3:** What era or style do you prefer?`,
          recommended_movies: [],
          step: 3,
          context: { language: langCode || 'all', genre: genreId },
          options: ERAS.map(e => ({ label: e.label, value: e.code, type: 'era' }))
        });
      }
    }

    // 5. Recommendation Assembly
    let pool = [...CATALOG];

    // Filter by genre if specified
    if (genreId) {
      const genreMatches = pool.filter(m => m.genre_ids?.includes(genreId));
      if (genreMatches.length > 0) {
        if (langCode && langCode !== 'all') {
          const langGenreMatches = genreMatches.filter(m => m.original_language === langCode);
          if (langGenreMatches.length > 0) {
            // Matching language genre first, then global genre masters
            const otherGenreMatches = genreMatches.filter(m => m.original_language !== langCode);
            pool = [...langGenreMatches, ...otherGenreMatches];
          } else {
            pool = genreMatches;
          }
        } else {
          pool = genreMatches;
        }
      }
    } else if (langCode && langCode !== 'all') {
      const langMatches = pool.filter(m => m.original_language === langCode);
      if (langMatches.length > 0) pool = langMatches;
    }

    // Filter by era if specified
    if (eraCode === 'modern') {
      const modernMatches = pool.filter(m => m.release_date >= '2016');
      if (modernMatches.length > 0) pool = modernMatches;
    } else if (eraCode === 'classic') {
      const classicMatches = pool.filter(m => m.release_date < '2010');
      if (classicMatches.length > 0) pool = classicMatches;
    } else if (eraCode === 'masterpiece') {
      pool.sort((a, b) => (b.bayesian_score || b.vote_average) - (a.bayesian_score || a.vote_average));
    }

    // Ensure at least 4 movies in pool
    if (pool.length < 4 && genreId) {
      const genreBackfills = CATALOG.filter(m => m.genre_ids?.includes(genreId) && !pool.some(p => p.id === m.id));
      pool = pool.concat(genreBackfills);
    }
    if (pool.length < 4 && langCode && langCode !== 'all') {
      const langBackfills = CATALOG.filter(m => m.original_language === langCode && !pool.some(p => p.id === m.id));
      pool = pool.concat(langBackfills);
    }
    if (pool.length < 4) {
      const generalBackfills = CATALOG.filter(m => !pool.some(p => p.id === m.id));
      pool = pool.concat(generalBackfills);
    }

    let recommended = pool.slice(0, 4).map((m, idx) => {
      const score = Math.max(82, 98 - idx * 3);
      const isExactGenre = genreId && m.genre_ids?.includes(genreId);
      const isExactLang = langCode && m.original_language === langCode;

      let reason;
      if (isExactGenre && isExactLang && matchedGenre && matchedLang) {
        reason = `Top-rated ${matchedLang.name} ${matchedGenre.name} pick with high audience acclaim`;
      } else if (isExactGenre && matchedGenre) {
        reason = `Spine-chilling ${matchedGenre.name} classic celebrated by cinema critics`;
      } else if (isExactLang && matchedLang) {
        reason = `Celebrated ${matchedLang.name} blockbuster loved by fans`;
      } else {
        reason = `High-vibe recommendation curated by CineAI`;
      }

      return {
        ...m,
        match_score: score,
        recommendation_reason: reason
      };
    });

    if (recommended.length === 0) {
      recommended = CATALOG.slice(0, 4).map((m, idx) => ({
        ...m,
        match_score: 96 - idx * 2,
        recommendation_reason: 'All-time audience favorite'
      }));
    }

    const parts = [];
    if (matchedEra) parts.push(matchedEra.label.replace(/[^a-zA-Z0-9\s()+-]/g, '').trim());
    if (matchedLang && matchedLang.code !== 'all') parts.push(matchedLang.name);
    if (matchedGenre) parts.push(matchedGenre.name);
    const summaryTag = parts.length > 0 ? parts.join(' • ') : 'curated selection';

    const responseText = `✨ **Here are your personalized picks for ${summaryTag}:**\n\nI evaluated our 100,000+ movie ratings to find the top vibe matches for you. Click any movie card below to view trailers and full details!`;

    const followUpOptions = [
      { label: '🔄 Start Over', value: 'start', type: 'action' },
      { label: '🎲 Surprise Me', value: 'surprise', type: 'action' },
      { label: '👻 Spine-Chilling Horror', value: 'horror', type: 'genre' },
      { label: '🧠 Mind-Bending Sci-Fi', value: 'sci-fi', type: 'genre' },
      { label: '💥 High-Octane Action', value: 'action', type: 'genre' },
      { label: '🇮🇳 Telugu Blockbusters', value: 'telugu', type: 'language' }
    ];

    res.json({
      response: responseText,
      recommended_movies: recommended,
      step: 4,
      context: { language: langCode, genre: genreId, era: eraCode, completed: true },
      options: followUpOptions
    });
  } catch (err) {
    console.error('AI assistant error:', err);
    res.status(500).json({
      response: "I encountered a hiccup, but here are some all-time certified masterpieces you'll love!",
      recommended_movies: CATALOG.slice(0, 4),
      options: [{ label: '🔄 Start Over', value: 'start' }]
    });
  }
});

module.exports = router;
