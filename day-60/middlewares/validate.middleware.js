const { object } = require("yup");

module.exports = (req, res, next) => {
  req.validate = async (data, rule = {}) => {
    const schema = object(rule);
    try {
      const body = await schema.validate(data, {
        abortEarly: false,
      });
      return body;
    } catch (e) {
      const errors = Object.fromEntries(
        e?.inner?.map((item) => {
          return [item.path, item.message];
        })
      );
      req.flash("errors", errors);
      req.flash("olds", data);
    }
  };
  const errors = req.flash("errors");
  const olds = req.flash("olds");
  req.errors = errors.length ? errors[0] : {};
  req.olds = olds.length ? olds[0] : {};
  next();
};
