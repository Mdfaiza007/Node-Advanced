class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        statck = ""
    ){
        // overwrite karna
        super(message)
        this.statusCode = statusCode
        this.data = null // Controller object ka data store karne wala variable
        this.message = message
        this.success = false
        this.errors = errors


        if(statck) {
            this.stack = statck
        }
        else {
            Error.captureStackTrace(this,this.constructor)
        }
    }
}


export {ApiError}