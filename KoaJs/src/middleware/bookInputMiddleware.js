const yup = require('yup');

async function bookInputMiddleware(ctx, next) {
  try {
    const postData = ctx.request.body;
    let schema = yup.object().shape({
      id: yup.number().positive().integer().required(),
      name: yup.string().required().min(3, 'Name must be at least 3 characters'),
      price: yup.number().positive().required().min(0, 'Price must be greater than 0'),
      description: yup.string().required().min(10, 'Description must be at least 10 characters'),
      product: yup.string().required(),
      color: yup.string().required(),
      createdAt: yup.date().required(),
      image: yup.string().url('Must be a valid URL').required()
    });

    await schema.validate(postData);
    next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name
    }
  }
}

module.exports = bookInputMiddleware;