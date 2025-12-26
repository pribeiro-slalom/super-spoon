const Joi = require('joi');

const createSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().allow('', null),
  completed: Joi.boolean(),
  dueDate: Joi.date().iso().allow(null),
  tags: Joi.array().items(Joi.string()).allow(null),
});

const updateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(255),
  description: Joi.string().allow('', null),
  completed: Joi.boolean(),
  dueDate: Joi.date().iso().allow(null),
  tags: Joi.array().items(Joi.string()).allow(null),
}).min(1);

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });
    if (error) {
      const details = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details } });
    }
    req.validatedBody = value;
    next();
  };
}

module.exports = { createSchema, updateSchema, validate };