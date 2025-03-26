const db = require('../util/database')

module.exports = class Meeting {
    constructor (id_collab, schedule_date, schedule_time, googleauth ) {
        this.collab = id_collab;
        this.date = schedule_date;
        this.time = schedule_time;
        this.auth = googleauth;
    }

    static insertEvents(auth, date, time) {
        const calendar = google.calendar({ version: 'v3', auth });
        var event = {
          description: "Follow up",
          start: {
            date: date,
            dateTime: '2019-11-28T09:00:00-07:00',
            timeZone: 'America/Los_Angeles'
          },
          end: {
            date: '2019-11-28',
            dateTime: '2019-11-28T10:00:00-09:00',
            timeZone: 'America/Los_Angeles'
          },
          recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
          attendees: [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 10 }
            ]
          }
        };
      
        calendar.events.insert(
          {
            auth: auth,
            calendarId: 'primary',
            resource: event
          },
          function(err, event) {
            if (err) {
              console.log(
                'There was an error contacting the Calendar service: ' + err
              );
              return;
            }
            console.log('Event created: %s', event.data.htmlLink);
          }
        );
      }

}