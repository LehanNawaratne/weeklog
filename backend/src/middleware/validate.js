export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(result.error);
    }

    if (source === 'body') {
      req.body = result.data;
    } else {
      req.validatedQuery = result.data;
    }

    return next();
  };
}
