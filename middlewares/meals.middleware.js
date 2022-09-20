// Models
const { Meal } = require('../models/meal.model')

// Utils
const { catchAsync } = require('../utils/catchAsync.utils')
const { AppError } = require('../utils/appError.util')

const mealExist = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const meal = await Meal.findOne({
    where: { id, status: 'active' },
  })

  // If user doen't exist, send error message
  if (!meal) {
    return next(new AppError('Meal not found', 404))
  }

  // Adding meal object to request
  req.meal = meal
  next()
})

module.exports = { mealExist }
