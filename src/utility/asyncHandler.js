const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch(error => next(`ERROR : ${error}`))
    }
}

export {asyncHandler}

// //OR Another way of asynchandler function

// const asyncFunction = (fn) => async(err, req, res, next)=>{
//     try {
//         await fn(req,res,next)
//     }
//     catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message : err.message
//         })
//     }
// }