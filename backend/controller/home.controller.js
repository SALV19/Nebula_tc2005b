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

exports.get_events_calendar = async (request, response) => {
  const { start, end } = request.body;
  console.log("Entro aqui al events");

  if (!request.user?.accessToken) {
    return response.status(401).json({ error: 'No autorizado' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/log_in/success'
    );
    oauth2Client.setCredentials({
      access_token: request.user.accessToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const { data } = await calendar.calendarList.list();
    const calendars = data.items;

    let eventos = [];

    for (const cal of calendars) {
      const calendarId = cal.id;

      const eventsResponse = await calendar.events.list({
        calendarId,
        timeMin: new Date(start).toISOString(),
        timeMax: new Date(end).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const eventosDelCalendario = eventsResponse.data.items.map(event => ({
        id: event.id,
        calendarId: calendarId, 
        title: event.summary,
        start: event.start.dateTime || event.start.date,
        end: event.end?.dateTime || event.end?.date,
        backgroundColor: cal.backgroundColor,
        borderColor: cal.backgroundColor,
        display: 'block',
        color: '#FFFF',
        description: event.description,
      }));

      eventos = eventos.concat(eventosDelCalendario);
    }

    response.json(eventos);
  } catch (error) {

    console.error("Error al obtener eventos:", error);
    response.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.get_home = async (request, response) => {
  const absences = await Requests.fetchDaysApproved(request.session.email)
  .then(data => data[0])
  .catch(e => {
    console.error("Error fetching approved absences:", e);
    return [];
  });

  const google_outh = request.user?.accessToken || null;

  contVac(request)
    .then(({diasDisponibles,diasTotales, error}) => {
      response.render("home_page", {
        diasDisponibles,
        diasTotales,
        error,
        permissions_error: request.session.permissions.length,
        permissions: request.session.permissions,
        total_absences: absences.length,
        csrfToken: request.csrfToken(),
        google_outh,
        calendarMeeting: process.env.CALENDAR_ID_MEETING, 
        calendarEvent: process.env.CALENDAR_ID_EVENT,
      })
    })
    .catch(error => {console.error(error)}) 
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
    return Event.insertEvents(startDate, endDateAdjusted, motive, request.user.accessToken, rowsE, type);
  }).catch(error => {
    console.error(error);
  })
  response.redirect('/');
}

exports.delete_event = async (request, response) => {
  try {
    const { eventId, calendarId } = request.body;
    const result = await Event.deleteEvent(eventId, calendarId, request.user.accessToken);

    response.json({
      success: true,
      message: `Evento eliminado correctamente.`,
      result,
    })
  } catch (error) {
    console.error("Error al eliminar evento:", error);

    response.status(500).json({ // Cambiar el status a 500 para indicar un error del servidor
      success: false,
      error: error.message || 'Error al eliminar el evento en el servidor.', // Enviar el mensaje del error
    });
  }
}
exports.get_metric = async (request, response) => {
  // console.log("get_metric called with:", request.body.periodo);
  let periodo = request.body.periodo;
  let counter;
  // console.log('lol');

  if (periodo == 1){
    counter = await Requests.metric_month();
  } else if (periodo == 2){
    counter = await Requests.metric_trimester();
  } else if(periodo == 3){
    counter = await Requests.metric_semester();
  } else {
    counter = await Requests.metric_anually();
  }

  // console.log("counter: ", counter);
  // console.log("Val:", periodo);
  response.json({
    permissions: request.session.permissions,
    percentage : counter,
    periodo,
  });
}

exports.get_hiring = async (request, response) => {
  // console.log("get_hiring called with:", request.body.hiring_rate);
  let hiring_counter = request.body.hiring_rate;
  let counter;
  // console.log('lol');

  if (hiring_counter == 1){
    counter = await Requests.h_Rate_M();
  } else if (hiring_counter == 2){
    counter = await Requests.h_rate_T();
  } else if(hiring_counter == 3){
    counter = await Requests.h_Rate_S();
  } else {
    counter = await Requests.h_Rate_Y();
  }

  response.json({
    permissions: request.session.permissions,
    counter,
    hiring_counter,
  });
}
