/* eslint-disable no-console */
// const {Album,validateAlbum} = require('./../models/albumModel');
const Album = require('../models/albumModel');
const Track = require('../models/trackModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync').threeArg;
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getManyAlbums = factory.getMany(Album, ['tracks', 'artist']);
exports.getAlbum = factory.getOne(Album, ['tracks', 'artist']);
exports.getAlbumTracks = catchAsync(async (req, res, next) => {
  const albumTracks = await Album.findById(req.params.id, 'tracks');
  if (!albumTracks) {
    return next(new AppError('that document does not exist', 404));
  }
  const features = new APIFeatures(
    Track.find({ _id: { $in: albumTracks.tracks } }).populate([
      'artist',
      'album'
    ]),
    req.query
  )
    .filter()
    .sort()
    .paginate();

  const tracks = await features.query;

  res.status(200).json(tracks);
});

exports.createAlbum = catchAsync(async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`;
  const album = await Album.create({
    name: req.body.name,
    year: req.body.year,
    image: `${url}/api/v1/images/albums/default.png`,
    artist: req.user._id,
    category: req.body.category
  });
  res.status(200).send(album);
});
