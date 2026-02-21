const asyncHandler = (requestHandler) => 
// Ye ek higher-order function hai
// Ye ek function ko argument me leta hai (usually async route handler)

    (req, res, next) => {
// Ye Express middleware function return karta hai
// req → request object
// res → response object
// next → next middleware function

        Promise.resolve(requestHandler(req, res, next))
// requestHandler ko execute kar rahe hain
// Promise.resolve ensure karta hai ki chahe async ho ya normal function
// usko promise me wrap kare

        .catch((err) => next(err))
// Agar error aaye to next(err) call hoga
// Express ka error handling middleware automatically trigger hoga
    };

export { asyncHandler }
// Is utility function ko export kar rahe hain




// Original code
// const asyncHandler = (requestHandler) => {
//      (req,res,next) =>  { 
//         Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
//      } }

// export {asyncHandler}




// const asyncHandler = () => {}
// const asyncHandler = (funct) => () => {}
// const asyncHandler = (funct) => async() => {}

// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     }
//     catch (error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }