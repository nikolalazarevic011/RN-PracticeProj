import axios from "axios";
import { MOVIEGLU_API_client, MOVIEGLU_API_x_api_key, MOVIEGLU_API_authorization,MOVIEGLU_API_territory, } from "@env";

const MOVIEGLU_API_URL = "https://api-gate2.movieglu.com";
const API_HEADERS = {
    "client": MOVIEGLU_API_client,
    "x-api-key": MOVIEGLU_API_x_api_key,
    "authorization": MOVIEGLU_API_authorization,
    "territory": MOVIEGLU_API_territory, // Change based on user’s location
    'api-version': 	'v201',
    // 'geolocation' : , //Latitude;Longitude , Example: 52.123;0.456
    "device-datetime": new Date().toISOString(),
};

export const fetchMovieGluFilmId = async (movieTitle) => {
    try {
        const response = await axios.get(`${MOVIEGLU_API_URL}/filmLiveSearch/`, {
            headers: API_HEADERS,
            params: {
                query: movieTitle, // Search for the movie using its title
            },
        });

        if (response.data.films.length > 0) {
            return response.data.films[0].film_id; // Return the first matching movie ID
        } else {
            console.warn("No matching film found in MovieGlu");
            return null;
        }
    } catch (error) {
        console.error("Error fetching film ID from MovieGlu:", error);
        return null;
    }
};
