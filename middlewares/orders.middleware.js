// Models
const { Order } = require('../models/order.model')
const { Meal } = require('../models/meal.model')
const { Restaurant } = require('../models/restaurant.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.utils')
const { AppError } = require('../utils/appError.util')

// This middleware is to users controllers
const orderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params
  const userId = req.sessionUser.id

  const order = await Order.findOne({
    where: { id, userId },
    attributes: ['id', 'totalPrice', 'quantity', 'status'],
    include: {
      model: Meal,
      attributes: ['id', 'name', 'price', 'status'],
      include: {
        model: Restaurant,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    },
  })

  // If user doesn't exist, send error message
  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  // Adding order object to request
  req.order = order
  next()
})

const orderIsActive = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const order = await Order.findOne({
    where: { id, status: 'active' },
    // attributes: {},
  })

  // If user doesn't exist, send error message
  if (!order) {
    return next(new AppError('Order not found', 404))
  }

  // Adding order object to request
  req.order = order
  next()
})

module.exports = { orderExists, orderIsActive }
