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

  static async getPermissions(email) {
    return db.execute(
      `SELECT nombre_permiso
        FROM colaborador c
        JOIN equipo e ON e.id_colaborador = c.id_colaborador
        JOIN rol r ON r.id_rol = e.id_rol
        JOIN rol_permisos rp ON rp.id_rol = r.id_rol
        WHERE c.email = (?);
      `,
      [email]
    );
  }
  static async getCollabsInfo(department) {
    return db.execute("SELECT nombre");
  }
};
