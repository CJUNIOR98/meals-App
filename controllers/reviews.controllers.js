const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Review } = require('../models/review.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.utils')

dotenv.config()

const createRestaurantReview = catchAsync(async (req, res, next) => {
  const restaurantId = req.restaurant.id

  const userId = req.sessionUser.id

  const { comment, rating } = req.body

  const newReview = await Review.create({
    userId,
    comment,
    rating,
    restaurantId,
  })

  res.status(201).json({
    status: 'success',
    newReview,
  })
})

const updateReviewById = catchAsync(async (req, res, next) => {
  const { review } = req

  const { comment, rating } = req.body

  await review.update({
    comment,
    rating,
  })

  res.status(200).json({
    status: 'success',
    review,
  })
})

const deleteReviewById = catchAsync(async (req, res, next) => {
  const { review } = req

  await review.update({
    status: 'deleted,',
  })

  res.status(204).json({
    status: 'success',
  })
})

module.exports = { createRestaurantReview, updateReviewById, deleteReviewById }
