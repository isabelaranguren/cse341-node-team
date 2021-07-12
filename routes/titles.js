const path = require('path');
const express = require('express');
const titleController = require('../controllers/titles');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

router.get('/', titleController.getIndex);

router.get('/SearchMovie', titleController.getSearchMovie);

router.get('/popular', titleController.getPopular);

router.get('/top-rated', titleController.getTopRated);

router.get('/my-list/:userId', isAuth, titleController.getMylist);

router.post('/delete-list',isAuth, titleController.postDeleteList);

router.post('/add-title',isAuth, titleController.postList);

router.get('/title/:id', titleController.getTitleDetails);

router.post('/delete-title',isAuth, titleController.postDeleteTitle);


module.exports = router;







