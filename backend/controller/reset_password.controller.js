const { response } = require("express");
const User = require("../models/password_token.model");
const PasswordReset = require("../models/password_token.model");
const { passwordStrength } = require('check-password-strength');
const argon2 = require("argon2");

const options = [
    {
      id: 0,
      value: 'Very weak',
      minDiversity: 0,
      minLength: 0
    },
    {
      id: 1,
      value: 'Weak',
      minDiversity: 2,
      minLength: 6
    },
    {
      id: 2,
      value: 'Medium',
      minDiversity: 3,
      minLength: 8
    },
    {
      id: 3,
      value: 'Strong',
      minDiversity: 4,
      minLength: 10
    }
  ];

exports.get_reset_password_request = (request, response, next) => {
    response.render("reset_password_email");
};

exports.post_reset_password_request = (request, response, next) => {
    const email = request.body.email;
    
    if (!email) {
        console.error("Error: Email not provided");
        return response.status(400).render("reset_password_email", { 
            error: "Please provide an email address"
        });
    }
    
    PasswordReset.createResetToken(email).then((result) => {
        
        request.session = request.session || {};
        request.session.resetToken = result.token;
        request.session.resetEmail = email;
        console.log(result.token);
        
        return response.redirect("/log_in/token");
    }).catch((error) => {
        console.error("Error creating token:", error);
        return response.status(500).render("reset_password_email", { 
            error: error.message || "Error generating recovery token" 
        });
    });
};

exports.get_token = (request, response, next) => {
    response.render("reset_password_token");
};

exports.post_token = (request, response, next) => {
    const token = request.body.token;

    PasswordReset.verifyToken(token).then((result) => {
        console.log("Token -> ", result);
        if(result.valid) {
            request.session.resetEmail = result.email;
            request.session.resetToken = token;
            return response.redirect('/log_in/reset_password');
        }
    }).catch(error => {
        console.error("Token verification error", error);
        return response.status(500).render("reset_password_token", { 
            error: error.message || "Recovery token verification error" 
        });
    });
};

exports.get_reset_password = (request, response, next) => {
    if (!request.session || !request.session.resetToken || !request.session.resetEmail) {
        console.warn("Invalid or incomplete session in get_reset_password");
        
        return response.redirect('/log_in/reset_password_request?error=session_expired');
    }
    response.render("reset_password");
};

exports.post_reset_password = async (request, response, next) => {
    try {
      console.log("Body in post_reset_password:", request.body);
      console.log("Session in post_reset_password:", request.session);
  
      const password = request.body.password;
      const password2 = request.body.password2;
      const token = request.session.resetToken;
      const email = request.session.resetEmail;
      
      if (!password || !password2) {
        console.error("Error: Passwords not provided");
        return response.render("reset_password", { error: "Both passwords are required" });
      }
      
      if (!token || !email) {
        console.error("Error: Token or email not found in session");
        return response.render("reset_password", { error: "Invalid or expired session" });
      }
  
      if (password !== password2) {
        console.error("Error: Passwords do not match");
        return response.render("reset_password", { error: "Passwords do not match" });
      }
  
      const strength = passwordStrength(password, options);
      
      if (strength.id < 2) {
        console.error("Error: Password too weak");
        return response.render("reset_password", { 
          error: `Password is ${strength.value.toLowerCase()}. It must be at least medium level.` 
        });
      }
  
      const hashedPassword = await encryptPassword(password);
      
      const result = await PasswordReset.resetPassword(token, hashedPassword, email);
      
      console.log("Result of resetPassword:", result);

      delete request.session.resetToken;
      delete request.session.resetEmail;
      
      return response.redirect('/log_in?message=password_updated');
      
    } catch (error) {
      console.error("Error changing password:", error);
      return response.render("reset_password", { 
        error: "Error changing password: " + error.message 
      });
    }
  };

async function encryptPassword(plainPassword) {
    try {
      const hashedPassword = await argon2.hash(plainPassword, {
        type: argon2.argon2id, 
        memoryCost: 65536,    
        timeCost: 3,         
        parallelism: 4       
      });
      
      return hashedPassword;
    } catch (error) {
      console.error('Error', error);
      throw error;
    }
  }