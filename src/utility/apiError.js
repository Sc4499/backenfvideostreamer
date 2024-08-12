class apiError extends Error{
    constructor(
        statusCode,
        message = "something went wrong",
        error=[],
        statck = ""
    )  {

    } 
  
}