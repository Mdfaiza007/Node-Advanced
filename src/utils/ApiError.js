// class ApiError extends Error {
//     constructor(
//         statusCode,
//         message = "Something went wrong",
//         errors = [],
//         statck = ""
//     ){
//         // overwrite karna
//         super(message)
//         this.statusCode = statusCode
//         this.data = null // Controller object ka data store karne wala variable
//         this.message = message
//         this.success = false
//         this.errors = errors


//         if(statck) {
//             this.stack = statck
//         }
//         else {
//             Error.captureStackTrace(this,this.constructor)
//         }
//     }
// }


// export {ApiError}
class ApiError extends Error {
// ApiError class bana rahe hain jo built-in Error class ko extend karti hai
// Iska matlab: Ye normal Error jaisa behave karegi + extra properties add karegi

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ){
        // Constructor automatically call hota hai jab new ApiError() use karte hain

        super(message)
        // Parent Error class ka constructor call kar rahe hain
        // Ye built-in error message set karta hai

        this.statusCode = statusCode
        // HTTP status code store kar rahe hain (400, 401, 404, 500 etc)

        this.data = null
        // Optional field (agar future me additional data bhejna ho)

        this.message = message
        // Custom error message store kar rahe hain

        this.success = false
        // Response me consistent structure maintain karne ke liye

        this.errors = errors
        // Validation errors ya multiple error details store karne ke liye array

        if(stack) {
            this.stack = stack
            // Agar custom stack pass kiya gaya ho to use set kare
        }
        else {
            Error.captureStackTrace(this, this.constructor)
            // Automatically current error ka stack trace capture kare
            // Debugging ke liye useful
        }
    }
}

export { ApiError }
// Class ko export kar rahe hain taaki controllers me use kar sake