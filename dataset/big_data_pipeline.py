import os
import json
import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import mean_squared_error

def run_big_data_pipeline():
    dataset_dir = os.path.dirname(os.path.abspath(__file__))
    ml_dir = os.path.join(dataset_dir, 'ml-latest-small')

    ratings_path = os.path.join(ml_dir, 'ratings.csv')
    movies_path = os.path.join(ml_dir, 'movies.csv')
    tags_path = os.path.join(ml_dir, 'tags.csv')
    links_path = os.path.join(ml_dir, 'links.csv')

    if not (os.path.exists(ratings_path) and os.path.exists(movies_path)):
        print("Dataset files missing. Run download_dataset.py first.")
        return False

    print("Loading MovieLens dataset files...")
    ratings = pd.read_csv(ratings_path)
    movies = pd.read_csv(movies_path)
    tags = pd.read_csv(tags_path) if os.path.exists(tags_path) else pd.DataFrame()
    links = pd.read_csv(links_path) if os.path.exists(links_path) else pd.DataFrame()

    # Clean links (tmdbId can have NaNs)
    if not links.empty:
        links['tmdbId'] = pd.to_numeric(links['tmdbId'], errors='coerce').fillna(0).astype(int)
        movie_to_tmdb = dict(zip(links['movieId'], links['tmdbId']))
    else:
        movie_to_tmdb = {}

    # 1. Dataset Summary & Matrix Sparsity Analysis
    total_ratings = int(len(ratings))
    total_users = int(ratings['userId'].nunique())
    total_movies = int(movies['movieId'].nunique())
    possible_interactions = total_users * total_movies
    sparsity = float(round((1.0 - (total_ratings / possible_interactions)) * 100, 2))

    # Rating distribution breakdown
    rating_counts = ratings['rating'].value_counts().sort_index().to_dict()
    rating_distribution = {str(k): int(v) for k, v in rating_counts.items()}
    avg_rating_overall = float(round(ratings['rating'].mean(), 2))

    print(f"Dataset Summary: {total_ratings} ratings, {total_users} users, {total_movies} movies. Matrix Sparsity: {sparsity}%")

    # 2. Bayesian Weighted Rating Calculation (IMDb / MovieLens Formula)
    # Formula: W = (v / (v + m)) * R + (m / (v + m)) * C
    # v = number of ratings for the movie
    # R = mean rating of the movie
    # m = minimum ratings threshold (e.g. 85th percentile)
    # C = mean rating across dataset
    movie_stats = ratings.groupby('movieId').agg(
        rating_count=('rating', 'count'),
        mean_rating=('rating', 'mean')
    ).reset_index()

    C = avg_rating_overall
    m = float(movie_stats['rating_count'].quantile(0.85)) # 85th percentile cutoff (~15-20 ratings)

    def bayesian_weighted_rating(row):
        v = row['rating_count']
        R = row['mean_rating']
        return (v / (v + m)) * R + (m / (v + m)) * C

    movie_stats['weighted_score'] = movie_stats.apply(bayesian_weighted_rating, axis=1)

    # Merge movie titles & TMDB IDs
    movie_stats = movie_stats.merge(movies, on='movieId', how='inner')
    movie_stats['tmdbId'] = movie_stats['movieId'].map(lambda x: movie_to_tmdb.get(x, 0))

    top_bayesian_df = movie_stats.sort_values(by='weighted_score', ascending=False).head(15)
    top_bayesian = []
    for _, row in top_bayesian_df.iterrows():
        top_bayesian.append({
            'movieId': int(row['movieId']),
            'tmdbId': int(row['tmdbId']),
            'title': row['title'],
            'genres': row['genres'],
            'rating_count': int(row['rating_count']),
            'mean_rating': float(round(row['mean_rating'], 2)),
            'weighted_score': float(round(row['weighted_score'], 2))
        })

    # 3. Genre Co-Occurrence & Affinity Analysis
    genre_ratings = {}
    genre_cooccurrence = {}

    for _, row in ratings.merge(movies, on='movieId').iterrows():
        g_list = [g.strip() for g in row['genres'].split('|') if g.strip() and g != '(no genres listed)']
        r_val = row['rating']

        for g in g_list:
            if g not in genre_ratings:
                genre_ratings[g] = {'count': 0, 'sum_rating': 0.0}
            genre_ratings[g]['count'] += 1
            genre_ratings[g]['sum_rating'] += r_val

            # Co-occurrence graph for ratings >= 3.5
            if r_val >= 3.5:
                if g not in genre_cooccurrence:
                    genre_cooccurrence[g] = {}
                for g2 in g_list:
                    if g != g2:
                        genre_cooccurrence[g][g2] = genre_cooccurrence[g].get(g2, 0) + 1

    genre_summary = []
    for g, data in genre_ratings.items():
        genre_summary.append({
            'genre': g,
            'count': data['count'],
            'avg_rating': float(round(data['sum_rating'] / data['count'], 2))
        })
    genre_summary.sort(key=lambda x: x['count'], reverse=True)

    # 4. Matrix Factorization via Truncated SVD
    print("Performing Matrix Factorization using Truncated SVD (k=20)...")
    user_item_matrix = ratings.pivot(index='userId', columns='movieId', values='rating').fillna(0)

    n_components = 20
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    user_factors = svd.fit_transform(user_item_matrix)
    item_factors = svd.components_ # shape (n_components, n_movies)

    explained_variance = float(round(np.sum(svd.explained_variance_ratio_) * 100, 2))

    # Approximate reconstruction for evaluation
    reconstructed_matrix = np.dot(user_factors, item_factors)
    
    # Calculate RMSE on non-zero original ratings
    original_values = user_item_matrix.values
    mask = original_values > 0
    rmse = float(round(np.sqrt(mean_squared_error(original_values[mask], reconstructed_matrix[mask])), 3))

    print(f"SVD Matrix Factorization Complete. Explained Variance: {explained_variance}%, RMSE: {rmse}")

    # 5. Item-Item Cosine Similarity Matrix
    print("Computing Item-Item Cosine Similarity Matrix...")
    item_similarity_matrix = cosine_similarity(item_factors.T)
    movie_ids_in_matrix = list(user_item_matrix.columns)
    movie_id_to_idx = {mid: idx for idx, mid in enumerate(movie_ids_in_matrix)}

    # Precompute Top 5 similar movies for top 200 popular movies
    popular_movie_ids = movie_stats.sort_values(by='rating_count', ascending=False).head(200)['movieId'].tolist()
    item_similarities = {}

    for mid in popular_movie_ids:
        if mid in movie_id_to_idx:
            idx = movie_id_to_idx[mid]
            sim_scores = list(enumerate(item_similarity_matrix[idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:6] # top 5 excluding self

            similar_items = []
            for sim_idx, score in sim_scores:
                target_mid = movie_ids_in_matrix[sim_idx]
                target_tmdb = movie_to_tmdb.get(target_mid, 0)
                m_title = movies[movies['movieId'] == target_mid]['title'].values[0] if target_mid in movies['movieId'].values else f"Movie {target_mid}"
                similar_items.append({
                    'movieId': int(target_mid),
                    'tmdbId': int(target_tmdb),
                    'title': m_title,
                    'similarity_score': float(round(score, 4))
                })
            item_similarities[str(mid)] = similar_items

    # Assemble JSON payload
    analytics_payload = {
        'summary': {
            'total_ratings': total_ratings,
            'total_users': total_users,
            'total_movies': total_movies,
            'sparsity_percentage': sparsity,
            'avg_rating_overall': avg_rating_overall,
            'dataset_name': 'MovieLens ml-latest-small'
        },
        'svd_model_metrics': {
            'latent_components': n_components,
            'explained_variance_percentage': explained_variance,
            'rmse': rmse,
            'algorithm': 'Truncated Singular Value Decomposition (TruncatedSVD)'
        },
        'rating_distribution': rating_distribution,
        'bayesian_top_movies': top_bayesian,
        'genre_analytics': genre_summary,
        'genre_cooccurrence': genre_cooccurrence,
        'sample_item_similarities': item_similarities
    }

    out_file = os.path.join(dataset_dir, 'analytics_results.json')
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(analytics_payload, f, indent=2)

    print(f"Big Data Analytics Pipeline executed successfully. Results written to {out_file}")
    return True

if __name__ == '__main__':
    run_big_data_pipeline()
