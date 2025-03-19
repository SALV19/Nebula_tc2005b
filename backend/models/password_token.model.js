const db = require("../util/database");
const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
});

const setExAsync = promisify(redisClient.setex).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

module.exports = class PasswordReset {
    constructor(user_email, user_token, expiresIn = 3600) {
        this.email = user_email;
        this.token = user_token;
        this.expiresIn = expiresIn;
    }

    static generateToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
          token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    static async createResetToken(email) {
        try {
          const [users] = await db.execute(
            "SELECT email FROM colaborador WHERE email = ?",
            [email]
          );
    
          if (users.length === 0) {
            throw new Error("Email no encontrado");
          }
    
          const token = this.generateToken();
          
          const resetData = new PasswordReset(email, token);
          await setExAsync(
            `password_reset:${token}`,
            resetData.expiresIn,
            email
          );
    
          return { email, token };
        } catch (error) {
          throw error;
        }
    }

    static async verifyToken(token) {
        try {
          const email = await getAsync(`password_reset:${token}`);
          
          if (!email) {
            throw new Error("Token inválido o expirado");
          }
          
          return { valid: true, email };
        } catch (error) {
          throw error;
        }
    }

    static async resetPassword(token, newPassword) {
        try {
          const { valid, email } = await this.verifyToken(token);
          
          if (!valid) {
            throw new Error("Token inválido o expirado");
          }
    
          await db.execute(
            "UPDATE colaborador SET contrasena = ? WHERE email = ?",
            [newPassword, email]
          );
    
          await delAsync(`password_reset:${token}`);
          
          return { success: true, email };
        } catch (error) {
          throw error;
        }
    }

    static async invalidateToken(token) {
        try {
          await delAsync(`password_reset:${token}`);
          return { success: true };
        } catch (error) {
          throw error;
        }
    }

};