const db = require('../util/database')
const {google} = require('googleapis');

module.exports = class Meeting {
    constructor (id_collab, schedule_date) {
        this.collab = id_collab;
        this.date = schedule_date;
    }

    static insertEvents(accessToken, date, startTime, endTime, emailCollab) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:3000/log_in/success'
        );

        oauth2Client.setCredentials({
            access_token: accessToken
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        var event = {
            summary: "Follow up",
            start: {
            dateTime: startTime,
            timeZone: 'America/Mexico_City'
            },
            end: {
            dateTime: endTime,
            timeZone: 'America/Mexico_City'
            },
            //recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
            attendees: [{ email: emailCollab }],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 10 }
                ]
            }
        };
      
        return new Promise((resolve, reject) => {
            calendar.events.insert(
                {
                    calendarId: 'primary',
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