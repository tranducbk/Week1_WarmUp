const yup = require('yup');

async function productInputMiddleware(ctx, next) {
  try {
    const postData = ctx.request.body;
    let schema = yup.object().shape({
      id: yup.number().positive().integer().required().transform((value) => Number(value)),
      name: yup.string().required(),
      price: yup.number().positive().required(),
      description: yup.string().required(),
      product: yup.string().required(),
      color: yup.string().required(),
      createdAt: yup.string().required(),
      image: yup.string().url().required()
    });

    const validatedData = await schema.validate(postData);
    ctx.request.body = validatedData;
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

module.exports = productInputMiddleware; 