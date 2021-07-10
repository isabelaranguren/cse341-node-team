const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

router.get('/addTitle', isAuth, userController.getAddTitle);

router.post('/addTitle', isAuth, userController.postAddTitle);

router.delete('/deleteTitle', isAuth, userController.deleteTitle);

router.get('/editTitle', isAuth, userController.getEditReview);

router.post('/editTitle', isAuth, userController.postEditReview);

router.delete('/deleteReview', isAuth, userController.deleteReview);

module.exports = router;

