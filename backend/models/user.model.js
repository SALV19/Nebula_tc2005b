const db = require("../util/database");

module.exports = class User {
  constructor(user_email, user_password) {
    this.email = user_email;
    this.password = user_password;
  }

  static async fetchByEmail(email) {
    return db.execute(
      "SELECT email, contrasena FROM colaborador c WHERE c.email = (?)",
      [email]
    );
  }
};
