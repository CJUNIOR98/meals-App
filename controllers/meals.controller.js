const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Meal } = require('../models/meal.model')
const { Restaurant } = require('../models/restaurant.model')
const { Review } = require('../models/review.model')
const { User } = require('../models/user.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.utils')
const { AppError } = require('../utils/appError.util')

dotenv.config()

// Create
const createMeal = catchAsync(async (req, res, next) => {
  const { id } = req.restaurant

  const { name, price } = req.body

  const newMeal = await Meal.create({
    name,
    price,
    restauranId: id,
  })

  res.status(201).json({
    status: 'succes',
    newMeal,
  })
})

// Read
const readActiveMeals = catchAsync(async (req, res, next) => {
  const meals = await Meal.findAll({
    attributes: ['id', 'name', 'price'],
    where: { status: 'active' },
    include: {
      model: Restaurant,
      where: { status: 'active' },

      /* If restaurant is disabled, user can't buy this food
            required: false, // Apply OUTER JOIN */
      attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
      include: {
        model: Review,
        where: { status: 'active' },
        required: false,
        attributes: ['id', 'comment', 'rating'],
        include: {
          model: User,
          required: false,
          attributes: ['id', 'name', 'email'],
        },
      },
    },
  })

  res.status(200).json({
    status: 'success',
    data: {
      meals,
    },
  })
})

const readActiveMealsById = catchAsync(async (req, res, next) => {
  const { id } = req.Meal

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
    attributes: ['id', 'name', 'price'],
    include: {
      model: Restaurant,
      where: { status: 'active' },

      attributes: { exclude: ['status', 'createdAt', 'updatedAt'] },
      include: {
        model: Review,
        where: { status: 'active' },
        required: false,
        attributes: ['id', 'comment', 'rating'],
        include: {
          model: User,
          required: false,
          attributes: ['id', 'name', 'email'],
        },
      },
    },
  })

  res.status(200).json({
    status: 'succes',
    data: {
      meal,
    },
  })
})

const updateMealById = catchAsync(async (req, res, next) => {
  const { name, price } = req.body
  const { meal } = require

  await meal.update({ name, price })

  res.status(200).json({
    status: 'succes',
    meal,
  })
})

const deleteMealById = catchAsync(async (req, res, next) => {
  const { meal } = require

  // Soft delete
  await meal.update({ status: 'deleted' })

  res.status(204).json({ status: 'succes' })
})

module.exports = {
  createMeal,
  readActiveMeals,
  readActiveMealsById,
  updateMealById,
  deleteMealById,
}
