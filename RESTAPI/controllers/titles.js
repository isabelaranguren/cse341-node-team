const titleList = require('../models/titles');

const fetch = require('node-fetch');
const User = require('../models/user');


exports.getMylist = (req, res, next) => {
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;
    console.log(firstName);

    titleList.findOne({ userId: req.user._id })
        .then(data => {
            let titles = [];
            data ? titles = data.titles : titles = [];
            res.status(200).json({
                message: 'Fetched titles successfully.',
                path: '/my-list/:userId',
                pageTitle: "My List",
                titles: titles,
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.putList = async (req, res, next) => {
    const title = req.body.movieTitle;
    const release = req.body.release;
    const movieId = req.body.titleId;
    const image = req.body.image;
    const userId = req.user._id;

    try {
        // Let's check if the user has already created a list
        const result = await titleList.findOne({ userId: userId });

        // If he hasn't let's create one for him and add his title.
        if (!result) {
            const newList = new titleList({
                titles: [{
                    title,
                    movieId: movieId,
                    poster_path: image,
                    release: release,
                    isViewed: false
                }],
                userId
            });
            const createList = await newList.save();
            if (createList.ok) {
                return res.status(201).json({
                    message: 'List created successfully!',
                    list: newList,
                    creator: { _id: userId }
                }); // Redirect the user to his list
            } else {
                const error = new Error('Something went wrong, please try again.');
                error.statusCode = 422;
                throw error;
            }
        };

        const titleResult = await titleList.find({ userId: userId, "titles.movieId": movieId });
        if (titleResult.length !== 0) {
            // Tell the user he has that title in his list
            return res.status(201).json({
                message: 'Title is already on your list',
                list: titleResult,
                creator: { _id: userId }
            }); // Redirect the user to his list
        };

        const newTitle = {
            title,
            movieId: movieId,
            poster_path: image,
            release: release,
            isViewed: false
        };
        const addTitle = await titleList.updateOne({ userId: userId }, { $push: { titles: newTitle } });
        if (addTitle.ok) {
            return res.status(201).json({
                message: 'Title added successfully!',
                list: addTitle,
                creator: { _id: userId }
            }); // Redirect the user to his list
        } else {
            const error = new Error('Something went wrong, please try again.');
            error.statusCode = 422;
            throw error;
        };

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    };
};

exports.patchDeleteTitle = async (req, res, next) => {
    const movieId = req.body.titleId;
    const userId = req.user._id;

    try {
        const result = await titleList.updateOne({ userId: userId }, { $pull: { titles: { movieId: movieId } } });
        if (!result.ok) {
            const error = new Error('Something went wrong, please try again.');
            error.statusCode = 422;
            throw error;
        }
        res.status(200).json({ message: 'Title deleted!', list: result }); // Redirect the user to his list
        return;
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.patchEditView = async (req, res, next) => {
    const movieId = req.body.movieId;
    const isViewed = req.body.isViewed;
    const userId = req.user._id;

    try {
        const updateView = await titleList.updateOne({ userId: userId, "titles.movieId": movieId }, { $set: { 'titles.$.isViewed': isViewed } });
        if (!updateView.ok) {
            const error = new Error('Something went wrong, please try again.');
            error.statusCode = 422;
            throw error;
        }
        res.status(200).json({ message: 'Title updated!' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


// ------------- This will be executed on the Frontend ----------------

// exports.getIndex = (req, res, next) => { 
//     const page = +req.query.page || 1;
//     const offset = 10 * (page - 1);
//     fetch(`https://api.themoviedb.org/3/movie/popular?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
//         .then(response => response.json())
//         .then(titles => {
//             res.render('pages/home', {
//                 popularMovieList: titles.results,
//                 currentPage: page,
//                 hasPrevious: page > 1,
//                 previousPage: page - 1,
//                 nextPage: page + 1,
//                 path: '/',
//                 pageTitle: 'Home'
//             });
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             console.log(error);
//             return next(error);
//         })
// };

// exports.getUpcoming = (req, res, next) => {
//     const page = +req.query.page || 1;
//     const offset = 10 * (page - 1);
//     fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
//         .then(response => response.json())
//         .then(titles => {
//             res.render('pages/upcoming', {
//                 upcomingList: titles.results,
//                 currentPage: page,
//                 hasPrevious: page > 1,
//                 previousPage: page - 1,
//                 nextPage: page + 1,
//                 path: '/',
//                 pageTitle: 'Upcoming Movies'
//             });
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             console.log(error);
//             return next(error);
//         })

// };

// exports.getNowPlaying = (req, res, next) => {
//     const page = +req.query.page || 1;
//     const offset = 10 * (page - 1);
//     fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
//         .then(response => response.json())
//         .then(titles => {
//             res.render('pages/now-playing', {
//                 nowPlayingList: titles.results,
//                 currentPage: page,
//                 hasPrevious: page > 1,
//                 previousPage: page - 1,
//                 nextPage: page + 1,
//                 path: '/',
//                 pageTitle: 'Now Playing'
//             });
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             console.log(error);
//             return next(error);
//         })

// };

// exports.getTopRated = (req, res, next) => {
//     const page = +req.query.page || 1;
//     const offset = 10 * (page - 1);
//     fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
//         .then(response => response.json())
//         .then(titles => {
//             res.render('pages/top-rated', {
//                 topRatedList: titles.results,
//                 currentPage: page,
//                 hasPrevious: page > 1,
//                 previousPage: page - 1,
//                 nextPage: page + 1,
//                 path: '/',
//                 pageTitle: 'Top Rated'
//             });
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             console.log(error);
//             return next(error);
//         })

// };

// exports.getTitleDetails = (req, res, next) => {
//     const titleId = req.params.id;

//     fetch(`https://api.themoviedb.org/3/movie/${titleId}?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US`)

//         .then(response => {
//             return response.json();
//         })
//         .then(title => {
//             const id = title.imdb_id;
//             fetch(`https://api.themoviedb.org/3/find/${id}?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&&external_source=imdb_id`)
//                 .then(response => {
//                     return response.json();
//                 })
//                 .then(data => {
//                     res.render('pages/media-details', {
//                         movieTitle: data.movie_results[0].title,
//                         path: '/title/:id',
//                         pageTitle: 'Movie Details',
//                         movieDetails: data.movie_results[0].overview,
//                         ratings: data.movie_results[0].vote_average,
//                         release: data.movie_results[0].release_date,
//                         image: data.movie_results[0].poster_path,
//                         gallery: data.movie_results[0].backdrop_path,
//                         titleId: titleId
//                     });
//                 })
//                 .catch(err => {
//                     const error = new Error(err);
//                     error.httpStatusCode = 500;
//                     console.log(error);
//                     return next(error);
//                 })
//         })
//         .catch(err => {
//             const error = new Error(err);
//             error.httpStatusCode = 500;
//             console.log(error);
//             return next(error);
//         })
// };

// exports.postSearch = async (req, res, next) => {
//     const page = +req.query.page || 1;
//     const query = req.body.title;
//     try {
//         const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f4278fc5b9413965242b5e22893f2738&query=${query}&language=en-US&page=${page}`);
//         const data = await response.json();
//         res.render('pages/search', {
//             popularMovieList: data.results,
//             currentPage: page,
//             hasPreviousPage: page > 1,
//             hasNextPage: page < data.total_pages,
//             previousPage: page - 1,
//             nextPage: page + 1,
//             lastPage: data.total_pages,
//             path: '/',
//             pageTitle: 'Home',
//             query
//         });

//     } catch (err) {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         console.log(error);
//         return next(error);
//     }
// };

// exports.getSearch = async (req, res, next) => {
//     const page = +req.query.page || 1;
//     const query = req.query.title;

//     try {
//         const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f4278fc5b9413965242b5e22893f2738&query=${query}&language=en-US&page=${page}`);
//         const data = await response.json();

//         res.render('pages/search', {
//             popularMovieList: data.results,
//             currentPage: page,
//             hasPreviousPage: page > 1,
//             hasNextPage: page < data.total_pages,
//             previousPage: page - 1,
//             nextPage: page + 1,
//             lastPage: data.total_pages,
//             path: '/',
//             pageTitle: 'Home',
//             query,

//         });

//     } catch (err) {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         console.log(error);
//         return next(error);
//     }
// };