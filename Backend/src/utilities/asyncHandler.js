/*
    This method is a higher order method which takes another method as an
    argument. Basically this is a wrapper function for functions which has 
    asynchronous tasks such making a DB call or reading data from the computer
*/

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    .catch(next);
};

export default asyncHandler;