const express = require('express')

// Controllers
const {
  readActiveUsers,
  createUser,
  updateUserById,
  login,
  readOrders,
  readOrderById,
  deleteUserById,
} = require('../controllers/users.controllers')

// Middlewares
const { userExist } = require('../middlewares/users.middleware')
const { orderExists } = require('../middlewares/orders.middleware')

// Auth middlewares
const {
  protectSession,
  protectUsersAccount,
  protectAdmin,
} = require('../middlewares/auth.middleware')

// Validators middlewares
const {
  createUserValidators,
  updateUserValidators,
  loginUserValidators,
} = require('../middlewares/usersValidators.middleware')

// Creating router
const usersRouter = express.Router()

// Assigning endpoints
usersRouter.post('/signup', createUserValidators, createUser)

usersRouter.post('/login', loginUserValidators, login)

// Protecting endpoints
usersRouter.use(protectSession)

// Access to admin users
usersRouter.get('/', protectAdmin, readActiveUsers)

// Account owner access
usersRouter.patch(
  '/:id',
  userExist,
  protectUsersAccount,
  updateUserValidators,
  updateUserById
)

usersRouter.delete('/:id', userExist, protectUsersAccount, deleteUserById)

usersRouter.get('/orders', readOrders)

usersRouter.get('/orders/:id', orderExists, readOrderById)

module.exports = { usersRouter }
