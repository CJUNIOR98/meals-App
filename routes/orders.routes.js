const express = require('express')

// Controllers
const {
  createOrder,
  readOrdersByUser,
  updateOrder,
  deletOrder,
} = require('../controllers/orders,controllers')

// Middlewares
const {
  orderExists,
  orderIsActive,
} = require('../middlewares/orders.middleware')

// Auth middlewares
const {
  protectSession,
  protectOrderOwner,
} = require('../middlewares/auth.middleware')

// Validators middlewares
const {
  createMealValidators,
} = require('../middlewares/ordersValidator.middleware')

// Creating router
const orderRouter = express.Router()

// Protecting endpoints
orderRouter.use(protectSession)

orderRouter.post('/', createMealValidators, createOrder)

orderRouter.get('/me', readOrdersByUser)

orderRouter.patch('/:id', orderIsActive, protectOrderOwner, updateOrder)

orderRouter.delete('/:id', orderIsActive, protectOrderOwner, deletOrder)

module.exports = { orderRouter }
