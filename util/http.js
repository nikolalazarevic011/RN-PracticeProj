import axios from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "@env";

export const fetchMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: { api_key: TMDB_API_KEY, language: "en-US", page },
        });

        const uniqueMovies = response.data.results.reduce((acc, movie) => {
            if (!acc.find((m) => m.id === movie.id)) {
                acc.push({
                    id: movie.id,
                    title: movie.title,
                    poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/500",
                    overview: movie.overview || "No overview available",
                    releaseDate: movie.release_date || "Unknown",
                    rating: movie.vote_average || "N/A",
                });
            }
            return acc;
        }, []);

        return uniqueMovies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
};

export const fetchSearchResults = async ({
    query = "",
    type = "",
    page = 1,
}) => {
    try {
        // Choose endpoint based on type.
        // If type is not provided, use multi-search to return both movies and TV shows.
        let endpoint;
        if (type === "movie") {
            endpoint = `${TMDB_BASE_URL}/search/movie`;
        } else if (type === "tv") {
            endpoint = `${TMDB_BASE_URL}/search/tv`;
        } else {
            endpoint = `${TMDB_BASE_URL}/search/multi`;
        }

        // Set up query parameters.
        const params = {
            api_key: TMDB_API_KEY,
            language: "en-US",
            query,
            page,
            include_adult: false,
        };

        const response = await axios.get(endpoint, { params });

        // Process the results into a unique array.
        const uniqueResults = response.data.results.reduce((acc, item) => {
            if (!acc.find((result) => result.id === item.id)) {
                acc.push({
                    id: item.id,
                    title: item.title || item.name, // Movies use title; TV shows use name.
                    poster: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://via.placeholder.com/500",
                    overview: item.overview || "No overview available",
                    releaseDate:
                        item.release_date || item.first_air_date || "Unknown",
                    rating: item.vote_average || "N/A",
                });
            }
            return acc;
        }, []);

        return uniqueResults;
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
};

export const fetchSingleMovie = async (movieId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
            },
        });

        const movie = response.data;

        // Format the movie data similarly to your other API calls:
        return {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500",
            overview: movie.overview || "No overview available",
            releaseDate: movie.release_date || "Unknown",
            rating: movie.vote_average || "N/A",
        };
    } catch (error) {
        console.error("Error fetching movie by id:", error);
        return null;
    }
};
