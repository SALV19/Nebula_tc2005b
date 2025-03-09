const db = require("../util/database");

module.exports = class User {
  constructor(user_email, user_password) {
    this.email = user_email;
    this.password = user_password;
  }

  static async fetchByEmail(email, callback = null) {
    if (!callback) {
      return db.execute(
        "SELECT email, contrasena FROM colaborador c WHERE c.email = (?)",
        [email]
      );
    } else {
      const { err, user } = await db
        .execute(
          "SELECT email, contrasena FROM colaborador c WHERE c.email = (?)",
          [email]
        )
        .then((usr) => {
          return { err: null, user: usr };
        })
        .catch((error) => {
          return { err: error, user: null };
        });
      callback(err, user);
    }
  }
};
