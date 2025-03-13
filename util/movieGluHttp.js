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

export const fetchMovieGluFilmId = async (movieTitle) => {
    if (!movieTitle || typeof movieTitle !== "string") {
        console.error("Invalid movie title:", movieTitle);
        return null;
    }

    const filmId = 7772
    return filmId;


    //! this is for real gps call, no movieGlu sandbox
   /*  // Clean the title - remove special characters and extra spaces
    const cleanTitle = movieTitle.trim().replace(/[^\w\s]/gi, "");

    if (!cleanTitle) {
        console.error("Title is empty after cleaning");
        return null;
    }

    // Format date properly according to MovieGlu requirements
    const now = new Date();
    const deviceDateTime = now.toISOString().replace(/\.\d+Z$/, "Z");
    // Build headers exactly as shown in the API demo
    const headers = {
        client: MOVIEGLU_API_client,
        "x-api-key": MOVIEGLU_API_x_api_key,
        authorization: MOVIEGLU_API_authorization,
        territory: MOVIEGLU_API_territory,
        "api-version": "v201",
        "device-datetime": deviceDateTime,
    };

    try {
        // console.log(`🔍 Searching MovieGlu for: "${cleanTitle}"`);

        const response = await axios.get(
            `${MOVIEGLU_API_URL}/filmLiveSearch/`,
            {
                headers: headers,
                params: {
                    query: cleanTitle,
                },
            }
        );

        // console.log(`📊 MovieGlu search response:`, response.data);

        if (
            response.data &&
            response.data.films &&
            response.data.films.length > 0
        ) {
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
    } */
    //! END OF -  this is for real gps call, no movieGlu sandbox

};

// ✅ Fetch the closest cinema showing the movie
// Instead of using useSelector here, accept location as a parameter
export const fetchClosestShowing = async (movieTitle, location) => {
    if (!location || !location.latitude || !location.longitude) {
        console.warn("⚠️ No location data available");
        return {
            error: "No location data available",
        };
    }

    // Adjust to handle both location objects correctly
    const lat = location.coords ? location.coords.latitude : location.latitude;
    const lng = location.coords
        ? location.coords.longitude
        : location.longitude;
    if (!lat || !lng) {
        return {
            error: "Latitude or longitude is missing",
        };
    }

    // Format date properly
    const now = new Date();
    const deviceDateTime = now.toISOString().replace(/\.\d+Z$/, "Z");

    //! for real gps movie glu api
    // Format geolocation exactly as shown in the demo
    // const geolocation = `${lat};${lng}`;

    //! test with default cords from movieGu to see if i get any results of nearby cinemas, because default cords from android studio are in the middle of nowhere
    const geolocation = `-22.0;14.0`; //worked for the -  Raiders of the Lost Ark - test same as movie glu dummy api test

    // Build headers including geolocation
    const headers = {
        client: MOVIEGLU_API_client,
        "x-api-key": MOVIEGLU_API_x_api_key,
        authorization: MOVIEGLU_API_authorization,
        territory: MOVIEGLU_API_territory,
        "api-version": "v201",
        geolocation: geolocation,
        "device-datetime": deviceDateTime,
    };

    try {
        // First, fetch the movie's film_id for real api
        const filmId = await fetchMovieGluFilmId(movieTitle);
        // console.log(filmId);  -- //!has to be here when testing sand API - probably cuz recursive fn above is async
        if (!filmId) {
            return { error: `No film ID found for "${movieTitle}"` };
        }

        // Now, use film_id to find closest showtimes
        const response = await axios.get(
            `${MOVIEGLU_API_URL}/closestShowing/`,
            {
                headers: headers,
                params: {
                    film_id: filmId,
                },
            }
        );

        // console.log("🎥 Closest showtimes:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Error fetching closest showing from MovieGlu:",
            error
        );

        let errorMessage = "An error occurred when fetching cinema data";
        if (
            error.response &&
            error.response.headers &&
            error.response.headers["mg-message"]
        ) {
            errorMessage = error.response.headers["mg-message"];
        }

        return { error: errorMessage, cinemas: [] };
    }
};
