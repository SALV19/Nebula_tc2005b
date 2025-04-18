const { color } = require("chart.js/helpers");
const Requests = require("../models/home.model");
const Event = require("../models/events.model");
const Collab = require("../models/collabs.model");
const Equipo = require("../models/equipo.model");
const {contVac} = require("../util/contVacations");
const {google} = require('googleapis');
const { off } = require("../util/database");
require('dotenv').config();

exports.get_requests = async (request, response) => {
  try {
    const offset = request.body.offset * 8;

    const [rolData] = await Equipo.fetchRolByEmail(request.session.email);
    const idRol = rolData[0]?.id_rol;


     /**If the role is SuperAdmin (id_rol = 3), automatically approve 
      * And if is lider (id_rol = 3), automatically status = 0.5 */ 
     let reqData;

    if (idRol === 3) {
      reqData = await Requests.fetchReqHome(offset);
    } else if (idRol === 2) {
      reqData = await Requests.fetchTeamRequests(request.session.email,offset);
    } else {
      reqData = await Requests.fetchByLoggedColab(offset,request.session.id_colaborador);
    }

    
    response.json({
      permissions: request.session.permissions,
      faults: reqData,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};


exports.get_home = async (request, response) => {
  const absences = await Requests.fetchDaysApproved(request.session.email)
  .then(data => data[0])
  .catch(e => {
    console.error("Error fetching approved absences:", e);
    return [];
  });
  
  if (request.user?.accessToken) {
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'http://localhost:3000/log_in/success')
    oauth2Client.setCredentials({
      access_token: request.user.accessToken
    })

    request.session.googleTokenInfo = {
      accessToken : request.user.accessToken,
    }
    
    const tokenInfo = await oauth2Client.getTokenInfo(request.user.accessToken);
    // console.log("Token Scopes:", tokenInfo.scopes);
    // console.log("expire date", tokenInfo.expiry_date);

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

    let eventos = [];

    for (const cal of calendars) {
      const calendarId = cal.id;

      //console.log("color ", cal.backgroundColor);
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
        borderColor : cal.backgroundColor,
        display: 'block',
        color: '#FFFF',
        description: event.description,
      }));
      eventos = eventos.concat(eventosDelCalendario);
    }
    // console.log('Eventos obtenidos:', eventos);
    
    contVac(request)
      .then(({diasDisponibles,diasTotales, error}) => {
        // console.log("eventos: ", eventos);
        // console.log('Permisos: ', request.session.permissions);
        response.render("home_page", {
          diasDisponibles,
          diasTotales,
          error,
          permissions_error: request.session.permissions.length,
          permissions: request.session.permissions,
          total_absences: absences.length,
          csrfToken: request.csrfToken(),
          eventos: JSON.stringify(eventos),          
        })
      })
      .catch(error => {console.error(error)}) 
  } else {
    contVac(request)
        .then(({diasDisponibles,diasTotales, error}) => {
          // console.log("eventos: ", eventos);
          // console.log('Permisos: ', request.session.permissions);
          response.cookie("come_from", 0, {maxAge: 360000, httpOnly: true});
          response.render("home_page", {
            diasDisponibles,
            diasTotales,
            error,
            permissions_error: request.session.permissions.length,
            permissions: request.session.permissions,
            total_absences: absences.length,
            csrfToken: request.csrfToken(),
            eventos: null,
          })
        })
        .catch(error => {console.error(error)}) 
  }

};

exports.add_event = (request, response) => {
  // console.log("Entro aqui");
  const motive = request.body.motive;
  const type = request.body.type;
  const startDate = request.body.startDate;
  const endDate = request.body.endDate;
  const endDateParts = endDate.split('-');
  const year = parseInt(endDateParts[0]);
  const month = parseInt(endDateParts[1]) - 1; 
  const day = parseInt(endDateParts[2]);

  let endDateObject = new Date(year, month, day);
  endDateObject.setDate(endDateObject.getDate() + 1);
  const endDateAdjusted = endDateObject.toISOString().split('T')[0];

  Collab.fetchEmails(request.session.email).then(data => {
  const [rowsE, fieldDataE] = data;
    const evento = new Event(startDate, endDate, motive, type);
    // console.log(rowsE);
    evento.save();
    
    return Event.insertEvents(startDate, endDateAdjusted, motive, request.user.accessToken, rowsE);
  }).catch(error => {
    console.error(error);
  })
  response.redirect('/');
}

exports.get_metric = async (request, response) => {
  // console.log("get_metric called with:", request.body.valor);
  let val = request.body.valor;
  let counter;
  // console.log('lol');

  if (val == 1){
    counter = await Requests.metricMonth();
  } else if (val == 2){
    counter = await Requests.metricTrimester();
  } else if(val == 3){
    counter = await Requests.metricSemester();
  } else {
    counter = await Requests.metricAnually();
  }

  // console.log("counter: ", counter);
  // console.log("Val:", val);
  response.json({
    permissions: request.session.permissions,
    counter,
    val,
  });
}

exports.get_hiring = async (request, response) => {
  // console.log("get_hiring called with:", request.body.hiring_rate);
  let value = request.body.hiring_rate;
  let counter;
  // console.log('lol');

  if (value == 1){
    counter = await Requests.hRateM();
  } else if (value == 2){
    counter = await Requests.hRateT();
  } else if(value == 3){
    counter = await Requests.hRateS();
  } else {
    counter = await Requests.hRateY();
  }

  response.json({
    permissions: request.session.permissions,
    counter,
    value,
  });
}
