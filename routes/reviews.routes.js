const express = require('express')

// Controllers reviews
const {
  createRestaurantReview,
  updateReviewById,
  deleteReviewById,
} = require('../controllers/reviews.controllers')

// Middlewares
const { restaurantIsActive } = require('../middlewares/restaurants.middleware')
const { reviewIsActive } = require('../middlewares/reviews.middleware')

// Auth middlewares
const { protectReviewOwner } = require('../middlewares/auth.middleware')

// Validators middlewares
const {
  reviewValidators,
} = require('../middlewares/reviewsValidators.middleware')

// Creating router
const reviewsRouter = express.Router()

reviewsRouter.post(
  'restaurantId',
  restaurantIsActive,
  reviewValidators,
  createRestaurantReview
)

reviewsRouter.patch(
  '/:id',
  reviewIsActive,
  reviewValidators,
  protectReviewOwner,
  updateReviewById
)

reviewsRouter.delete(
  '/:id',
  reviewIsActive,
  protectReviewOwner,
  deleteReviewById
)

module.exports = { reviewsRouter }
