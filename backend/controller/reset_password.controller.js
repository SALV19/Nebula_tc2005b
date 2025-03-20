const { response } = require("express");
const User = require("../models/password_token.model");


exports.get_reset_password_request = (request, response, next) => {
    response.render("reset_password_email");
};

exports.post_reset_password_request = (request, response, next) => {
    const email = request.body.email;
    console.log(email);
    response.redirect("/log_in/token");
};

exports.get_token = (request, response, next) => {
    response.render("reset_password_token");
};

exports.post_token = (request, response, next) => {

};
