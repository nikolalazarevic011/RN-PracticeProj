import axios from "axios";
import { TMDB_API_KEY, TMDB_BASE_URL } from "@env";


export const fetchMovies = async (page = 1) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: { api_key: TMDB_API_KEY, language: "en-US", page },
        });

        const uniqueMovies = response.data.results.reduce((acc, movie) => {
            if (!acc.find(m => m.id === movie.id)) {
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

