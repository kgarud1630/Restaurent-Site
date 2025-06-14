const { validationResult } = require('express-validator');

const validateBody = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const validateQuery = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  validateBody,
  validateQuery
};