const db = require('../util/database')
const {google} = require('googleapis'); 

module.exports = class Event {
  constructor(startDate, endDate, motive, type) {
    this.startDate = startDate; 
    this.endDate = endDate;
    this.motive = motive;
    this.type = type;
  }
  save() {
    return db.execute(`INSERT INTO evento (fecha_inicio, fecha_fin, motivo, tipo)
      VALUES (?, ?, ?, ?)`, [
        this.startDate, 
        this.endDate, 
        this.motive,
        this.type
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

  static insertEvents(startDate, endDate, motive, accessToken) {
    const oauth2Client = new google.auth.OAuth2(  
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/log_in/success'
    );
    console.log("oauth2Client", oauth2Client);

    oauth2Client.setCredentials({
      access_token: accessToken
    });

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
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'email', minutes: 1},
                { method: 'popup', minutes: 1}
            ]
        }
    };

    return new Promise((resolve, reject) => {
        calendar.events.insert(
            {
                calendarId: 'c_03768ccf82eda9630ea10180b3249084dda11ae3e62a2e67092ca0889e25ca56@group.calendar.google.com',
                resource: event
            },
            function(err, event) {
                if (err) {
                    console.log('Error contacting Calendar service:', err);
                    reject(err);
                    return;
                }
                console.log('Event created:', event.data.htmlLink);
                resolve(event.data);
            }
        );
    }); 
  }
}