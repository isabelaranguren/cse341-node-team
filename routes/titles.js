const path = require('path');
const express = require('express');
const titleController = require('../controllers/titles');
const router = express.Router();

router.get('/', titleController.getIndex);

router.get('/newest', titleController.getNewest);

router.get('/popular', titleController.getPopular);

router.get('/top-rated', titleController.getTopRated);

router.get('/my-list/:userId', titleController.getMylist)

router.post('/delete-list', titleController.postDeleteList);

router.post('/add-title', titleController.postTitle);

router.get('/title/:titleId', titleController.getTitleDetails);

router.post('/delete-title', titleController.postDeleteTitle);


module.exports = router;

