const db = require('../util/database')
const {google} = require('googleapis');

module.exports = class Meeting {
    constructor (id_collab, schedule_date) {
        this.collab = id_collab;
        this.date = schedule_date;
    }

    static insertEvents(accessToken, date, startTime, endTime, emailCollab, repeating, occurrences, summary) {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'http://localhost:3000/log_in/success'
        );

        oauth2Client.setCredentials({
            access_token: accessToken
        });

        const repeatMap = {
            day: "DAILY",
            week: "WEEKLY",
            month: "MONTHLY",
            year: "YEARLY",
            no: ""
        };
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        var event = {
            summary: summary,
            start: {
            dateTime: startTime,
            timeZone: 'America/Mexico_City'
            },
            end: {
            dateTime: endTime,
            timeZone: 'America/Mexico_City'
            }, 
            attendees: emailCollab,
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 1},
                    { method: 'popup', minutes: 1}
                ]
            }
        };

        if (repeating !== 'no' && occurrences > 0) {
            var promesas = [];
            
            promesas.push(
                calendar.events.insert({
                    calendarId: process.env.CALENDAR_ID_MEETING ,
                    resource: event
                })
            );
            
            let currentDate = new Date(startTime);
            let currentEndDate = new Date(endTime);
            let contador = 1;
            
            while (contador < occurrences) {
                if (repeatMap[repeating] === "DAILY") {
                    currentDate.setDate(currentDate.getDate() + 1);
                    currentEndDate.setDate(currentEndDate.getDate() + 1);
                } else if (repeatMap[repeating] === "WEEKLY") {
                    currentDate.setDate(currentDate.getDate() + 7);
                    currentEndDate.setDate(currentEndDate.getDate() + 7);
                } else if (repeatMap[repeating] === "MONTHLY") {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    currentEndDate.setMonth(currentEndDate.getMonth() + 1);
                } else if (repeatMap[repeating] === "YEARLY") {
                    currentDate.setFullYear(currentDate.getFullYear() + 1);
                    currentEndDate.setFullYear(currentEndDate.getFullYear() + 1);
                }
                
                const diaSemana = currentDate.getDay();
                if (diaSemana === 0 || diaSemana === 6) {
                    continue;
                }
                
                const eventoIndividual = {
                    ...event,  
                    start: {
                        dateTime: currentDate.toISOString(),
                        timeZone: 'America/Mexico_City'
                    },
                    end: {
                        dateTime: currentEndDate.toISOString(),
                        timeZone: 'America/Mexico_City'
                    },
                    recurrence: []  
                };
                
                promesas.push(
                    calendar.events.insert({
                        calendarId: process.env.CALENDAR_ID_MEETING,
                        resource: eventoIndividual
                    })
                );
                
                contador++;
            }
            
            return Promise.all(promesas)
                .then(resultados => {
                    return resultados[0];
                });
        } else {
            return new Promise((resolve, reject) => {
                calendar.events.insert(
                    {
                        calendarId: process.env.CALENDAR_ID_MEETING,
                        resource: event
                    },
                    function(err, event) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(event.data);
                    }
                );
            });
        }   
    }
}