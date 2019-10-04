import React, { useState } from 'react';

import {
    IMAGE_BASE_URL,
    API_URL,
    API_KEY,
    POSTER_SIZE,
    BACKDROP_SIZE
} from '../config';

import { useHomeFetch } from './hooks/useHomeFetch';


import HeroImage from './elements/HeroImage';
import SearchBar from './elements/SearchBar';
import Grid from './elements/Grid';
import MovieThumb from './elements/MovieThumb';
import LoadMoreBtn from './elements/LoadMoreBtn';
import Spinner from './elements/Spinner';
import NoImage from './images/no_image.jpg';


const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [
        {
            state: { movies, currentPage, totalPages, heroImage },
            loading,
            error },
        fetchMovies,
    ] = useHomeFetch();

    const loadMoreMovies = () => {
        const searchEndPoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${currentPage + 1}`
        const popularEndPoint = `${API_URL}movie?api_key=${API_KEY}&page=${currentPage + 1}`


        // const searchEndpoint = `${SEARCH_BASE_URL}${searchTerm}&page=${currentPage + 1}`;
        // const popularEndpoint = `${POPULAR_BASE_URL}&page=${currentPage + 1}`;



        const endpoint = searchTerm ? searchEndPoint : popularEndPoint;

        fetchMovies(endpoint);
    }
    if (error) return <div>Something went wrong...</div>
    if (!movies[0]) return <Spinner />
    return (
        <>
            <HeroImage
                image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
                title={heroImage.original_title}
                text={heroImage.overview} />
            <SearchBar />
            <Grid header={searchTerm ? 'Search Result' : 'Popular Movies'}>
                {movies.map(movie => (
                    <MovieThumb
                        key={movie.id}
                        clickable
                        image={
                            movie.poster_path
                                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                : NoImage
                        }
                        movieID={movie.id}
                        movieName={movie.original_title}
                    />
                ))}
            </Grid>
            {loading && <Spinner />}
            {currentPage < totalPages && !loading && (
                <LoadMoreBtn text="Load More" callback={loadMoreMovies} />
            )}

        </>
    )
}
export default Home;