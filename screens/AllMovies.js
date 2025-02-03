import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadMovies } from "../store/moviesSlice";
import MoviesOutput from "../components/MoviesOutput";

export default function AllMovies() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadMovies()); // ✅ Fetch movies when component mounts
    }, [dispatch]);

    return (
        <>
            <MoviesOutput />
        </>
    );
}
