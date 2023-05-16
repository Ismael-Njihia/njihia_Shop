const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}


//override the default error handler
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;


    //check for cast error and return a more user friendly message
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Invalid ID';
        statusCode = 404;
    }
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })


}

export { notFound, errorHandler }
