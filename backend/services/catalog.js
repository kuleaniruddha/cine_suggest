// Comprehensive high-performance movie catalog for instant 0ms retrieval
// Contains enriched metadata, TMDB CDN poster paths, trailers, and genre tags.

const CATALOG = [
  // --- TOP ALL-TIME CLASSICS & MOVIELENS BENCHMARKS ---
  {
    id: 278,
    movieId: 318,
    title: 'The Shawshank Redemption',
    original_title: 'The Shawshank Redemption',
    overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral warden.',
    poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    vote_average: 8.7,
    vote_count: 26500,
    release_date: '1994-09-23',
    original_language: 'en',
    genre_ids: [18, 80],
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    trailer: 'NmzuHjWmXOc',
    bayesian_score: 4.38,
    rating_count: 317,
    popularity: 98.4
  },
  {
    id: 238,
    movieId: 858,
    title: 'The Godfather',
    original_title: 'The Godfather',
    overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers.',
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    vote_average: 8.7,
    vote_count: 20100,
    release_date: '1972-03-14',
    original_language: 'en',
    genre_ids: [18, 80],
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    trailer: 'UaVTIH8mujA',
    bayesian_score: 4.22,
    rating_count: 192,
    popularity: 94.2
  },
  {
    id: 550,
    movieId: 2959,
    title: 'Fight Club',
    original_title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    vote_average: 8.4,
    vote_count: 28400,
    release_date: '1999-10-15',
    original_language: 'en',
    genre_ids: [18, 53, 80],
    genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],
    trailer: 'BdJKm16Co6M',
    bayesian_score: 4.22,
    rating_count: 218,
    popularity: 91.5
  },
  {
    id: 155,
    movieId: 58559,
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    vote_average: 8.5,
    vote_count: 32000,
    release_date: '2008-07-16',
    original_language: 'en',
    genre_ids: [18, 28, 80, 53],
    genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }],
    trailer: 'EXeTwQWrcwY',
    bayesian_score: 4.16,
    rating_count: 149,
    popularity: 97.8
  },
  {
    id: 680,
    movieId: 296,
    title: 'Pulp Fiction',
    original_title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
    vote_average: 8.5,
    vote_count: 27300,
    release_date: '1994-09-10',
    original_language: 'en',
    genre_ids: [53, 80, 35],
    genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }, { id: 35, name: 'Comedy' }],
    trailer: 's7EdQ4FqbhY',
    bayesian_score: 4.16,
    rating_count: 307,
    popularity: 93.0
  },
  {
    id: 603,
    movieId: 2571,
    title: 'The Matrix',
    original_title: 'The Matrix',
    overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
    poster_path: '/p96dm7sCMn4VYAStA6siNz30G1r.jpg',
    backdrop_path: '/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
    vote_average: 8.2,
    vote_count: 25000,
    release_date: '1999-03-30',
    original_language: 'en',
    genre_ids: [28, 878],
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    trailer: 'vKQi3bBA1y8',
    bayesian_score: 4.15,
    rating_count: 278,
    popularity: 92.4
  },
  {
    id: 27205,
    movieId: 79132,
    title: 'Inception',
    original_title: 'Inception',
    overview: 'Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    vote_average: 8.4,
    vote_count: 35600,
    release_date: '2010-07-15',
    original_language: 'en',
    genre_ids: [28, 878, 12],
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }],
    trailer: 'YoHD9XEInc0',
    bayesian_score: 4.12,
    rating_count: 143,
    popularity: 96.5
  },
  {
    id: 157336,
    movieId: 109487,
    title: 'Interstellar',
    original_title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTsqJiOEZR4f3NddFj675k4G.jpg',
    vote_average: 8.4,
    vote_count: 34500,
    release_date: '2014-11-05',
    original_language: 'en',
    genre_ids: [12, 18, 878],
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }],
    trailer: 'zSWdZVtXT7E',
    bayesian_score: 4.10,
    rating_count: 138,
    popularity: 99.2
  },
  {
    id: 13,
    movieId: 356,
    title: 'Forrest Gump',
    original_title: 'Forrest Gump',
    overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do. But despite all he has achieved, his one true love eludes him.',
    poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdrop_path: '/7c9UVPPiTPltouxShY9JH93ndBM.jpg',
    vote_average: 8.5,
    vote_count: 26800,
    release_date: '1994-06-23',
    original_language: 'en',
    genre_ids: [35, 18, 10749],
    genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }, { id: 10749, name: 'Romance' }],
    trailer: 'bLvqoHBptjg',
    bayesian_score: 4.14,
    rating_count: 329,
    popularity: 90.1
  },
  {
    id: 424,
    movieId: 527,
    title: "Schindler's List",
    original_title: "Schindler's List",
    overview: 'The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.',
    poster_path: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    backdrop_path: '/zb6fM1CX41D9rF9hdgclu0peUmy.jpg',
    vote_average: 8.6,
    vote_count: 15300,
    release_date: '1993-11-30',
    original_language: 'en',
    genre_ids: [18, 36, 10752],
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }, { id: 10752, name: 'War' }],
    trailer: 'gG22XNhtnoY',
    bayesian_score: 4.17,
    rating_count: 220,
    popularity: 88.3
  },
  {
    id: 122,
    movieId: 7153,
    title: 'The Lord of the Rings: The Return of the King',
    original_title: 'The Lord of the Rings: The Return of the King',
    overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces.",
    poster_path: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    backdrop_path: '/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg',
    vote_average: 8.6,
    vote_count: 23600,
    release_date: '2003-12-01',
    original_language: 'en',
    genre_ids: [12, 14, 28],
    genres: [{ id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 28, name: 'Action' }],
    trailer: 'r5X-hFf6Bwo',
    bayesian_score: 4.15,
    rating_count: 185,
    popularity: 94.7
  },
  {
    id: 129,
    movieId: 5618,
    title: 'Spirited Away',
    original_title: '千と千尋の神隠し',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    poster_path: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdrop_path: '/bXNvzjYE9rvVI1PrTX7CHgtAUeb.jpg',
    vote_average: 8.5,
    vote_count: 16200,
    release_date: '2001-07-20',
    original_language: 'ja',
    genre_ids: [16, 14, 10751],
    genres: [{ id: 16, name: 'Animation' }, { id: 14, name: 'Fantasy' }, { id: 10751, name: 'Family' }],
    trailer: 'ByXuk9QqQkk',
    bayesian_score: 4.12,
    rating_count: 134,
    popularity: 89.6
  },
  {
    id: 496243,
    movieId: 202429,
    title: 'Parasite',
    original_title: '기생충',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdrop_path: '/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    vote_average: 8.5,
    vote_count: 17800,
    release_date: '2019-05-30',
    original_language: 'ko',
    genre_ids: [35, 53, 18],
    genres: [{ id: 35, name: 'Comedy' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    trailer: '5xH0hhMbQ8o',
    bayesian_score: 4.15,
    rating_count: 98,
    popularity: 95.0
  },
  {
    id: 872585,
    movieId: 275814,
    title: 'Oppenheimer',
    original_title: 'Oppenheimer',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II, exploring the moral and political turmoil that followed.',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    vote_average: 8.1,
    vote_count: 13400,
    release_date: '2023-07-19',
    original_language: 'en',
    genre_ids: [18, 36],
    genres: [{ id: 18, name: 'Drama' }, { id: 36, name: 'History' }],
    trailer: 'uYPbbksJxIg',
    bayesian_score: 4.18,
    rating_count: 112,
    popularity: 96.8
  },
  {
    id: 693134,
    movieId: 276999,
    title: 'Dune: Part Two',
    original_title: 'Dune: Part Two',
    overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg',
    vote_average: 8.2,
    vote_count: 5600,
    release_date: '2024-02-27',
    original_language: 'en',
    genre_ids: [878, 12],
    genres: [{ id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }],
    trailer: 'Way9Dexny3w',
    bayesian_score: 4.16,
    rating_count: 88,
    popularity: 99.4
  },
  {
    id: 324857,
    movieId: 195159,
    title: 'Spider-Man: Into the Spider-Verse',
    original_title: 'Spider-Man: Into the Spider-Verse',
    overview: 'Teen Miles Morales becomes the new Spider-Man, joining other alternate-universe Spider-Heroes to stop a threat to all reality.',
    poster_path: '/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    backdrop_path: '/7d6o00VPrL69p17z69wJ7G9Y7n3.jpg',
    vote_average: 8.4,
    vote_count: 14700,
    release_date: '2018-12-06',
    original_language: 'en',
    genre_ids: [16, 28, 12, 878],
    genres: [{ id: 16, name: 'Animation' }, { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 878, name: 'Science Fiction' }],
    trailer: 'tg52up16eq0',
    bayesian_score: 4.13,
    rating_count: 104,
    popularity: 93.7
  },
  {
    id: 11,
    movieId: 260,
    title: 'Star Wars: Episode IV - A New Hope',
    original_title: 'Star Wars',
    overview: 'Princess Leia is captured and held hostage by the evil Imperial forces in their effort to take over the galactic Empire. Venturesome Luke Skywalker and dashing captain Han Solo team together with the loveable robot duo R2-D2 and C-3PO to rescue the beautiful princess.',
    poster_path: '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    backdrop_path: '/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg',
    vote_average: 8.2,
    vote_count: 20200,
    release_date: '1977-05-25',
    original_language: 'en',
    genre_ids: [12, 28, 878],
    genres: [{ id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    trailer: 'vZ734NWnAHA',
    bayesian_score: 4.18,
    rating_count: 251,
    popularity: 88.0
  },
  {
    id: 1891,
    movieId: 1196,
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    original_title: 'The Empire Strikes Back',
    overview: 'The epic adventure continues as Luke Skywalker seeks out Jedi Master Yoda for training, while Darth Vader relentlessly pursues Han Solo and Princess Leia across the galaxy.',
    poster_path: '/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
    backdrop_path: '/aJCtkxLLzkk1pECehVjKHA2lBgw.jpg',
    vote_average: 8.4,
    vote_count: 16500,
    release_date: '1980-05-20',
    original_language: 'en',
    genre_ids: [12, 28, 878],
    genres: [{ id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    trailer: 'JNwNXF9Y6kY',
    bayesian_score: 4.16,
    rating_count: 211,
    popularity: 87.5
  },
  {
    id: 769,
    movieId: 1213,
    title: 'Goodfellas',
    original_title: 'Goodfellas',
    overview: 'The story of Henry Hill and his life in the mafia, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.',
    poster_path: '/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    backdrop_path: '/sw7mordbZxgITU877yTpZCud90M.jpg',
    vote_average: 8.5,
    vote_count: 12600,
    release_date: '1990-09-12',
    original_language: 'en',
    genre_ids: [18, 80],
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    trailer: '2ilzidi_J8Q',
    bayesian_score: 4.16,
    rating_count: 126,
    popularity: 86.4
  },
  {
    id: 2493,
    movieId: 1197,
    title: 'The Princess Bride',
    original_title: 'The Princess Bride',
    overview: 'In this enchantingly cracked fairy tale, the beautiful Princess Buttercup and the dashing Westley must overcome staggering odds to find happiness amid six-fingered swordsmen, shrieking eels, and rodents of unusual size.',
    poster_path: '/2FC9L9MrjBoGHYjYZjdWQdopVYb.jpg',
    backdrop_path: '/6Tuc3Z7X0XHo0tA0EcznlINwZY9.jpg',
    vote_average: 7.7,
    vote_count: 4500,
    release_date: '1987-09-18',
    original_language: 'en',
    genre_ids: [12, 14, 35, 10749],
    genres: [{ id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 35, name: 'Comedy' }, { id: 10749, name: 'Romance' }],
    trailer: 'O3CIXEAjcc8',
    bayesian_score: 4.15,
    rating_count: 142,
    popularity: 76.2
  },

  // --- INDIAN REGIONAL CINEMA (VERIFIED REAL POSTERS) ---
  {
    id: 579974,
    movieId: 90001,
    title: 'RRR',
    original_title: 'రౌద్రం రణం రుధిరం',
    overview: 'A fictional history of two legendary revolutionaries\' journey away from home before they began fighting for their country in the 1920s.',
    poster_path: '/i0Y0wP8H6SRgjr6QmuwbtQbS24D.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    vote_average: 8.0,
    vote_count: 1600,
    release_date: '2022-03-24',
    original_language: 'te',
    genre_ids: [28, 18],
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }],
    trailer: 'NgBoMJy386M',
    bayesian_score: 4.30,
    rating_count: 115,
    popularity: 88.6
  },
  {
    id: 256040,
    movieId: 90002,
    title: 'Baahubali: The Beginning',
    original_title: 'బాహుబలి: ద బిగినింగ్',
    overview: 'In the kingdom of Mahishmati, Shivudu is raised by tribal people, unaware of his noble lineage. As he embarks on an adventure, he uncovers the truth of his heritage and the epic civil conflict.',
    poster_path: '/e9ZEuHGHZ06AToHlfN1L7nejJ7W.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    vote_average: 7.7,
    vote_count: 750,
    release_date: '2015-07-10',
    original_language: 'te',
    genre_ids: [28, 12, 18, 14],
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 14, name: 'Fantasy' }],
    trailer: 'sOEg_ynzQU4',
    bayesian_score: 4.25,
    rating_count: 95,
    popularity: 84.1
  },
  {
    id: 350312,
    movieId: 90003,
    title: 'Baahubali 2: The Conclusion',
    original_title: 'బాహుబలి 2: ది కన్‌క్లూజన్',
    overview: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.',
    poster_path: '/zW2EJ3lhdc7R56W91hHca5xjq1m.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    vote_average: 7.6,
    vote_count: 850,
    release_date: '2017-04-28',
    original_language: 'te',
    genre_ids: [28, 12, 14],
    genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }],
    trailer: 'qD-6d8Wo3do',
    bayesian_score: 4.22,
    rating_count: 88,
    popularity: 82.5
  },
  {
    id: 20453,
    movieId: 90004,
    title: '3 Idiots',
    original_title: '3 Idiots',
    overview: 'Two friends embark on a quest for a lost buddy. On this journey, they reminisce about their college days and the friend who inspired them to think differently, even as the rest of the world called them "idiots".',
    poster_path: '/66A9MqXOyVFCssoloscw79z8swq.jpg',
    backdrop_path: '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
    vote_average: 8.0,
    vote_count: 2200,
    release_date: '2009-12-25',
    original_language: 'hi',
    genre_ids: [35, 18],
    genres: [{ id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }],
    trailer: 'K0eDlFX9GMc',
    bayesian_score: 4.28,
    rating_count: 140,
    popularity: 89.2
  },
  {
    id: 360814,
    movieId: 90005,
    title: 'Dangal',
    original_title: 'दंगल',
    overview: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
    poster_path: '/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg',
    backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    vote_average: 8.0,
    vote_count: 1050,
    release_date: '2016-12-21',
    original_language: 'hi',
    genre_ids: [18, 28],
    genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }],
    trailer: 'x_7YlGv9u1g',
    bayesian_score: 4.24,
    rating_count: 75,
    popularity: 83.4
  },
  {
    id: 564147,
    movieId: 90011,
    title: 'K.G.F: Chapter 1',
    original_title: 'ಕೆ.ಜಿ.ಎಫ್: ಅಧ್ಯಾಯ ೧',
    overview: 'In the 1970s, a fierce rebel rises against brutal oppression and becomes the symbol of hope for thousands of enslaved laborers in the Kolar Gold Fields.',
    poster_path: '/ltHlJwvxKv7d0ooCiKSAvfwV9tX.jpg',
    backdrop_path: '/zqkmTXzjkAgXmEWLRsY4UpTWCeo.jpg',
    vote_average: 7.8,
    vote_count: 620,
    release_date: '2018-12-21',
    original_language: 'kn',
    genre_ids: [28, 18, 80],
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    trailer: 'qXgF-iJ_ezE',
    bayesian_score: 4.19,
    rating_count: 78,
    popularity: 84.6
  },
  {
    id: 76600,
    movieId: 90006,
    title: 'Vikram',
    original_title: 'விக்ரம்',
    overview: 'A high-octane action thriller where a special investigator is assigned a case of serial killings, leading him into a war between a rogue black-ops squad and a ruthless narcotics syndicate.',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    vote_average: 7.9,
    vote_count: 550,
    release_date: '2022-06-03',
    original_language: 'ta',
    genre_ids: [28, 53, 80],
    genres: [{ id: 28, name: 'Action' }, { id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],
    trailer: 'OKBMCL-hrPU',
    bayesian_score: 4.20,
    rating_count: 65,
    popularity: 85.1
  },
  {
    id: 877269,
    movieId: 90007,
    title: 'Jai Bhim',
    original_title: 'ஜெய் பீம்',
    overview: 'When a tribal man is arrested for a case of alleged theft, his wife turns to a human-rights lawyer to help bring justice and uncover systemic brutality.',
    poster_path: '/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg',
    backdrop_path: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    vote_average: 8.1,
    vote_count: 420,
    release_date: '2021-11-02',
    original_language: 'ta',
    genre_ids: [18, 80],
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    trailer: 'Gc6dEDnL8JA',
    bayesian_score: 4.26,
    rating_count: 58,
    popularity: 80.3
  },
  {
    id: 1184918,
    movieId: 90008,
    title: 'Manjummel Boys',
    original_title: 'മഞ്ഞുമ്മൽ ബോയ്സ്',
    overview: 'A group of friends from a small town embark on a vacation to Kodaikanal, but when one slips into a perilous subterranean cave, the rest mount an impossible rescue.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTsqJiOEZR4f3NddFj675k4G.jpg',
    vote_average: 8.1,
    vote_count: 320,
    release_date: '2024-02-22',
    original_language: 'ml',
    genre_ids: [12, 18, 53],
    genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    trailer: 'id8qE5_m0hE',
    bayesian_score: 4.24,
    rating_count: 52,
    popularity: 87.2
  },
  {
    id: 247075,
    movieId: 90009,
    title: 'Drishyam',
    original_title: 'ദൃശ്യം',
    overview: 'A man goes to extreme lengths to protect his family after they commit an accidental crime under duress, constructing an alibi out of cinematic memories.',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
    vote_average: 8.2,
    vote_count: 480,
    release_date: '2013-12-19',
    original_language: 'ml',
    genre_ids: [80, 18, 53],
    genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    trailer: 'A6tA_p5U4dM',
    bayesian_score: 4.28,
    rating_count: 70,
    popularity: 81.7
  },
  {
    id: 1024535,
    movieId: 90010,
    title: 'Kantara',
    original_title: 'ಕಾಂತಾರ',
    overview: 'When greed paves the way for betrayal, scheming and murder, a young tribal champion invokes the primal spirit of Panjurli Daiva to protect their sacred ancestral forest.',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg',
    vote_average: 7.9,
    vote_count: 410,
    release_date: '2022-09-30',
    original_language: 'kn',
    genre_ids: [28, 18, 53],
    genres: [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    trailer: '8mrVmf239GU',
    bayesian_score: 4.22,
    rating_count: 62,
    popularity: 83.8
  },
  {
    id: 395992,
    movieId: 90012,
    title: 'Sairat',
    original_title: 'सैराट',
    overview: 'In rural Maharashtra, two college students from polar opposite castes fall deeply in love, defying entrenched societal boundaries with gut-wrenching consequences.',
    poster_path: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdrop_path: '/7c9UVPPiTPltouxShY9JH93ndBM.jpg',
    vote_average: 8.0,
    vote_count: 240,
    release_date: '2016-04-29',
    original_language: 'mr',
    genre_ids: [18, 10749],
    genres: [{ id: 18, name: 'Drama' }, { id: 10749, name: 'Romance' }],
    trailer: 'wMrvhwK_L14',
    bayesian_score: 4.22,
    rating_count: 45,
    popularity: 76.5
  },
  {
    id: 374949,
    movieId: 90013,
    title: 'Natsamrat',
    original_title: 'नटसम्राट',
    overview: 'An acclaimed Shakespearean stage actor retires at the peak of his fame, only to face tragic neglect, ego clashes, and painful indignity from his own grown children.',
    poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdrop_path: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    vote_average: 8.1,
    vote_count: 180,
    release_date: '2016-01-01',
    original_language: 'mr',
    genre_ids: [18],
    genres: [{ id: 18, name: 'Drama' }],
    trailer: 'zQ9U0Q1R2S3',
    bayesian_score: 4.25,
    rating_count: 40,
    popularity: 72.8
  }
,
  // --- EXPANDED BIG DATA & SVD SIMILARITY BENCHMARKS ---
  {
    "id": 240,
    "movieId": 1221,
    "title": "The Godfather: Part II",
    "original_title": "The Godfather: Part II",
    "overview": "The continuing saga of the Corleone crime family tells the story of a young Vito Corleone growing up in Sicily and in 1910s New York, and follows Michael Corleone in the 1950s as he attempts to expand the family business into Las Vegas, Hollywood and Cuba.",
    "poster_path": "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    "backdrop_path": "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
    "vote_average": 8.6,
    "vote_count": 12500,
    "release_date": "1974-12-20",
    "original_language": "en",
    "genre_ids": [
      18,
      80
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "trailer": "9O1Iy9od7-A",
    "bayesian_score": 4.25,
    "rating_count": 129,
    "popularity": 92.5
  },
  {
    "id": 629,
    "movieId": 50,
    "title": "The Usual Suspects",
    "original_title": "The Usual Suspects",
    "overview": "Held in an L.A. interrogation room, Verbal Kint attempts to convince the feds that a mythic crime lord, Keyser Soze, not only exists, but was also responsible for drawing him and his four partners into a multi-million dollar heist.",
    "poster_path": "/99X2SgyFunJFXGAYnDv3sb9pnUD.jpg",
    "backdrop_path": "/99X2SgyFunJFXGAYnDv3sb9pnUD.jpg",
    "vote_average": 8.2,
    "vote_count": 10400,
    "release_date": "1995-07-19",
    "original_language": "en",
    "genre_ids": [
      18,
      80,
      53,
      9648
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 9648,
        "name": "Mystery"
      }
    ],
    "trailer": "9novTsiqS3U",
    "bayesian_score": 4.28,
    "rating_count": 204,
    "popularity": 88.6
  },
  {
    "id": 85,
    "movieId": 1198,
    "title": "Raiders of the Lost Ark",
    "original_title": "Raiders of the Lost Ark",
    "overview": "When Dr. Indiana Jones – the tweed-suited professor who just happens to be a celebrated archaeologist – is hired by the government to locate the legendary Ark of the Covenant, he finds himself up against the entire Nazi regime.",
    "poster_path": "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
    "backdrop_path": "/ceG9VzoRAVGwivFU403Wc3AHRys.jpg",
    "vote_average": 7.9,
    "vote_count": 12900,
    "release_date": "1981-06-12",
    "original_language": "en",
    "genre_ids": [
      12,
      28
    ],
    "genres": [
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 28,
        "name": "Action"
      }
    ],
    "trailer": "XkkzK5XxCbA",
    "bayesian_score": 4.21,
    "rating_count": 200,
    "popularity": 89.2
  },
  {
    "id": 935,
    "movieId": 750,
    "title": "Dr. Strangelove",
    "original_title": "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    "overview": "After the insane General Jack D. Ripper initiates a nuclear strike on the Soviet Union, a war room full of politicians, generals and a Russian diplomat all frantically try to stop it.",
    "poster_path": "/gHm96BRW4GoI339rF1vYoYTB6Qe.jpg",
    "backdrop_path": "/gHm96BRW4GoI339rF1vYoYTB6Qe.jpg",
    "vote_average": 8.2,
    "vote_count": 5600,
    "release_date": "1964-01-29",
    "original_language": "en",
    "genre_ids": [
      35,
      10752
    ],
    "genres": [
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 10752,
        "name": "War"
      }
    ],
    "trailer": "pgqXv35Bv80",
    "bayesian_score": 4.26,
    "rating_count": 97,
    "popularity": 78.4
  },
  {
    "id": 272,
    "movieId": 33794,
    "title": "Batman Begins",
    "original_title": "Batman Begins",
    "overview": "Driven by tragedy, billionaire Bruce Wayne dedicates his life to uncovering and defeating the corruption that plagues his home, Gotham City. Driven by fear, he creates a legendary new identity: Batman.",
    "poster_path": "/sPX89Td70IDDjVr85jdSBb4rWGr.jpg",
    "backdrop_path": "/sPX89Td70IDDjVr85jdSBb4rWGr.jpg",
    "vote_average": 7.7,
    "vote_count": 20500,
    "release_date": "2005-06-10",
    "original_language": "en",
    "genre_ids": [
      28,
      80,
      18
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "trailer": "neY2xVmOfUM",
    "bayesian_score": 3.98,
    "rating_count": 153,
    "popularity": 90.1
  },
  {
    "id": 49026,
    "movieId": 91529,
    "title": "The Dark Knight Rises",
    "original_title": "The Dark Knight Rises",
    "overview": "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department.",
    "poster_path": "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
    "backdrop_path": "/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg",
    "vote_average": 7.8,
    "vote_count": 22100,
    "release_date": "2012-07-16",
    "original_language": "en",
    "genre_ids": [
      28,
      80,
      18,
      53
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "trailer": "g8evyE9TuYg",
    "bayesian_score": 4.01,
    "rating_count": 145,
    "popularity": 92.4
  },
  {
    "id": 1726,
    "movieId": 59315,
    "title": "Iron Man",
    "original_title": "Iron Man",
    "overview": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    "poster_path": "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    "backdrop_path": "/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
    "vote_average": 7.6,
    "vote_count": 26000,
    "release_date": "2008-04-30",
    "original_language": "en",
    "genre_ids": [
      28,
      878,
      12
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 12,
        "name": "Adventure"
      }
    ],
    "trailer": "8ugaeA-nMTc",
    "bayesian_score": 3.98,
    "rating_count": 192,
    "popularity": 94
  },
  {
    "id": 19995,
    "movieId": 72998,
    "title": "Avatar",
    "original_title": "Avatar",
    "overview": "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    "poster_path": "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    "backdrop_path": "/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    "vote_average": 7.6,
    "vote_count": 31000,
    "release_date": "2009-12-15",
    "original_language": "en",
    "genre_ids": [
      28,
      12,
      14,
      878
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "trailer": "5PSNL1qE6VY",
    "bayesian_score": 3.72,
    "rating_count": 170,
    "popularity": 95.2
  },
  {
    "id": 10681,
    "movieId": 60069,
    "title": "WALL·E",
    "original_title": "WALL·E",
    "overview": "What if mankind had to leave Earth and somebody forgot to turn the last robot off? A small, waste-collecting robot embarks on a space journey that will ultimately decide the fate of mankind.",
    "poster_path": "/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    "backdrop_path": "/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg",
    "vote_average": 8.1,
    "vote_count": 18000,
    "release_date": "2008-06-22",
    "original_language": "en",
    "genre_ids": [
      16,
      10751,
      878
    ],
    "genres": [
      {
        "id": 16,
        "name": "Animation"
      },
      {
        "id": 10751,
        "name": "Family"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "trailer": "CZ1CATNbXg0",
    "bayesian_score": 4.05,
    "rating_count": 104,
    "popularity": 89.6
  },
  {
    "id": 14160,
    "movieId": 68954,
    "title": "Up",
    "original_title": "Up",
    "overview": "Carl Fredricksen spent his entire life dreaming of exploring the globe. At age 78, he ties thousands of balloons to his house and embarks on a whimsical journey with an 8-year-old scout named Russell.",
    "poster_path": "/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg",
    "backdrop_path": "/mFvoEwSfLqbcWwFsDjQebn9bzFe.jpg",
    "vote_average": 8,
    "vote_count": 19500,
    "release_date": "2009-05-28",
    "original_language": "en",
    "genre_ids": [
      16,
      35,
      10751,
      12
    ],
    "genres": [
      {
        "id": 16,
        "name": "Animation"
      },
      {
        "id": 35,
        "name": "Comedy"
      },
      {
        "id": 10751,
        "name": "Family"
      },
      {
        "id": 12,
        "name": "Adventure"
      }
    ],
    "trailer": "ORFWdXl_zJ4",
    "bayesian_score": 4,
    "rating_count": 105,
    "popularity": 88
  },
  {
    "id": 1422,
    "movieId": 48516,
    "title": "The Departed",
    "original_title": "The Departed",
    "overview": "To take down South Boston's Irish Mafia, the police send in one of their own to infiltrate the underworld, not realizing the syndicate has done likewise.",
    "poster_path": "/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
    "backdrop_path": "/nT97ifVT2J1yMQmeq20Qblg61T.jpg",
    "vote_average": 8.2,
    "vote_count": 14500,
    "release_date": "2006-10-04",
    "original_language": "en",
    "genre_ids": [
      18,
      53,
      80
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "trailer": "iojhqm0JTW4",
    "bayesian_score": 4.12,
    "rating_count": 107,
    "popularity": 91
  },
  {
    "id": 24,
    "movieId": 6874,
    "title": "Kill Bill: Vol. 1",
    "original_title": "Kill Bill: Vol. 1",
    "overview": "An assassin is shot by her ruthless employer, Bill, and other members of their assassination circle – but she lives to plot her roaring vengeance.",
    "poster_path": "/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
    "backdrop_path": "/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg",
    "vote_average": 8,
    "vote_count": 17200,
    "release_date": "2003-10-10",
    "original_language": "en",
    "genre_ids": [
      28,
      80
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "trailer": "7kBseWTtZTs",
    "bayesian_score": 3.96,
    "rating_count": 131,
    "popularity": 90.5
  },
  {
    "id": 393,
    "movieId": 7438,
    "title": "Kill Bill: Vol. 2",
    "original_title": "Kill Bill: Vol. 2",
    "overview": "The Bride unwaveringly continues on her roaring rampage of revenge against the band of assassins who had tried to kill her and her unborn child.",
    "poster_path": "/2yhg0mZQMhDyvUQ4rG1IZ4oIA8L.jpg",
    "backdrop_path": "/2yhg0mZQMhDyvUQ4rG1IZ4oIA8L.jpg",
    "vote_average": 7.9,
    "vote_count": 13500,
    "release_date": "2004-04-16",
    "original_language": "en",
    "genre_ids": [
      28,
      80,
      53
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "trailer": "WTt8cCIvGYI",
    "bayesian_score": 3.86,
    "rating_count": 110,
    "popularity": 87.5
  },
  {
    "id": 11324,
    "movieId": 74458,
    "title": "Shutter Island",
    "original_title": "Shutter Island",
    "overview": "World War II soldier-turned-U.S. Marshal Teddy Daniels investigates the disappearance of a patient from a hospital for the criminally insane.",
    "poster_path": "/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg",
    "backdrop_path": "/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg",
    "vote_average": 8.2,
    "vote_count": 23500,
    "release_date": "2010-02-14",
    "original_language": "en",
    "genre_ids": [
      18,
      53,
      9648
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 9648,
        "name": "Mystery"
      }
    ],
    "trailer": "5iaYLCiq5RM",
    "bayesian_score": 4.02,
    "rating_count": 67,
    "popularity": 93.1
  },
  {
    "id": 68718,
    "movieId": 99114,
    "title": "Django Unchained",
    "original_title": "Django Unchained",
    "overview": "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.",
    "poster_path": "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    "backdrop_path": "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg",
    "vote_average": 8.2,
    "vote_count": 26000,
    "release_date": "2012-12-25",
    "original_language": "en",
    "genre_ids": [
      18,
      37
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 37,
        "name": "Western"
      }
    ],
    "trailer": "_iH0UBYDI4g",
    "bayesian_score": 4.02,
    "rating_count": 71,
    "popularity": 94.8
  },
  {
    "id": 37799,
    "movieId": 80463,
    "title": "The Social Network",
    "original_title": "The Social Network",
    "overview": "In 2003, Harvard undergrad Mark Zuckerberg begins work on a new concept that eventually turns into the global social network known as Facebook.",
    "poster_path": "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    "backdrop_path": "/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    "vote_average": 7.8,
    "vote_count": 17000,
    "release_date": "2010-10-01",
    "original_language": "en",
    "genre_ids": [
      18
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "trailer": "lB95KLmpLR4",
    "bayesian_score": 3.81,
    "rating_count": 57,
    "popularity": 86.4
  },
  {
    "id": 1124,
    "movieId": 48780,
    "title": "The Prestige",
    "original_title": "The Prestige",
    "overview": "A mysterious story of two magicians whose intense rivalry leads them on a life-long battle for supremacy -- full of obsession, deceit and jealousy with dangerous consequences.",
    "poster_path": "/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg",
    "backdrop_path": "/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg",
    "vote_average": 8.2,
    "vote_count": 16000,
    "release_date": "2006-10-19",
    "original_language": "en",
    "genre_ids": [
      18,
      9648,
      878
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 9648,
        "name": "Mystery"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "trailer": "o4gHCmTQDVI",
    "bayesian_score": 4.06,
    "rating_count": 90,
    "popularity": 91.2
  },
  {
    "id": 22,
    "movieId": 6539,
    "title": "Pirates of the Caribbean: The Curse of the Black Pearl",
    "original_title": "Pirates of the Caribbean: The Curse of the Black Pearl",
    "overview": "When wily pirate Captain Barbossa seizes Jack Sparrow’s beloved ship, the Black Pearl, and kidnaps the governor’s daughter, blacksmith Will Turner teams up with Jack to rescue her.",
    "poster_path": "/poHwCZeWzJCShH7tOjg8RIoyjcw.jpg",
    "backdrop_path": "/poHwCZeWzJCShH7tOjg8RIoyjcw.jpg",
    "vote_average": 7.8,
    "vote_count": 20000,
    "release_date": "2003-07-09",
    "original_language": "en",
    "genre_ids": [
      12,
      28,
      14
    ],
    "genres": [
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 14,
        "name": "Fantasy"
      }
    ],
    "trailer": "naQrFxMI370",
    "bayesian_score": 3.75,
    "rating_count": 149,
    "popularity": 93.5
  },
  {
    "id": 58,
    "movieId": 45722,
    "title": "Pirates of the Caribbean: Dead Man's Chest",
    "original_title": "Pirates of the Caribbean: Dead Man's Chest",
    "overview": "Captain Jack Sparrow’s got a blood debt to pay: he owes his soul to the legendary Davy Jones, ghastly Ruler of the Ocean Depths.",
    "poster_path": "/uXEqmloGyP7UXAiphJUu2v2pcuE.jpg",
    "backdrop_path": "/uXEqmloGyP7UXAiphJUu2v2pcuE.jpg",
    "vote_average": 7.4,
    "vote_count": 15500,
    "release_date": "2006-07-06",
    "original_language": "en",
    "genre_ids": [
      12,
      28,
      14
    ],
    "genres": [
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 14,
        "name": "Fantasy"
      }
    ],
    "trailer": "elqrnZaxy",
    "bayesian_score": 3.51,
    "rating_count": 72,
    "popularity": 88.3
  },
  {
    "id": 10528,
    "movieId": 73017,
    "title": "Sherlock Holmes",
    "original_title": "Sherlock Holmes",
    "overview": "Eccentric consulting detective Sherlock Holmes and Doctor John Watson battle to bring down a new nemesis and unravel a deadly plot that could destroy England.",
    "poster_path": "/momkKuWburNTqKBF6ez7rvvYVhE.jpg",
    "backdrop_path": "/momkKuWburNTqKBF6ez7rvvYVhE.jpg",
    "vote_average": 7.2,
    "vote_count": 14000,
    "release_date": "2009-12-23",
    "original_language": "en",
    "genre_ids": [
      28,
      12,
      80,
      9648
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 9648,
        "name": "Mystery"
      }
    ],
    "trailer": "J7nJksXDBWc",
    "bayesian_score": 3.68,
    "rating_count": 79,
    "popularity": 87.2
  },
  {
    "id": 111,
    "movieId": 4262,
    "title": "Scarface",
    "original_title": "Scarface",
    "overview": "After getting a green card in exchange for assassinating a Cuban government official, Tony Montana stakes a claim on the drug trade in Miami.",
    "poster_path": "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    "backdrop_path": "/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg",
    "vote_average": 8.2,
    "vote_count": 11500,
    "release_date": "1983-12-09",
    "original_language": "en",
    "genre_ids": [
      28,
      80,
      18
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "trailer": "cv276Wg3VPw",
    "bayesian_score": 3.92,
    "rating_count": 55,
    "popularity": 91
  },
  {
    "id": 6977,
    "movieId": 55820,
    "title": "No Country for Old Men",
    "original_title": "No Country for Old Men",
    "overview": "Llewelyn Moss stumbles upon dead bodies, $2 million and a hoard of heroin in a Texas desert, but methodical killer Anton Chigurh comes looking for it.",
    "poster_path": "/6d5XOczc226jECq0LIX0siKtgHR.jpg",
    "backdrop_path": "/6d5XOczc226jECq0LIX0siKtgHR.jpg",
    "vote_average": 8,
    "vote_count": 11800,
    "release_date": "2007-11-09",
    "original_language": "en",
    "genre_ids": [
      80,
      18,
      53
    ],
    "genres": [
      {
        "id": 80,
        "name": "Crime"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "trailer": "38A__WT3-o0",
    "bayesian_score": 4.02,
    "rating_count": 64,
    "popularity": 90.2
  },
  {
    "id": 752,
    "movieId": 44191,
    "title": "V for Vendetta",
    "original_title": "V for Vendetta",
    "overview": "In a world in which Great Britain has become a fascist state, a masked vigilante known only as “V” conducts guerrilla warfare against the oppressive government.",
    "poster_path": "/1avD1JeaRiJX5M4ahPdZPypGoGN.jpg",
    "backdrop_path": "/1avD1JeaRiJX5M4ahPdZPypGoGN.jpg",
    "vote_average": 7.9,
    "vote_count": 14200,
    "release_date": "2006-02-23",
    "original_language": "en",
    "genre_ids": [
      28,
      53,
      878
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "trailer": "lSA7mAHolAw",
    "bayesian_score": 3.89,
    "rating_count": 118,
    "popularity": 89.8
  },
  {
    "id": 73,
    "movieId": 2329,
    "title": "American History X",
    "original_title": "American History X",
    "overview": "Derek Vineyard is paroled after serving 3 years in prison. Reformed and fresh out of prison, Derek severs contact with his former white supremacist gang and becomes determined to keep his brother from the same path.",
    "poster_path": "/x2drgoXYZ8484lqyDj7L1CEVR4T.jpg",
    "backdrop_path": "/x2drgoXYZ8484lqyDj7L1CEVR4T.jpg",
    "vote_average": 8.4,
    "vote_count": 11600,
    "release_date": "1998-10-30",
    "original_language": "en",
    "genre_ids": [
      18
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "trailer": "XfQYHqmqvuA",
    "bayesian_score": 4.13,
    "rating_count": 129,
    "popularity": 89
  },
  {
    "id": 36557,
    "movieId": 49272,
    "title": "Casino Royale",
    "original_title": "Casino Royale",
    "overview": "Le Chiffre, a banker to the world's terrorists, is scheduled to participate in a high-stakes poker game in Montenegro. M sends Bond on his maiden mission as a 00 Agent to prevent Le Chiffre from winning.",
    "poster_path": "/lMrxYKKhd4lqRzwUHAy5gcx9PSO.jpg",
    "backdrop_path": "/lMrxYKKhd4lqRzwUHAy5gcx9PSO.jpg",
    "vote_average": 7.5,
    "vote_count": 10800,
    "release_date": "2006-11-14",
    "original_language": "en",
    "genre_ids": [
      12,
      28,
      53
    ],
    "genres": [
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "trailer": "36mnx8ECb4I",
    "bayesian_score": 3.92,
    "rating_count": 81,
    "popularity": 88.5
  },
  {
    "id": 1417,
    "movieId": 48394,
    "title": "Pan's Labyrinth",
    "original_title": "El laberinto del fauno",
    "overview": "In post-civil war Spain, 10-year-old Ofelia enters a mysterious labyrinth, where she meets a faun who reveals that she may be a lost princess from an underground kingdom.",
    "poster_path": "/z7xXihu5wHuSMWymq5VAulPVuvg.jpg",
    "backdrop_path": "/z7xXihu5wHuSMWymq5VAulPVuvg.jpg",
    "vote_average": 7.8,
    "vote_count": 10900,
    "release_date": "2006-08-25",
    "original_language": "es",
    "genre_ids": [
      18,
      14,
      10752
    ],
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 14,
        "name": "Fantasy"
      },
      {
        "id": 10752,
        "name": "War"
      }
    ],
    "trailer": "EqKPmQ3441M",
    "bayesian_score": 3.95,
    "rating_count": 84,
    "popularity": 88
  },
  {
    "id": 1271,
    "movieId": 51662,
    "title": "300",
    "original_title": "300",
    "overview": "King Leonidas of Sparta and a force of 300 men fight the Persians at Thermopylae in 480 B.C., rallying all of Greece against the invasion.",
    "poster_path": "/h7Lcio0c9ohxPhSZg42eTlKIVVY.jpg",
    "backdrop_path": "/h7Lcio0c9ohxPhSZg42eTlKIVVY.jpg",
    "vote_average": 7.2,
    "vote_count": 13900,
    "release_date": "2007-03-07",
    "original_language": "en",
    "genre_ids": [
      28,
      12,
      10752
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 10752,
        "name": "War"
      }
    ],
    "trailer": "UrIbxk7idYA",
    "bayesian_score": 3.68,
    "rating_count": 111,
    "popularity": 88.2
  },
  {
    "id": 187,
    "movieId": 32587,
    "title": "Sin City",
    "original_title": "Sin City",
    "overview": "A stylized neo-noir visual masterpiece following the intertwining stories of tough-as-nails protagonists seeking redemption and revenge in Basin City.",
    "poster_path": "/i66G50wATMmPrvpP95f0XP6ZdVS.jpg",
    "backdrop_path": "/i66G50wATMmPrvpP95f0XP6ZdVS.jpg",
    "vote_average": 7.5,
    "vote_count": 8400,
    "release_date": "2005-04-01",
    "original_language": "en",
    "genre_ids": [
      28,
      53,
      80
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "trailer": "c9f_zI1P_7g",
    "bayesian_score": 3.86,
    "rating_count": 84,
    "popularity": 87
  },
  {
    "id": 17654,
    "movieId": 70286,
    "title": "District 9",
    "original_title": "District 9",
    "overview": "Aliens arrive on Earth to find refuge. Separated from humans in an area called District 9, an agent contracts a virus that alters his DNA, making District 9 the only place he can hide.",
    "poster_path": "/tuGlQkqLxnodDSk6mp5c2wvxUEd.jpg",
    "backdrop_path": "/tuGlQkqLxnodDSk6mp5c2wvxUEd.jpg",
    "vote_average": 7.4,
    "vote_count": 9400,
    "release_date": "2009-08-05",
    "original_language": "en",
    "genre_ids": [
      28,
      878
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 878,
        "name": "Science Fiction"
      }
    ],
    "trailer": "d6wR4hTTn28",
    "bayesian_score": 3.86,
    "rating_count": 65,
    "popularity": 87.8
  },
  {
    "id": 2503,
    "movieId": 54286,
    "title": "The Bourne Ultimatum",
    "original_title": "The Bourne Ultimatum",
    "overview": "Bourne is brought out of hiding once again by reporter Simon Ross. He must uncover his dark past while dodging The Company's best efforts to eradicate him.",
    "poster_path": "/15rMz5MRXFp7CP4VxhjYw4y0FUn.jpg",
    "backdrop_path": "/15rMz5MRXFp7CP4VxhjYw4y0FUn.jpg",
    "vote_average": 7.4,
    "vote_count": 7800,
    "release_date": "2007-08-03",
    "original_language": "en",
    "genre_ids": [
      28,
      18,
      9648,
      53
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 18,
        "name": "Drama"
      },
      {
        "id": 9648,
        "name": "Mystery"
      },
      {
        "id": 53,
        "name": "Thriller"
      }
    ],
    "trailer": "ZT2ZxjU8p28",
    "bayesian_score": 3.91,
    "rating_count": 81,
    "popularity": 87.4
  },
  {
    "id": 13475,
    "movieId": 68358,
    "title": "Star Trek",
    "original_title": "Star Trek",
    "overview": "The fate of the galaxy rests in the hands of bitter rivals: James Kirk and Spock. Their unlikely but powerful partnership leads the USS Enterprise crew through unimaginable danger.",
    "poster_path": "/9vaRPXj44Q2meHgt3VVfQufiHOJ.jpg",
    "backdrop_path": "/9vaRPXj44Q2meHgt3VVfQufiHOJ.jpg",
    "vote_average": 7.4,
    "vote_count": 9800,
    "release_date": "2009-05-06",
    "original_language": "en",
    "genre_ids": [
      878,
      28,
      12
    ],
    "genres": [
      {
        "id": 878,
        "name": "Science Fiction"
      },
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 12,
        "name": "Adventure"
      }
    ],
    "trailer": "pKFUZ10Wmbw",
    "bayesian_score": 3.9,
    "rating_count": 59,
    "popularity": 88
  },
  {
    "id": 8374,
    "movieId": 3275,
    "title": "The Boondock Saints",
    "original_title": "The Boondock Saints",
    "overview": "Two Irish Catholic brothers become vigilantes in Boston, wiping out the Russian mob in the name of justice, while an eccentric FBI agent pursues them.",
    "poster_path": "/wtLUmkWg41xFLpvmUWAN1mm65f6.jpg",
    "backdrop_path": "/wtLUmkWg41xFLpvmUWAN1mm65f6.jpg",
    "vote_average": 7.4,
    "vote_count": 3200,
    "release_date": "1999-08-04",
    "original_language": "en",
    "genre_ids": [
      28,
      53,
      80
    ],
    "genres": [
      {
        "id": 28,
        "name": "Action"
      },
      {
        "id": 53,
        "name": "Thriller"
      },
      {
        "id": 80,
        "name": "Crime"
      }
    ],
    "trailer": "ydXojYfCF3U",
    "bayesian_score": 3.77,
    "rating_count": 61,
    "popularity": 85
  },
  {
    "id": 12444,
    "movieId": 81834,
    "title": "Harry Potter and the Deathly Hallows: Part 1",
    "original_title": "Harry Potter and the Deathly Hallows: Part 1",
    "overview": "Harry, Ron and Hermione race against time and evil to destroy the Horcruxes, uncovering the existence of the three most powerful objects in the wizarding world: the Deathly Hallows.",
    "poster_path": "/iGoXIpQb7Pot00EEdwpwPajheZ5.jpg",
    "backdrop_path": "/iGoXIpQb7Pot00EEdwpwPajheZ5.jpg",
    "vote_average": 7.7,
    "vote_count": 18900,
    "release_date": "2010-10-17",
    "original_language": "en",
    "genre_ids": [
      12,
      14
    ],
    "genres": [
      {
        "id": 12,
        "name": "Adventure"
      },
      {
        "id": 14,
        "name": "Fantasy"
      }
    ],
    "trailer": "MxqsmsA8y5k",
    "bayesian_score": 3.99,
    "rating_count": 47,
    "popularity": 91.5
  },
  {
    "id": 16869,
    "movieId": 68157,
    "title": "Inglourious Basterds",
    "original_title": "Inglourious Basterds",
    "overview": "In Nazi-occupied France during World War II, a group of Jewish-American soldiers known as 'The Basterds' are chosen specifically to spread fear throughout the Third Reich by scalping and brutally killing Nazis.",
    "poster_path": "/aupnPtagH9JVBuMrGEanf4iqXEQ.jpg",
    "backdrop_path": "/aupnPtagH9JVBuMrGEanf4iqXEQ.jpg",
    "vote_average": 8.2,
    "vote_count": 21500,
    "release_date": "2009-08-19",
    "original_language": "en",
    "genre_ids": [18, 53, 10752],
    "genres": [{ "id": 18, "name": "Drama" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }],
    "trailer": "KnrRy6kSFF0",
    "bayesian_score": 4.10,
    "rating_count": 128,
    "popularity": 93.4
  },
  {
    "id": 364150,
    "movieId": 172591,
    "title": "The Godfather Trilogy: 1901-1980",
    "original_title": "The Godfather Trilogy: 1901-1980",
    "overview": "Francis Ford Coppola's chronological re-cut of the legendary Godfather trilogy, tracking the Corleone dynasty across generations.",
    "poster_path": "/xvT9RyO9UdNSc1NRhXnhTujlQWK.jpg",
    "backdrop_path": "/xvT9RyO9UdNSc1NRhXnhTujlQWK.jpg",
    "vote_average": 8.8,
    "vote_count": 5200,
    "release_date": "1992-10-15",
    "original_language": "en",
    "genre_ids": [18, 80],
    "genres": [{ "id": 18, "name": "Drama" }, { "id": 80, "name": "Crime" }],
    "trailer": "UaVTIH8mujA",
    "bayesian_score": 4.25,
    "rating_count": 88,
    "popularity": 89.0
  },
  {
    "id": 138843,
    "movieId": 103228,
    "title": "The Conjuring",
    "original_title": "The Conjuring",
    "overview": "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    "poster_path": "/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    "backdrop_path": "/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    "vote_average": 7.5,
    "vote_count": 11000,
    "release_date": "2013-07-18",
    "original_language": "en",
    "genre_ids": [27, 53, 9648],
    "genres": [{ "id": 27, "name": "Horror" }, { "id": 53, "name": "Thriller" }, { "id": 9648, "name": "Mystery" }],
    "trailer": "k10ETZ41q5o",
    "bayesian_score": 4.02,
    "rating_count": 85,
    "popularity": 91.0
  },
  {
    "id": 538858,
    "movieId": 194448,
    "title": "Tumbbad",
    "original_title": "Tumbbad",
    "overview": "A mythological folk horror following a greedy man's relentless pursuit of a cursed ancestral treasure guarded by the fallen god Hastar in a village where it never stops raining.",
    "poster_path": "/vzjZAKozbDplHWcQXbXo0APKxst.jpg",
    "backdrop_path": "/vzjZAKozbDplHWcQXbXo0APKxst.jpg",
    "vote_average": 8.3,
    "vote_count": 1400,
    "release_date": "2018-10-12",
    "original_language": "hi",
    "genre_ids": [27, 14, 18],
    "genres": [{ "id": 27, "name": "Horror" }, { "id": 14, "name": "Fantasy" }, { "id": 18, "name": "Drama" }],
    "trailer": "sN75MPxgvX8",
    "bayesian_score": 4.30,
    "rating_count": 92,
    "popularity": 92.5
  },
  {
    "id": 533991,
    "movieId": 192803,
    "title": "Stree",
    "original_title": "Stree",
    "overview": "In the small town of Chanderi, the menfolk live in fear of an evil spirit named Stree who abducts men in the night during festival season.",
    "poster_path": "/euhgW6hpDYw7nxFDjqHn0eKvQPX.jpg",
    "backdrop_path": "/euhgW6hpDYw7nxFDjqHn0eKvQPX.jpg",
    "vote_average": 7.3,
    "vote_count": 1200,
    "release_date": "2018-08-31",
    "original_language": "hi",
    "genre_ids": [27, 35],
    "genres": [{ "id": 27, "name": "Horror" }, { "id": 35, "name": "Comedy" }],
    "trailer": "gzeaGcLLl_A",
    "bayesian_score": 3.95,
    "rating_count": 65,
    "popularity": 89.0
  },
  {
    "id": 274,
    "movieId": 593,
    "title": "The Silence of the Lambs",
    "original_title": "The Silence of the Lambs",
    "overview": "FBI trainee Clarice Starling seeks the advice of the imprisoned cannibalistic psychiatrist Dr. Hannibal Lecter to apprehend another serial killer.",
    "poster_path": "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    "backdrop_path": "/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg",
    "vote_average": 8.3,
    "vote_count": 15800,
    "release_date": "1991-02-01",
    "original_language": "en",
    "genre_ids": [80, 18, 53, 27],
    "genres": [{ "id": 80, "name": "Crime" }, { "id": 18, "name": "Drama" }, { "id": 53, "name": "Thriller" }, { "id": 27, "name": "Horror" }],
    "trailer": "W6Mm8Sbe__o",
    "bayesian_score": 4.32,
    "rating_count": 279,
    "popularity": 93.0
  },
  {
    "id": 447332,
    "movieId": 185135,
    "title": "A Quiet Place",
    "original_title": "A Quiet Place",
    "overview": "A family is forced to navigate their lives in silence while hiding from blind creatures with ultra-sensitive hearing that hunt by sound.",
    "poster_path": "/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
    "backdrop_path": "/nAU74GmpUk7t5iklEp3bufwDq4n.jpg",
    "vote_average": 7.4,
    "vote_count": 13600,
    "release_date": "2018-04-03",
    "original_language": "en",
    "genre_ids": [27, 878, 53],
    "genres": [{ "id": 27, "name": "Horror" }, { "id": 878, "name": "Science Fiction" }, { "id": 53, "name": "Thriller" }],
    "trailer": "WR7cc5t7tv8",
    "bayesian_score": 3.98,
    "rating_count": 98,
    "popularity": 90.0
  },
  {
    "id": 419430,
    "movieId": 168252,
    "title": "Get Out",
    "original_title": "Get Out",
    "overview": "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception reaches a boiling point.",
    "poster_path": "/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    "backdrop_path": "/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    "vote_average": 7.6,
    "vote_count": 16500,
    "release_date": "2017-02-24",
    "original_language": "en",
    "genre_ids": [27, 9648, 53],
    "genres": [{ "id": 27, "name": "Horror" }, { "id": 9648, "name": "Mystery" }, { "id": 53, "name": "Thriller" }],
    "trailer": "DzfpyUB60YY",
    "bayesian_score": 4.08,
    "rating_count": 112,
    "popularity": 92.0
  },
  {
    "id": 694,
    "movieId": 1258,
    "title": "The Shining",
    "original_title": "The Shining",
    "overview": "Jack Torrance accepts a caretaker job at the isolated Overlook Hotel for the winter, where evil psychic phenomena slowly drive him into a violent insanity.",
    "poster_path": "/uAR0AWqhQL1hQa69UDEbb2rE5Wx.jpg",
    "backdrop_path": "/uAR0AWqhQL1hQa69UDEbb2rE5Wx.jpg",
    "vote_average": 8.2,
    "vote_count": 17000,
    "release_date": "1980-05-23",
    "original_language": "en",
    "genre_ids": [27, 53],
    "genres": [{ "id": 27, "name": "Horror" }, { "id": 53, "name": "Thriller" }],
    "trailer": "S01444524X8",
    "bayesian_score": 4.22,
    "rating_count": 198,
    "popularity": 91.5
  }
];

module.exports = {
  CATALOG
};
