const { response } = require("express");
const User = require("../models/password_token.model");
const PasswordReset = require("../models/password_token.model");


exports.get_reset_password_request = (request, response, next) => {
    response.render("reset_password_email");
};

exports.post_reset_password_request = (request, response, next) => {
    console.log("POST reset_password_request recibido");
    console.log("Body:", request.body);
    
    const email = request.body.email;
    
    if (!email) {
        console.error("Error: Email no proporcionado");
        return response.status(400).render("reset_password_email", { 
            error: "Por favor, proporcione un correo electrónico"
        });
    }
    
    PasswordReset.createResetToken(email).then((result) => {
        
        request.session = request.session || {};
        request.session.resetToken = result.token;
        request.session.resetEmail = email;
        
        return response.redirect("/log_in/token");
    }).catch((error) => {
        console.error("Error al crear token:", error);
        return response.status(500).render("error", { 
            message: error.message || "Error generando token de recuperación" 
        });
    });
};

exports.get_token = (request, response, next) => {
    response.render("reset_password_token");
};

exports.post_token = (request, response, next) => {

};
