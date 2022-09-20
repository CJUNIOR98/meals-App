const express = require('express')

// Controllers
const {
  createMeal,
  readActiveMeals,
  readActiveMealsById,
  updateMealById,
  deleteMealById,
} = require('../controllers/meals.controller')

// Middlewares
const { mealExist } = require('../middlewares/meals.middleware')
const { restaurantIsActive } = require('../middlewares/restaurants.middleware')

// Auth middlewares
const {
  protectSession,
  protectAdmin,
} = require('../middlewares/auth.middleware')

// Validators middlewares
const { mealValidators } = require('../middlewares/mealsValidators.middleware')

// Creating router
const mealsRouter = express.Router()

// Assing endpoints
mealsRouter.get('/', readActiveMeals)
mealsRouter.get('/:id', mealExist, readActiveMealsById)

//Protecting endpoints
mealsRouter.use(protectSession)

// Protecting endpoinds to admin level
mealsRouter.use(protectAdmin)

mealsRouter.post('/:id', restaurantIsActive, mealValidators, createMeal)
mealsRouter.patch('/:id', mealExist, mealValidators, updateMealById)
mealsRouter.delete(':id', mealExist, deleteMealById)

module.exports = { mealsRouter }
