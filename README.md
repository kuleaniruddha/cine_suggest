# 🎬 CineAI — Big Data Movie Intelligence & Recommendation Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20(Vite)-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Data%20Science-Python%20%7C%20Scikit--Learn-3776AB?logo=python&logoColor=white)](https://scikit-learn.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%203-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An enterprise-grade, Netflix-inspired Cinema Discovery & Big Data Recommendation Platform. Powered by MovieLens (100,000+ ratings), Truncated SVD Matrix Factorization, Content-Based Cosine Similarity, Bayesian Weighted Ratings, and an interactive 3-step AI Cinema Assistant.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Machine Learning & Recommendation Architecture](#-machine-learning--recommendation-architecture)
- [UX Modes: Friendly vs Data Scientist](#-ux-modes-friendly-vs-data-scientist)
- [Interactive CineAI Assistant](#-interactive-cineai-assistant)
- [System Architecture](#-system-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [REST API Reference](#-rest-api-reference)
- [Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#1-prerequisites)
  - [Installation](#2-installation)
  - [Running the Application](#3-running-the-application)
- [Docker Deployment](#-docker-deployment)
- [Big Data Pipeline](#-big-data-pipeline)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🌟 Overview

**CineAI** bridges the gap between sophisticated Big Data Recommender Systems and end-user entertainment. Standard movie apps often rely on simple popularity counts or black-box APIs that break when rate-limited. CineAI combines:

1. **MovieLens 100K Benchmark Dataset**: Over 100,836 real user ratings processed through offline machine learning pipelines.
2. **Hybrid Collaborative + Content-Based Ensemble**: Delivering tailored recommendations based on user interaction matrices and multi-genre vectors.
3. **Instant Personalization Engine**: Reacts in real time when users favorite or rate films.
4. **Conversational Cinema Assistant**: An AI concierge that guides users through a 3-step questionnaire or responds to free-text queries like *"movies like Interstellar"* or *"horror"*.
5. **Zero-Latency Resilience**: An enriched localized landmark catalog combined with active circuit breakers to ensure 100% poster visibility and sub-15ms response times.

---

## ✨ Key Features

### 1. ❤️ "Because You Loved..." Instant Personalization
- Whenever a user clicks the **Favorite (❤️)** button on any movie card, the system immediately recalculates cinematic DNA alignment.
- A dynamic **"Because You Loved [Movie Title]"** spotlight row instantly appears on the Home Page and Big Data Hub.
- Features one-click chips to toggle between all your previously favorited films with real-time score updates.

### 2. 🤖 CineAI Conversational Assistant
- **3-Step Smart Questionnaire**:
  - **Step 1 (Language / Film Industry)**: 🌐 Hollywood, 🇮🇳 Telugu, 🇮🇳 Hindi, 🇮🇳 Tamil, 🇮🇳 Malayalam, 🇰🇷 Korean, 🇯🇵 Anime, or 🌍 Any.
  - **Step 2 (Vibe / Genre)**: 🧠 Mind-Bending Sci-Fi, 💥 High-Octane Action, 😂 Comedy, 👻 Spine-Chilling Horror, 😱 Thriller, 🎭 Drama, 💖 Romance, 🕵️ Crime, 🔍 Mystery, 🎨 Animation, 🧙 Fantasy.
  - **Step 3 (Era / Tone)**: 🚀 Modern Hits (2018+), 📼 Iconic Classics (90s-2000s), 🏆 Certified Masterpieces, or 🍿 Fast-Paced Entertainers.
- **Natural Language Understanding**: Type queries like *"movies like Inception"*, *"recommend Telugu blockbusters"*, or *"horror"* (with typo tolerance for inputs like `"hoorir"`).
- **Rich Interactive Cards**: Each movie card shows Vibe Match percentages, release year, star rating, and direct modal links to watch trailers and synopsis.

### 3. 🖼️ Bulletproof Visuals & Verified CDN Media
- 75+ landmark titles pre-cached with live, verified TMDB CDN poster hashes.
- Intelligent `onError` handlers with stylized theatrical cover fallbacks (film badge, genre pill, ambient glow) so **no blank boxes or broken image icons ever appear**.

### 4. ⚡ Extreme Speed: Sub-15ms Latency
- High-performance SQLite database connection with indexed user watchlists, ratings, and favorites.
- Active circuit breaker prevents TMDB rate-limiting from slowing down the frontend.
- Precomputed SVD components and Cosine matrices allow instant matrix multiplications on the fly.

---

## 🔬 Machine Learning & Recommendation Architecture

CineAI implements four distinct algorithmic layers to deliver movie recommendations:

```
                  ┌──────────────────────────────────────────────┐
                  │          User Interaction / Query            │
                  └──────────────────────┬───────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │ Collaborative Filtering   │                   │ Content-Based Filtering   │
   │  (Truncated SVD Matrix)   │                   │ (Cosine Vector Similarity)│
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │                                               │
                 │              ┌─────────────────┐              │
                 └─────────────►│ Hybrid Ensemble ◄──────────────┘
                                │  Scoring Engine │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │ Bayesian Rating │
                                │ Weighting & Rank│
                                └────────┬────────┘
                                         │
                                         ▼
                               ┌───────────────────┐
                               │ Top-N Personalized│
                               │  Recommendations  │
                               └───────────────────┘
```

### 1. Truncated SVD Matrix Factorization (Collaborative Filtering)
Decomposes the high-dimensional, sparse User-Item interaction matrix $R$ ($610 \times 9742$, 98.3% sparse) into low-rank latent representations:

$$R \approx U_k \Sigma_k V_k^T$$

- **Latent Factors ($k$)**: 20 components capturing hidden user taste dimensions (e.g., preference for cerebral pacing, dark atmosphere, or action intensity).
- **Evaluation**: Validated on an 80/20 train/test split with Root Mean Squared Error (RMSE) tracking.

### 2. Content-Based Cosine Similarity (Story DNA)
Measures the directional alignment of multi-hot genre vectors between target movies and the candidate catalog:

$$\text{Cosine}(A, B) = \frac{A \cdot B}{\|A\|_2 \|B\|_2} = \frac{\sum_{i=1}^n A_i B_i}{\sqrt{\sum_{i=1}^n A_i^2} \sqrt{\sum_{i=1}^n B_i^2}}$$

### 3. Bayesian Weighted Rating (IMDb / MovieLens Benchmark)
Eliminates sample-size bias (preventing movies with 1 rating of 5.0 from outranking classics with 25,000 ratings of 4.5):

$$W = \frac{v}{v + m} \cdot R + \frac{m}{v + m} \cdot C$$

- $v$: Number of ratings for the film
- $m$: Minimum ratings threshold (85th percentile $\approx 35$ ratings)
- $R$: Average rating of the individual movie
- $C$: Mean rating across the entire dataset ($\approx 3.50 / 5.0$)

### 4. Hybrid Ensemble Scoring
Blends all three models dynamically to balance novelty, user taste, and proven quality:

$$\text{FinalScore} = 0.40 \cdot \text{Score}_{\text{SVD}} + 0.35 \cdot \text{Score}_{\text{Content}} + 0.25 \cdot \text{Score}_{\text{Bayesian}}$$

---

## 🍿 UX Modes: Friendly vs Data Scientist

To make Big Data accessible to everyday movie buffs while preserving scientific depth, CineAI features an instant **Dual-Mode Switcher** in the **Big Data Hub**:

| Machine Learning Technique | 🍿 Movie Fan Mode (Default) | 🔬 Data Scientist Mode |
| :--- | :--- | :--- |
| **Hybrid Ensemble** | **✨ CineSmart AI (Best All-Rounder)** | Multi-Model Linear Combination ($\alpha=0.4, \beta=0.35, \gamma=0.25$) |
| **Truncated SVD** | **👥 Taste Twins (People Like You)** | Matrix Factorization ($R_{m \times n} \approx U_{m \times k} \Sigma_{k \times k} V_{n \times k}^T$, $k=20$) |
| **Cosine Similarity** | **🧬 Movie DNA Match** | Multi-Hot Vector Dot Product / $L_2$-Norm Angle Metric |
| **Bayesian Shrinkage** | **🏆 Audience & Critics Gold** | Shrinkage Estimator $W = \frac{v}{v+m}R + \frac{m}{v+m}C$ |

---

## 🤖 Interactive CineAI Assistant

The built-in assistant is accessible anywhere in the app via the floating bottom-right action button:

- **Guided 3-Question Mode**:
  1. *Language*: Hollywood, Tollywood, Bollywood, Kollywood, Malayalam, Korean, Anime, Any
  2. *Genre*: Sci-Fi, Action, Comedy, Horror, Thriller, Drama, Romance, Crime, Mystery, Animation
  3. *Era*: Modern Hits, 90s-2000s Classics, Certified Masterpieces, Popcorn Entertainers
- **Context-Aware Topic Switching**: Completing the questionnaire transitions into free exploration. Typing `"horror"` automatically switches from previous comedy picks to curated horror masterpieces (*Tumbbad*, *Stree*, *The Conjuring*, *The Silence of the Lambs*) without repeating previous questions.
- **Direct Title Resolution**: Mentions of movies like *"Inception"*, *"Interstellar"*, or *"RRR"* immediately return cinema twins that share their themes and pacing.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 18 + Vite)               │
│  - Tailwind CSS v4 Dark UI                             │
│  - CineAI Chatbot (AIAssistantChat.jsx)               │
│  - Big Data Analytics Hub (BigDataAnalytics.jsx)       │
│  - Home / Movie Rows / Detail Modals                   │
└───────────────────────────┬────────────────────────────┘
                            │ Reverse Proxy / HTTP API
┌───────────────────────────▼────────────────────────────┐
│              Backend (Express.js / Node.js)            │
│  - routes/ai.js        (Cinema Assistant Engine)       │
│  - routes/analytics.js (Big Data Insights & SVD)       │
│  - routes/user.js       (Favorites & Personalization)   │
│  - routes/movies.js     (Trending & TMDB Proxy)        │
│  - services/catalog.js  (Verified Landmark Catalog)    │
│  - services/tmdb.js     (Circuit Breaker & TMDB Cache) │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
┌─────────────▼───────────────┐ ┌─────────▼──────────────┐
│   SQLite Database           │ │ Python Big Data ML     │
│  (Users, Watchlist, Ratings)│ │ Pipeline (Scikit-Learn)│
│  ./cineai.db                │ │ dataset/ml-latest-small│
└─────────────────────────────┘ └────────────────────────┘
```

---

## 📂 Project Directory Structure

```text
cineai-movie-app/
├── backend/
│   ├── index.js                  # Express application entrypoint
│   ├── db.js                     # SQLite schema & database connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── ai.js                 # CineAI Assistant & questionnaire router
│   │   ├── analytics.js          # Big Data & ML recommendation endpoints
│   │   ├── auth.js               # User registration & login
│   │   ├── movies.js             # TMDB catalog & search proxy
│   │   ├── user.js               # Favorites, watchlist & "Because You Loved"
│   │   ├── admin.js              # Platform statistics
│   │   └── social.js             # User reviews and community feedback
│   └── services/
│       ├── catalog.js            # Enriched 75+ landmark titles (verified CDN)
│       └── tmdb.js               # TMDB API client with circuit breaker
├── dataset/
│   ├── big_data_pipeline.py      # Python SVD, Cosine & Bayesian pipeline
│   ├── download_dataset.py       # MovieLens dataset fetcher
│   ├── analytics_results.json    # Precalculated matrices & similarity lookup
│   └── ml-latest-small/          # 100k ratings, movies, tags, and links
├── frontend/
│   ├── index.html
│   ├── vite.config.js            # Vite config (port: 3000, API proxy: 8080)
│   └── src/
│       ├── components/
│       │   ├── AIAssistantChat.jsx   # Interactive chatbot with 3-step flow
│       │   ├── MovieCard.jsx         # Card with trailer modal & error fallback
│       │   ├── MovieRow.jsx          # Horizontal sliding movie carousel
│       │   └── Navbar.jsx            # Top navigation bar
│       ├── pages/
│       │   ├── Home.jsx              # Landing page & "Because You Loved" row
│       │   ├── BigDataAnalytics.jsx  # Friendly vs Data Scientist mode hub
│       │   ├── Dashboard.jsx         # User profile, watchlist & ratings
│       │   ├── MovieDetail.jsx       # Deep metadata & trailer player
│       │   └── Search.jsx            # Full-text filter & search
│       └── index.css                 # Tailwind CSS v4 design system
├── Dockerfile
├── docker-compose.yml
└── package.json                  # Root npm orchestration scripts
```

---

## 📡 REST API Reference

### 🤖 CineAI Assistant
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/assistant` | Multi-turn AI cinema questionnaire, entity detection, and movie recommendations. |

### 🔬 Big Data Analytics & Machine Learning
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/insights` | Summary statistics (100k ratings, 98.3% sparsity, rating distributions). |
| `GET` | `/api/analytics/algorithm-recommendations` | Query recommendations by algorithm: `hybrid`, `svd`, `cosine`, or `bayesian`. |
| `GET` | `/api/analytics/similarities/:movieId` | Top-5 content-based movie twins for any specified MovieLens or TMDB ID. |

### ❤️ User Personalization & Favorites
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/user/favorite-recommendations` | Returns 12 personalized movies based on the user's latest favorited film. |
| `POST` | `/api/user/favorites` | Toggle favorite status for a movie. |
| `GET` | `/api/user/favorites` | Get all favorited movies for the authenticated user. |
| `GET` | `/api/user/watchlist` | Get user's saved watchlist. |
| `POST` | `/api/user/watchlist` | Add / remove movie from watchlist. |

### 🎬 Movies & Media
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/movies/trending` | Top trending movies across genres and industries. |
| `GET` | `/api/movies/search?query=...` | Live movie search with fuzzy matching. |
| `GET` | `/api/movies/:id` | Full movie details, genre list, and runtime. |
| `GET` | `/api/movies/:id/videos` | YouTube trailer and teaser URLs. |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Python** (Optional, only needed to re-train MovieLens ML pipeline): Version 3.9+ with `pip`

---

### 2. Installation

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/kuleaniruddha/cine_suggest.git
cd cine_suggest

# Install root, backend, and frontend dependencies in one command
npm run install-all
```

#### Configure Environment Variables
Copy `.env.example` in the project root:

```bash
cp .env.example .env
```

Default settings in `.env`:
```env
PORT=8080
JWT_SECRET=supersecret_cineai_jwt_key_9824
DATABASE_URL=./cineai.db
TMDB_API_KEY=4e44d9029b1270a757cddc766a1bcb63
```
*(Note: An active TMDB API key is included for instant out-of-the-box evaluation. The app also functions fully offline with its local 75+ landmark catalog!)*

---

### 3. Running the Application

Open two terminal windows:

#### Terminal 1 — Backend Server:
```bash
npm run server
```
- Express API starts at: **`http://localhost:8080`**
- SQLite database initializes automatically (`cineai.db`).

#### Terminal 2 — Frontend Client:
```bash
npm run dev
```
- Vite React client starts at: **`http://localhost:3000`**
- Automatically proxies all `/api/*` calls to the backend on `8080`.

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🐳 Docker Deployment

To launch the full application inside isolated Docker containers:

```bash
# Build and run containers
docker-compose up --build
```

The application will be accessible at:
- **Web App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`

To stop:
```bash
docker-compose down
```

---

## 📊 Big Data Pipeline

If you wish to re-download the MovieLens dataset or re-train the Scikit-learn Truncated SVD and Cosine Similarity models:

```bash
cd dataset

# Install Python requirements
pip install numpy pandas scikit-learn

# Run the analytical pipeline
python big_data_pipeline.py
```

This generates an updated `analytics_results.json` containing:
- Pre-calculated SVD component matrices
- Cosine similarity nearest neighbors
- Bayesian weighted ratings for top benchmark films
- Real-time interaction sparsity metrics

---

## 📄 License & Acknowledgments

- **Author**: [Aniruddha Kule](https://github.com/kuleaniruddha)
- **Dataset**: Provided by [GroupLens Research](https://grouplens.org/datasets/movielens/latest/) (University of Minnesota).
- **Metadata & Artwork**: Courtesy of [The Movie Database (TMDB)](https://www.themoviedb.org/).
- **License**: Released under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for cinema lovers and data science enthusiasts.
</p>
