const { color } = require("chart.js/helpers");
const Requests = require("../models/home.model");
const {contVac} = require("../util/contVacations")
const {google} = require('googleapis')
require('dotenv').config()

exports.get_home = async (request, response) => {
  const absences = await Requests.fetchDaysApproved(request.session.email)
  .then(data => data[0])
  .catch(e => {
    console.error("Error fetching approved absences:", e);
    return [];
  });
  
  console.log('user:', request.user.accessToken);
  console.log('acces:', request.user.accessToken);
  if (request.user?.accessToken) {
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:3000/log_in/success')
    oauth2Client.setCredentials({
      access_token: request.user.accessToken
    })

    request.session.googleTokenInfo = {
      accessToken : request.user.accessToken,
    }
    
    const tokenInfo = await oauth2Client.getTokenInfo(request.user.accessToken);
    console.log("Token Scopes:", tokenInfo.scopes);
    console.log("expire date", tokenInfo.expiry_date);

    const calendar = google.calendar({version: 'v3', auth: oauth2Client})
    calendar.calendarList.list({}, (err, res) => {
      if(err) {
        console.log('Error with calendar: ', err)
        response.end('Error')
        return
      }
      const calendars = res.data.items;
    })

    const { data } = await calendar.calendarList.list();

    const calendarListResponse = await calendar.calendarList.list();
    const calendars = calendarListResponse.data.items;

    const calendarMap = {};
    const colors = ["#485FC7", "#B7A5E6", "#59A250", "#60508F", "#699895", "#886998", "#986980","#986969"];
    const colorIndex = 0
  
    let eventos = [];

    for (const cal of calendars) {
      const calendarId = cal.id;

      console.log("color ", cal.backgroundColor);
      // calendarMap[calendarId] = colors[calendarId];

      const eventsResponse = await calendar.events.list({
        calendarId,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const eventosDelCalendario = eventsResponse.data.items.map(event => ({
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end?.dateTime || event.end?.date,
        backgroundColor: cal.backgroundColor,
      }));
      eventos = [...eventos, ...eventosDelCalendario];
    }

    // console.log('Eventos obtenidos:', eventos);
    
    contVac(request)
      .then(({diasDisponibles,diasTotales, error}) => {
        console.log("eventos: ", eventos);
          response.render("home_page", {
            diasDisponibles,
            diasTotales,
            error,
            permissions: request.session.permissions,
            total_absences: absences.length,
            csrfToken: request.csrfToken(),
            eventos: JSON.stringify(eventos),
          })
      })
      .catch(error => {console.error(error)}) 
  }

};



// function verificarAccesoCalendario(auth, calendarId = 'primary') {
//   const calendar = google.calendar({ version: 'v3', auth });
  
//   console.log("Listando calendarios disponibles...");
//   return calendar.calendarList.list()
//       .then(response => {
//           const calendarList = response.data;
          
//           console.log(`El usuario tiene acceso a ${calendarList.items.length} calendarios:`);
//           calendarList.items.forEach(cal => {
//               console.log(`- ${cal.summary} (${cal.id})`);
//           });
          
//           const calendarExiste = calendarList.items.some(cal => cal.id === calendarId);
          
//           if (calendarExiste) {
//               console.log(`El usuario tiene acceso al calendario: ${calendarId}`);
//               return true;
//           } else if (calendarId === 'primary') {
//               console.log("Usando el calendario principal del usuario");
//               return true;
//           } else {
//               console.log(`El usuario NO tiene acceso al calendario: ${calendarId}`);
//               return false;
//           }
//       })
//       .catch(error => {
//           console.error("Error al verificar acceso al calendario:", error);
//           return false;
//   });
// }

