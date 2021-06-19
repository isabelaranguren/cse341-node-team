const User = require('../models/user');

const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
    });
};

exports.postLogin = (req, res, next) => {

};

exports.getSignup = (req, res, next) => {

};

exports.postSignup = (req, res, next) => {

};

// exports.postDeleteAccount = (req,res,next) => {

// };