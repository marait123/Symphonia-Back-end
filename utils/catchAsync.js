module.exports = fn => {
  return (req, res, next) => {
    // catch rejected promise (inside a function that takes three arguments)
    // to the global error handling middleware
    fn(req, res, next).catch(next);
  };
};
