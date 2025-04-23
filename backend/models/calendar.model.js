const { google } = require('googleapis');

class CalendarModel {
  constructor(auth) {
    this.auth = auth;
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async getCalendars() {
    const res = await this.calendar.calendarList.list();
    return res.data.items; 
  }

  async getEvents(calendarId) {
    const res = await this.calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
    //   maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return res.data.items; // Devuelve los eventos del calendario
  }
}

module.exports = CalendarModel;
