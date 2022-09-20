const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Models
const { Meal } = require('../models/meal.model')
const { Order } = require('../models/order.model')
const { Restaurant } = require('../models/restaurant.model')
const { Review } = require('../models/review.model')
const { User } = require('../models/user.model')
