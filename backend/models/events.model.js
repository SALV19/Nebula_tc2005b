const db = require('../util/database')
const {google} = require('googleapis'); 

module.exports = class Event {
  constructor(startDate, endDate, motive, type, id_google_event) {
    this.startDate = startDate; 
    this.endDate = endDate;
    this.motive = motive;
    this.type = type;
    this.eventId = id_google_event;
  }
  save() {
    return db.execute(`INSERT INTO evento (fecha_inicio, fecha_fin, motivo, tipo, id_google_event)
      VALUES (?, ?, ?, ?, ?)`, [
        this.startDate, 
        this.endDate, 
        this.motive,
        this.type,
        this.eventId,
      ]
    )
  }
  static async fetchEvents() {
    return db.execute(`SELECT e.* 
                      FROM evento e
                      LEFT JOIN tiene_evento te
                        ON te.id_evento = e.id_evento
                      WHERE te.id_evento IS NULL;`)
  }

  static insertEvents(startDate, endDate, motive, accessToken, emails, type) {
    const oauth2Client = new google.auth.OAuth2(  
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/log_in/success'
    );

    oauth2Client.setCredentials({
      access_token: accessToken
    });
    const attendees = emails.map(item => ({ email: item.email }));

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    var event = {
        summary: motive,
        start: {
        date: startDate,
        timeZone: 'America/Mexico_City'
        },
        end: {
        date: endDate,
        timeZone: 'America/Mexico_City'
        }, 
        attendees: attendees,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 10},
                { method: 'popup', minutes: 10}
            ]
        }
    };

    return new Promise((resolve, reject) => {
        calendar.events.insert(
            {
                calendarId: process.env.CALENDAR_ID_EVENT ,
                resource: event
            },
            async function(err, event) {
                if (err) {
                    console.log('Error contacting Calendar service:', err);
                    reject(err);
                    return;
                }
                console.log('Event created:', event.data.htmlLink);
                const eventId = event.data.id;
                console.log('Event ID:', eventId);
                const newEvent = new Event(startDate, endDate, motive, type, eventId);
                try {
                  await newEvent.save();
                  resolve(event.data); 
                } catch (error) {
                  console.error('Error saving event to database:', error);
                  reject(error); 
                  return;
                }
            }
        );
    }); 
  }

  static async deleteEvent(eventId, calendarId, accessToken) {
    return new Promise( async(resolve, reject) => {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/log_in/success'
      );

      oauth2Client.setCredentials({
        access_token: accessToken, 
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      try {
        await calendar.events.delete({
          calendarId: calendarId,
          eventId: eventId,
        });

        if (calendarId === process.env.CALENDAR_ID_EVENT) {
          await db.execute('DELETE FROM evento WHERE id_google_event = ?', [eventId]);
          console.log('Evento eliminado de la base de datos.');
        }

        resolve(); 
      } catch (err) {
        console.error('Error al eliminar evento:', err);
        reject(new Error('Error al eliminar evento: ' + err.message));
      }
    });
  };
}