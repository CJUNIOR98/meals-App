const express = require('express')

// Routes
const { usersRouter } = require('./routes/users.routes')
const { restaurantRouter } = require('./routes/restaurants.routes')
const { mealsRouter } = require('./routes/meals.routes')
const { orderRouter } = require('./routes/orders.routes')

// Init our express app
const app = express()

// Enable express app to receive JSON data
app.use(express.json())

// Defining endpoints
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/restaurants', restaurantRouter)
app.use('/api/v1/meald', mealsRouter)
app.use('/api/v1/orders', orderRouter)

// Global error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500
  const status = error.status || 'fail'

  res.status(statusCode).json({
    status,
    message: error.message,
    error,
    stack: error.stack,
  })
})

// Catch non-existing endpoints
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `${req.method} ${req.url} doesnot exist in our server`,
  })
})

module.exports = { app }
