const titles = require('../models/titles');
const Title = require('../models/titles');
const fetch = require('node-fetch');


// https://api.themoviedb.org/3/movie/popular?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=1

// https://api.themoviedb.org/3/movie/top_rated?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1

// https://api.themoviedb.org/3/movie/upcoming?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1


// Tv
// https://api.themoviedb.org/3/tv/latest?api_key=f4278fc5b9413965242b5e22893f273&language=en-US
// https://api.themoviedb.org/3/tv/popular?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1
// https://api.themoviedb.org/3/tv/top_rated?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1


// https://api.themoviedb.org/3/watch/providers/regions?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US


exports.getIndex = (req, res, next) => {
    const page = req.params.page || 1;
    const offset = 10 * (page - 1);
    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)

        // https://api.themoviedb.org/3/movie/{movie_id}/images?api_key=<<api_key>>&language=en-US

        .then(response => response.json())
        .then(titles => {
            console.log(titles.results[0])
            console.log(titles.results.length);
            res.render('pages/home', {
                popularMovieList: titles.results,
                page: page,
                path: '/',
                pageTitle: 'Home'

                // const titleData;
                // const { title = original_title, popularity } = titles.results[0]
                // console.log(title, popularity)
            });
        })
};

exports.getNewest = (req, res, next) => {
    const page = req.params.page || 1;
    const offset = 10 * (page - 1);
    // fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&${page}`)


};

exports.getPopular = (req, res, next) => {

};

exports.getTopRated = (req, res, next) => {

};

exports.getMylist = (req, res, next) => {

};

exports.postDeleteList = (req, res, next) => {

};

exports.postTitle = (req, res, next) => {

};

exports.getTitleDetails = (req, res, next) => {

};

exports.postDeleteTitle = (req, res, next) => {

};