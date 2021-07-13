const titles = require('../models/titles');
const Title = require('../models/titles');
const fetch = require('node-fetch');

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
    //maybe should be like getProducts in the shop
    titles.find({ userId: req.user._id })
        .then(titles => {
            console.log(titles[0]);
            res.render('pages/userList', {
                path: '/my-list/:userId',
                pageTitle: "My List",
                titles: titles

            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.postDeleteList = (req, res, next) => {

};

exports.postList = (req, res, next) => {
    const title = req.body.movieTitle;
    const release = req.body.release;
    const titleId = req.body.titleId;
    const image = req.body.image;
    //make sure movie doesnt already exist in database
    req.user
    const newTitle = new Title({
        titles: [{

            title: title,
            id: titleId,
            poster_path: image,
            release: release,
        }],
        userId: req.user
    });
    newTitle
        .save()
        .then(result => {
            console.log('Created Title!');
            res.redirect('/my-list/:userId');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
                    console.log(data);
                    res.render('pages/mediaDetails', {
                        movieTitle: data.movie_results[0].title,
                        //tvShowResults: titles.tv_shows_results,
                        path: '/title/:id',
                        pageTitle: 'Movie Details',
                        movieDetails: data.movie_results[0].overview,
                        ratings: data.movie_results[0].vote_average,
                        //runtime: data.movie_results[0].runtime,
                        release: data.movie_results[0].release_date,
                        image: data.movie_results[0].poster_path,
                        titleId: titleId

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
    const titleId = req.body.titleId;
    titles.findById(titleId)
        .then(title => {
            if (!title) {
                return next(new Error('No Title Found!'));
            }
            return titles.deleteOne({ _id: titleId, userId: req.user._id });
        }).then(() => {
            console.log('TITLE DELETED!');
            res.redirect('/my-list/:userId')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};

exports.postSearch = async (req, res, next) => {
    const page = +req.query.page || 1;
    const query = req.body.title;
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f4278fc5b9413965242b5e22893f2738&query=${query}&language=en-US&page=${page}`);
        const data = await response.json();
        res.render('pages/search', {
            popularMovieList: data.results,
            currentPage: page,
            hasPreviousPage: page > 1,
            hasNextPage: page < data.total_pages,
            previousPage: page - 1,
            nextPage: page + 1,
            lastPage: data.total_pages,
            path: '/',
            pageTitle: 'Home',
            query
        });

    } catch (err) {
        throw err;
    }
};

exports.getSearch = async (req, res, next) => {
    const page = +req.query.page || 1;
    const query = req.query.title;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f4278fc5b9413965242b5e22893f2738&query=${query}&language=en-US&page=${page}`);
        const data = await response.json();
        console.log(data);
        res.render('pages/search', {
            popularMovieList: data.results,
            currentPage: page,
            hasPreviousPage: page > 1,
            hasNextPage: page < data.total_pages,
            previousPage: page - 1,
            nextPage: page + 1,
            lastPage: data.total_pages,
            path: '/',
            pageTitle: 'Home',
            query,

        });

    } catch (err) {
        throw err;
    }
};