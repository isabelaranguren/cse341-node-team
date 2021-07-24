const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
],
    authController.postLogin
);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-mail exists already, please choose a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),

        body('password',
            'Please enter a password with only numbers and text with at least 5 characters.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
    ],
    authController.postSignup
);

module.exports = router;

// --------- Will be implemented after the basic logic ----------

// router.post('/reset', authController.postReset);
// router.get('/reset/:token', authController.getNewPassword);
// router.patch('/new-password', authController.postNewPassword);


// ------------- This can be done on the frontend --------------

// router.get('/login', authController.getLogin);
// router.get('/signup', authController.getSignup);
// router.post('/logout', authController.postLogout);
// router.get('/reset', authController.getReset);