import databaseConnection from "../db/index.js"

export class apiError extends Error{
    constructor(
        statusCode,
        message = "something went wrong",
        error=[],
        stack,
        data,
        success
    )  {
        super(message)
this.statusCode = statusCode
this.message = message
this.error  = error
this.success = null,
this.data = null
     
}
}