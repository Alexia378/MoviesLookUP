import React, { useReducer, useEffect } from "react";
import "../App.css";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";
import spinner from "../assets/load.gif";
import { initialState, reducer } from "../reducer";
import axios from "axios";

const MOVIE_API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=c2d7de44";

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        axios.get(MOVIE_API_URL).then(jsonResponse => {
            dispatch({
                type: "SEARCH_MOVIES_SUCCESS",
                payload: jsonResponse.data.search
            });
        });
    }, []);

    // you can add this to the onClick listener of the Header component
    const refreshPage = () => {
        window.location.reload();
    };

    const search = searchValue => {
        dispatch({
            type: "SEARCH_MOVIES_REQUEST"
        });

        axios(`https://www.omdbapi.com/?s=${searchValue}&apikey=c2d7de44`).then(
            jsonResponse => {
                if (jsonResponse.data.response === "True") {
                    dispatch({
                        type: "SEARCH_MOVIES_SUCCESS",
                        payload: jsonResponse.data.search
                    });
                } else {
                    dispatch({
                        type: "SEARCH_MOVIES_FAILURE",
                        error: jsonResponse.data.Error
                    });
                }
            }
        );
    };

    const { movies, errorMessage, loading } = state;

    const retrievedMovies =
        loading && !errorMessage ? (
            <img className="spinner" src={spinner} alt="Loading spinner" />
        ) : errorMessage ? (
            <div className="errorMessage">
                {errorMessage}
            </div>
        ) : (
            movies.map((movie, index) => (
                <Movie key={`${index}-${movie.title}`} movie={movie} />
            ))
        );

    return (
        <div className="App">
            <div className="m-container">
                <Header text="HOOKED" />

                <Search search={search} />

                <p className="App-intro">Sharing a few of our favourite movies</p>

                <div className="movies">{retrievedMovies}</div>
            </div>
        </div>
    );
};

export default App;