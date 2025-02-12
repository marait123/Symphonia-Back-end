const express = require('express');
const albumController = require('./../controllers/albumController');
const authController = require('../controllers/authController');
const searchHistory = require('../utils/searchMiddleware');
const router = express.Router();

router.get('/', albumController.getManyAlbums);
router.get('/:id', albumController.getAlbum);
router.get(
  '/:id/tracks',
  authController.protect(false),
  searchHistory.saveSearchHistory,
  albumController.getAlbumTracks
);

router.post(
  '/',
  authController.protect(true),
  authController.restrictTo('artist'),
  albumController.multiPart,
  albumController.resizeImage,
  albumController.createAlbum
);
module.exports = router;
