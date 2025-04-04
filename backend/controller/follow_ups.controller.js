const Collab = require('../models/collabs.model');
const QuestionsFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');
const Meeting = require('../models/meeting.model');
const { response } = require('express');
const {google} = require('googleapis');

let settings = {
  selectedOption: 'active',
};

exports.get_requests = async (request, response) => {
  try {
    // Ejecuta ambas consultas en paralelo y espera sus resultados
    const [collabsData, questionsData, indicatorsData, lastEvalutation] = await Promise.all([
      Collab.fetchAllCompleteName(),
      QuestionsFollow.fetchAllQuestions(),
      Indicator.fetchAllindicators(),
    ]);

    const [rows, fieldData] = collabsData;
    const [rows_ques, fieldData_ques] = questionsData;
    const [rows_indi, fieldData_indi] = indicatorsData;


    response.render("followUp", {
      ...settings,
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      colaboradores: rows,
      questions: rows_ques,
      indicator: rows_indi,
    });

  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
};

exports.post_follow_ups = async (req, res) => {
  try {
    const evaluation = new QuestionsFollow(req.body.id_colaborador, req.body.fechaAgendada);

    // Ahora podemos acceder al ID generado
    const id_evaluation = await evaluation.save(); // Esperamos el resultado de la promesa
    console.log(id_evaluation);

    // Crear y guardar respuestas
    const answer_questions = new Questions(req.body.id_pregunta, id_evaluation, req.body.respuesta);
    await answer_questions.save(); 

    const metrics_answer = new Indicators_metrics(id_evaluation, req.body.id_indicador, req.body.valor_metrica);
    await metrics_answer.save();
    console.log(metrics_answer);

    // Redirigir después de completar las operaciones
    res.redirect('/follow_ups');
  } catch (error) {
    console.error(error);
  };
}

exports.get_meeting = (request, response, next) => {
  const googleLogin = request.user ? 1 : 0;
  Collab.fetchAllCompleteName()
    .then(collabs => {
      const [rows, fieldData] = collabs;

      if(googleLogin == 1) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'http://localhost:3000/log_in/success'
        );
        
        oauth2Client.setCredentials({
          access_token: request.user.accessToken
        });
        
        return listEvents(oauth2Client)
          .then(events => {
            // if (events && events.length > 0) {
            //   events.forEach((event, i) => {
            //     const start = event.start.dateTime || event.start.date;
            //     console.log(`${start} - ${event.summary}`);
            //   });
            // }
            
            response.render('meetings_follow_up', {
              permissions: request.session.permissions,
              selectedOption: 'meetings',
              colaboradores: rows, 
              googleLogin: googleLogin,
              events: events, 
              csrfToken: request.csrfToken()
            });
          });
      } else {
        response.render('meetings_follow_up', {
          permissions: request.session.permissions,
          selectedOption: 'meetings',
          colaboradores: rows, 
          googleLogin: googleLogin,
          events: [],
          csrfToken: request.csrfToken()
        });
      }
    })
    .catch(error => {
      console.error('Error loading meetings page:', error);
      response.redirect('/dashboard');
    });
}

exports.post_meeting = (request, response, next) => {
  console.log(request.body);

  const id_colaborador = request.body.id_colaborador;
  const fecha = request.body.fechaAgendada;
  const startTime = request.body.startTime;
  const endTime = request.body.endTime;
  const emailCollab =  Collab.fetchEmail(id_colaborador);
  const repeating = request.body.repeating;
  const summary = "Follow up Nebula";
  let occurrences = 0;
  

  if(repeating == 'day') {
    occurrences = request.body.dayOccurrences;
  }
  if(repeating == 'week') {
    occurrences = request.body.weekOccurrences;
  }
  if(repeating == 'month') {
    occurrences = request.body.monthOccurrences;
  }
  if(repeating == 'year') {
    occurrences = request.body.yearOccurrences;
  }

  Collab.fetchEmail(id_colaborador)
    .then(emailCollab => {
      const startFechaHora = new Date(`${fecha}T${startTime}:00`);
      const startTimeRFC = startFechaHora.toISOString();

      const endFechaHora = new Date(`${fecha}T${endTime}:00`);
      const endTimeRFC = endFechaHora.toISOString();

      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:3000/log_in/success'
      );
      
      oauth2Client.setCredentials({
        access_token: request.user.accessToken
      });
      
      return verificarAccesoCalendario(oauth2Client)
        .then(tieneAcceso => {
          
          if (!tieneAcceso) {
            throw new Error("No se tiene acceso al calendario");
          }

          return Meeting.insertEvents(
            request.user.accessToken,
            fecha,
            startTimeRFC,
            endTimeRFC,
            emailCollab, 
            repeating,
            occurrences,
            summary,
          );
        });
  })
    .then(() => {
        response.redirect('/follow_ups');
    })
    .catch(error => {
        console.error("Error al crear la reunión:", error);
        response.status(500).send("Error al crear la reunión: " + error.message);
  });
}

function verificarAccesoCalendario(auth, calendarId = 'primary') {
  const calendar = google.calendar({ version: 'v3', auth });
  
  return calendar.calendarList.list()
      .then(response => {
          const calendarList = response.data;
          
          console.log(`El usuario tiene acceso a ${calendarList.items.length} calendarios:`);
          calendarList.items.forEach(cal => {
              console.log(`- ${cal.summary} (${cal.id})`);
          });
          
          const calendarExiste = calendarList.items.some(cal => cal.id === calendarId);
          
          if (calendarExiste) {
              return true;
          } else if (calendarId === 'primary') {
              return true;
          } else {
              console.log(`El usuario NO tiene acceso al calendario: ${calendarId}`);
              return false;
          }
      })
      .catch(error => {
          console.error("Error al verificar acceso al calendario:", error);
          return false;
      });
}

async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'c_03768ccf82eda9630ea10180b3249084dda11ae3e62a2e67092ca0889e25ca56@group.calendar.google.com',
    timeMin: new Date().toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return []; 
  }
  return events;
}