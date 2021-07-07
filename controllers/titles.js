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
    const page = +req.query.page || 1;
    const offset = 10 * (page - 1);
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
        // https://api.themoviedb.org/3/movie/{movie_id}/images?api_key=<<api_key>>&language=en-US
        .then(response => response.json())
        .then(titles => {
            // console.log(titles)
            res.render('pages/home', {
                popularMovieList: titles.results,
                currentPage: page,
                hasPrevious: page > 1,
                previousPage: page - 1,
                nextPage: page + 1,
                path: '/',
                pageTitle: 'Home'
            });
        })
        .catch(err => {
            console.log(err);
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
    res.render('pages/userList', {
        path: '/my-list/:userId',
        pageTitle: "My List"

    });

};

// exports.getCart = (req, res, next) => {
//     req.user
//       .populate('cart.items.productId')
//       .execPopulate()
//       .then(user => {
//         const products = user.cart.items;
//         res.render('shop/cart', {
//           path: '/cart',
//           pageTitle: 'Your Cart',
//           products: products,
//         });
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   };

exports.postDeleteList = (req, res, next) => {

};

exports.postTitle = (req, res, next) => {
    console.log(req.user)
};

exports.getTitleDetails = (req, res, next) => {
    const titleId = req.params.id;
    //const imdb_id = req.body.imdb_id;
    fetch(`https://api.themoviedb.org/3/movie/${titleId}?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US`)

        .then(response => {
            // console.log(response);
            return response.json();
        })
        .then(title => {
            // console.log(title);
            const id = title.imdb_id;
            fetch(`https://api.themoviedb.org/3/find/${id}?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&&external_source=imdb_id`)
                .then(response => {
                    // console.log(response);
                    return response.json();
                })
                .then(data => {
                    // console.log(data)
                    res.render('pages/mediaDetails', {
                        movieTitle: data.movie_results[0].title,
                        //tvShowResults: titles.tv_shows_results,
                        path: '/title/:id',
                        pageTitle: 'Movie Details',
                        movieDetails: data.movie_results[0].overview,
                        ratings: data.movie_results[0].vote_average,
                        //runtime: data.movie_results[0].runtime,
                        release: data.movie_results[0].release_date,
                        image: data.movie_results[0].poster_path

                    });
                })
                .catch(err => {
                    console.log(err)
                })


        })
        .catch(err => {
            console.log(err);
        })


};

exports.postDeleteTitle = (req, res, next) => {

};
