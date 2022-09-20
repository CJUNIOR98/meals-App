const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catc((err) => next(err))
  }
}

module.exports = { catchAsync }
