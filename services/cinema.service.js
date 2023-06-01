"use strict";

const axios = require("axios");
const url = require("url");

class CinemaService {
  static #TMDB_BASE_URL = "https://api.themoviedb.org/3";
  static #TMDB_API_KEY = "ca5b07a7f5c2a2a3d37780b3c991b9cc";
  static #OMDB_BASE_URL = "http://www.omdbapi.com/";
  static #OMDB_API_KEY = "393d8ec1";

  async getCinemaInfo(searchString, year) {
    const tmdbQueryParams = {
      api_key: CinemaService.#TMDB_API_KEY,
      page: 1,
      include_adult: true,
      query: searchString,
      year: year,
    };
    const tmdbQueryParamsString = new url.URLSearchParams(tmdbQueryParams);

    const tmdbSearchResponse = await axios.get(
      `${CinemaService.#TMDB_BASE_URL}/search/movie?${tmdbQueryParamsString}`
    );
    if (tmdbSearchResponse.status !== 200 || tmdbSearchResponse.data?.results?.length === 0) {
      return;
    }

    const results = tmdbSearchResponse.data?.results;
    const tmdbId = results[0]?.id;

    const tmdbResponse = await axios.get(
      `${CinemaService.#TMDB_BASE_URL}/movie/${tmdbId}?api_key=${
        CinemaService.#TMDB_API_KEY
      }`
    );
    if (tmdbResponse.status !== 200) {
      return;
    }

    const tmdbMovieInfo = tmdbResponse.data;
    const imdbId = tmdbMovieInfo.imdb_id;

    const omdbQueryParams = {
      apikey: CinemaService.#OMDB_API_KEY,
      i: imdbId,
      type: "movie",
      plot: "full",
    };
    const omdbQueryParamsString = new url.URLSearchParams(omdbQueryParams);

    const omdbResponse = await axios.get(
      `${CinemaService.#OMDB_BASE_URL}?${omdbQueryParamsString}`
    );
    if (omdbResponse.status !== 200) {
      return;
    }

    return {
      imdbId: imdbId,
      tmdbId: tmdbMovieInfo.id,
      type: omdbResponse.data.Type,
      title: tmdbMovieInfo.original_title,
      year: omdbResponse.data.Year,
      rated: omdbResponse.data.Rated,
      runtime: tmdbMovieInfo.runtime,
      genre: omdbResponse.data.Genre,
      plot: tmdbMovieInfo.overview,
      imdbRating: +omdbResponse.data.imdbRating,
      imdbVotes: omdbResponse.data.imdbVotes,
      metascore: +omdbResponse.data.Metascore,
      awards: omdbResponse.data.Awards,
      language: tmdbMovieInfo.spoken_languages?.map(
        (language) => language.english_name
      ),
      director: omdbResponse.data.Director,
      actors: omdbResponse.data.Actors,
      revenue: tmdbMovieInfo.revenue,
      releaseDate: tmdbMovieInfo.release_date,
      poster: omdbResponse.data.Poster,
    };
  }
}

module.exports = CinemaService;
