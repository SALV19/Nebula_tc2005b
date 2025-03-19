const { use } = require("passport");
const db = require("../util/database");

module.exports = class Password_Reset_Token {
    constructor(user_email) {
        this.email = user_email;
    }

    
};