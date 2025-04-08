exports.initial_middleware= (request,response,next)=>{
    if (request.session.firstLogin) {
        next()
    }
    else{
        response.redirect("/log_in")
    }
}