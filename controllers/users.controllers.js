const bcrypy = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { User } = require('../models/user.model')
const { Order } = require('../models/order.model')
const { Meal } = require('../models/meal.model')
const { Restaurant } = require('../models/restaurant.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.utils')
const { AppError } = require('../utils/appError.util')

dotenv.config()

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // Encrypt the password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  })

  // Remove password from response
  newUser.password = undefined
  // this don't work
  // newUser.createdAt = undefined
  // newUser.updatedAt = undefined

  // User has been created
  res.status(201).json({
    status: 'success',
    newUser,
  })
})

const readActiveUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    where: { status: 'active' },
    include: [{ model: Order }],
  })

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  })
})

const updateUserById = catchAsync(async (req, res, next) => {
  const { name, email } = req.body
  const { sessionUser } = req

  // Update using a model's instance
  await sessionUser.update({ name, email })

  res.status(200).json({
    status: 'success',
    sessionUser,
  })
})

const deleteUserById = catchAsync(async (req, res, next) => {
  const { sessionUser } = req

  // Soft delete
  await sessionUser.update({ status: 'deleted' })

  res.status(204).json({ status: 'success' })
})

const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: 'active' },
  })

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong credentials', 400))
  }

  // Remove password from response
  user.password = undefined

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  res.status(200).json({
    status: 'success',
    token,
  })
})

const readOrders = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser

  const user = await User.findOne({
    where: { id },
    attributes: ['id', 'name', 'email'],
    include: {
      model: Order,
      attributes: ['id', 'totalPrice', 'quantity', 'status'],
      include: {
        model: Meal,
        attributes: ['id', 'name', 'price', 'status'],
        include: {
          model: Restaurant,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    },
  })

  res.status(200).json({
    status: 'success',
    user,
  })
})

const readOrderById = catchAsync(async (req, res, next) => {
  const { order } = req
  const user = req.sessionUser

  // const user = await User.findOne({
  //     where: { id },
  //     attributes: ['id', 'name', 'email'],
  //     include: {
  //         model: Order,
  //         where: { id: orderId },
  //         attributes: ['id', 'totalPrice', 'quantity', 'status'],
  //         include: {
  //             model: Meal,
  //             attributes: ['id', 'name', 'price', 'status'],
  //             include: {
  //                 model: Restaurant,
  //                 attributes: { exclude: ['createdAt', 'updatedAt'] },
  //             },
  //         },
  //     },
  // })

  res.status(200).json({
    status: 'success',
    data: {
      user,
      order,
    },
  })
})

module.exports = {
  readActiveUsers,
  createUser,
  updateUserById,
  deleteUserById,
  login,
  readOrders,
  readOrderById,
}