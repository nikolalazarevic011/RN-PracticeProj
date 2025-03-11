// ../util/movieGluHttp.js
import axios from "axios";
import {
    MOVIEGLU_API_client,
    MOVIEGLU_API_x_api_key,
    MOVIEGLU_API_authorization,
    MOVIEGLU_API_territory,
} from "@env";
import { useSelector } from "react-redux";

const MOVIEGLU_API_URL = "https://api-gate2.movieglu.com";
const API_HEADERS = {
    client: MOVIEGLU_API_client,
    "x-api-key": MOVIEGLU_API_x_api_key,
    authorization: MOVIEGLU_API_authorization,
    territory: MOVIEGLU_API_territory,
    "api-version": "v201",
    // 'geolocation' : , //Latitude;Longitude , Example: 52.123;0.456
    "device-datetime": new Date().toISOString(),
};

// ✅ Fetch the film_id by movie title with improved error handling
export const fetchMovieGluFilmId = async (movieTitle) => {
    if (!movieTitle || typeof movieTitle !== 'string') {
        console.error("Invalid movie title:", movieTitle);
        return null;
    }

    // Clean the title - remove special characters and extra spaces
    const cleanTitle = movieTitle.trim().replace(/[^\w\s]/gi, '');
    
    if (!cleanTitle) {
        console.error("Title is empty after cleaning");
        return null;
    }

    try {
        console.log(`🔍 Searching MovieGlu for: "${cleanTitle}"`);
        
        const response = await axios.get(
            `${MOVIEGLU_API_URL}/filmLiveSearch/`,
            {
                headers: API_HEADERS,
                params: {
                    query: cleanTitle,
                },
            }
        );

        console.log(`📊 MovieGlu search response:`, response.data);

        if (response.data && response.data.films && response.data.films.length > 0) {
            const filmId = response.data.films[0].film_id;
            console.log(`✅ Found film ID: ${filmId}`);
            return filmId;
        } else {
            console.warn("🚫 No matching film found in MovieGlu");
            return null;
        }
    } catch (error) {
        console.error("❌ Error fetching film ID from MovieGlu:", error);
        
        // Log more detailed error information
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
            console.error("Error request:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        
        return null;
    }
};

// ✅ Fetch the closest cinema showing the movie
// Instead of using useSelector here, accept location as a parameter
export const fetchClosestShowing = async (movieTitle, location) => {
    if (!location || !location.latitude || !location.longitude) {
        console.warn("⚠️ No location data available");
        return null;
    }
    const geolocation = `${location.latitude};${location.longitude}`;

    try {
        // First, fetch the movie's film_id
        const filmId = await fetchMovieGluFilmId(movieTitle);
        if (!filmId) {
            return null; // Exit if no film_id is found
        }

        // Now, use film_id to find closest showtimes
        const response = await axios.get(
            `${MOVIEGLU_API_URL}/closestShowing/`,
            {
                headers: { ...API_HEADERS, geolocation },
                params: {
                    film_id: filmId,
                },
            }
        );

        console.log("🎥 Closest showtimes:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching closest showing from MovieGlu:",
            error
        );
        return null;
    }
};
