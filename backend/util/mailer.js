const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendMail(email, token) {
  try {
    const info = await transporter.sendMail({
      from: '"Nebula HRSM" <nebulahrmsolutions@gmail.com>', 
      to: email, // list of receivers
      subject: "Reset Password Nebula HRSM", 
      text: `Tu código de restablecimiento es: ${token}`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">Recuperación de contraseña</h2>
            <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para completar el proceso:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 4px;">
              ${token}
            </div>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <p>Saludos,<br>Equipo de Nebula HRSM</p>
          </div>`, 
    });
    return info;  
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  } 
}

module.exports = sendMail;
