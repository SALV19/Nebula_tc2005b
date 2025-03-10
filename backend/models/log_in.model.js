const db = require('../util/database');

module.exports = class User{

    constructor(my_user, my_password) {
        this.user = my_user;
        this.password = my_password;
    }
    save() {
        return db.execute('INSERT INTO collabs(id, user, password) VALUES (UUID(), ?, ?)', [this.user, this.password]);
    }
    static fetchAll() {
        return db.execute('SELECT * FROM collabs');
    }
}