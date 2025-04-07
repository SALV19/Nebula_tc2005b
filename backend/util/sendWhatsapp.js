
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

async function sendMeetingNotification(name, summary, day, time, telefono) {
    
    telefono = String(telefono).replace(/\D/g, '')
    if (!telefono.startsWith('52')) {
        telefono = '52' + telefono;
    }
    
    try {
        const response = await axios.post(
            "https://graph.facebook.com/v17.0/609265038937705/messages",
            {
                messaging_product: "whatsapp",
                to: telefono,
                type: "template",
                template: {
                    name: "followup",
                    language: { code: "en_US" },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                { type: "text", parameter_name: "name", text: name },
                                { type: "text", parameter_name: "summary", text: summary },
                                { type: "text", parameter_name: "day", text: day },
                                { type: "text", parameter_name: "time", text: time },
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
        console.log("Mensaje enviado con éxito:", response.data);
    } catch (error) {
        console.error("Error al enviar mensaje de WhatsApp:", error.response ? error.response.data : error);
    }
}

module.exports = {
    sendWhatsAppNotiRequests,
    sendMeetingNotification 
};
