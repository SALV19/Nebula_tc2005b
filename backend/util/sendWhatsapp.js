const axios = require("axios");

async function sendWhatsAppNotiRequests(name, type, date, telefono) {
    console.log("Nombre:", name, "-", typeof name);
    console.log("Tipo de falta:", type, "-", typeof type);
    console.log("Fecha de inicio:", date, "-", typeof date);
    
    
    telefono = String(telefono).replace(/\D/g, '')
    if (!telefono.startsWith('52')) {
        telefono = '52' + telefono;
    }
    
    console.log("telefono:", telefono, "-", typeof date);
    
    try {
        // telefono = telefono.toString();
        // telefono = telefono.startsWith('52') ? telefono : '52' + telefono;

        const response = await axios.post(
            "https://graph.facebook.com/v17.0/609265038937705/messages",
            {
                messaging_product: "whatsapp",
                to: telefono,
                type: "template",
                template: {
                    name: "approvedrequest",
                    language: { code: "en_US" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", parameter_name: "name", text: name },
                                { type: "text", parameter_name: "type", text: type },
                                { type: "text", parameter_name: "date", text: date },
                            ],
                        },
                    ],
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Mensaje de WhatsApp enviado con éxito:", response.data);
    } catch (error) {
        console.error("Error al enviar mensaje de WhatsApp:", error.response ? error.response.data : error);
    }
}

module.exports = sendWhatsAppNotiRequests;
