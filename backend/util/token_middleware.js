exports.token_middleware= (request,response,next)=>{
    if (request.session.token) {
        next()
    }
    else{
        response.redirect("/log_in")
    }
}