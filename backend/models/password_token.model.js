const db = require("../util/database");
const NodeCache = require("node-cache");

const tokenCache = new NodeCache({ 
    stdTTL: 3600,             
    checkperiod: 600,         
    deleteOnExpire: true      
});

module.exports = class PasswordReset {
    constructor(user_email, user_token, expiresIn = 3600) {
        this.email = user_email;
        this.token = user_token;    
        this.expiresIn = expiresIn;
    }

    static generateToken(length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < length; i++) {
          token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    }

    static createResetToken(email) {
        return db.execute(
            "SELECT email FROM colaborador WHERE email = ?", [email]
        ).then(([users]) => {
            if(users.length === 0) {
                console.error(`Email not found: ${email}`);
                throw new Error("Email not found");
            }

            const token = this.generateToken();

            const success = tokenCache.set(`token:${token}`, email);

            if(!success) {
                console.error(`Error saving token in cache for: ${email}`);
                throw new Error("Error saving token");
            }

            return {email, token};
        }).catch(error => {
            console.error("Error in createResetToken:", error);
            throw error;
        })
    }

    static verifyToken(token) {
        return new Promise((resolve, reject) => {
            const email = tokenCache.get(`token:${token}`);

            if(!email) {
                console.error("Invalid or expired token");
                reject(new Error("Invalid or expired token"));
                return;
            }   

            resolve({valid: true, email});
        })
    }

    static resetPassword(token, hashedPassword, email) {
        if(email) {
            return db.execute(
                "UPDATE colaborador SET contrasena = ? WHERE email = ?",
                [hashedPassword, email]  
            ).then(() => {
                tokenCache.del(`token:${token}`);
                return { success: true, email };
            }).catch(error => {
                console.error("Error updating password:", error);
                throw error;
            });
        }
    }

    static invalidateToken(token) {
        return new Promise((resolve, reject) => {
            try {
                tokenCache.del(`token:${token}`);
                resolve({ success: true });
            } catch (error) {
                console.error("Error in invalidateToken:", error);
                reject(error);
            }
        });
    }

};