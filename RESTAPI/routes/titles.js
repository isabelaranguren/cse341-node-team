const express = require('express');
const titleController = require('../controllers/titles');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

router.get('/my-list/:userId', isAuth, titleController.getMylist);
router.put('/add-title', isAuth, titleController.putList);
router.patch('/delete-title', isAuth, titleController.patchDeleteTitle);
router.patch('/edit-view', isAuth, titleController.patchEditView);

module.exports = router;


// ------------- This can be done on the frontend --------------

// router.get('/', titleController.getIndex);
// router.get('/now-playing', titleController.getNowPlaying);
// router.get('/upcoming', titleController.getUpcoming);
// router.get('/top-rated', titleController.getTopRated);
// router.get('/title/:id', titleController.getTitleDetails);
// router.post('/search', titleController.postSearch);
// router.get('/search', titleController.getSearch);