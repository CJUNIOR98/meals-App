// Models
const { Restaurant } = require('../models/restaurant.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.utils')
const { AppError } = require('../utils/appError.util')

const restaurantIsActive = catchAsync(async (req, res, next) => {
  const id = req.params.id || req.params.restaurantId

  const restaurant = await Restaurant.findOne({
    where: { id, status: 'active' },
  })

  // If restaurant doesn't exist, send error message
  if (!restaurant) {
    return next(new AppError('Restaurant not found', 404))
  }

  // Adding restaurant object to request
  req.restaurant = restaurant
  next()
})

module.exports = { restaurantIsActive }
