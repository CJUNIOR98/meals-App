const express = require('express')

// Controllers
const {
  createRestaurant,
  readActiveRestaurants,
  readRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
} = require('../controllers/restaurant.controllers')

// Middlewares
const { restaurantIsActive } = require('../middlewares/restaurants.middleware')

// Auth middlewares
const {
  protectSession,
  protectAdmin,
} = require('../middlewares/auth.middleware')

// Validators middlewares
const {
  createRestaurantValidators,
  updateRestaurantValidators,
} = require('../middlewares/restauranValidators.middleware')

// Creating router
const restaurantRouter = express.Router()

// Import reviews router
const { reviewsRouter } = require('./reviews.routes')

// Assigning endpoints
restaurantRouter.get('/', readActiveRestaurants)
restaurantRouter.get('/:id', restaurantIsActive, readRestaurantById)

// Protecting endpoints
restaurantRouter.use(protectSession)

restaurantRouter.post('/', createRestaurantValidators, createRestaurant)

restaurantRouter.use('/reviews', reviewsRouter)

// Protecting endpoints to admin level
restaurantRouter.use(protectAdmin)

restaurantRouter.patch(
  '/:id',
  restaurantIsActive,
  updateRestaurantValidators,
  updateRestaurantById
)

restaurantRouter.delete('/:id', restaurantIsActive, deleteRestaurantById)

module.exports = { restaurantRouter }
