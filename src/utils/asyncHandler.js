const asyncHandler = (fn) => async (res, req, next) => {
  try {
    await fn(res, req, next);
  } catch (error) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
}; // higher order function
// that can receive a function and return a new function
// funct received as a parameter is passes into another async function

/*
const asyncHandler = (fn) => {
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; // higher order function
*/
// another way of writing the same function

export { asyncHandler };
