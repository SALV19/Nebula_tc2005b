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
  console.log(req.body);
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
  console.log("entro a get_meeting");
  const googleLogin = request.user ? 1 : 0;
  Collab.fetchAllCompleteName()
    .then(collabs => {
      const [rows, fieldData] = collabs;
      response.render('meetings_follow_up', {
        permissions: request.session.permissions,
        selectedOption: 'meetings',
        colaboradores: rows, 
        googleLogin: googleLogin,
        csrfToken: request.csrfToken()
      });
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
  const hora = request.body.horaAgendada;
  const emailCollab =  Collab.fetchEmail(id_colaborador);
  const repeating = request.body.repeating;
  const occurrences = request.body.occurrences;

  console.log("occurrences");
  console.log(occurrences);

  Collab.fetchEmail(id_colaborador)
    .then(emailCollab => {
      console.log("Imprimiendo emailCollab")
      console.log(emailCollab);
      const fechaHora = new Date(`${fecha}T${hora}:00`);
      const startTimeRFC = fechaHora.toISOString();
      const endTimeRFC = new Date(fechaHora.getTime() + 30 * 60 * 1000).toISOString();

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
          console.log("Tiene acceso al calendario:", tieneAcceso);
          
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
          );
        });
  })
    .then(() => {
        console.log("Evento creado exitosamente");
        response.redirect('/follow_ups');
    })
    .catch(error => {
        console.error("Error al crear la reunión:", error);
        response.status(500).send("Error al crear la reunión: " + error.message);
  });
}

function verificarAccesoCalendario(auth, calendarId = 'primary') {
  const calendar = google.calendar({ version: 'v3', auth });
  
  console.log("Listando calendarios disponibles...");
  return calendar.calendarList.list()
      .then(response => {
          const calendarList = response.data;
          
          console.log(`El usuario tiene acceso a ${calendarList.items.length} calendarios:`);
          calendarList.items.forEach(cal => {
              console.log(`- ${cal.summary} (${cal.id})`);
          });
          
          const calendarExiste = calendarList.items.some(cal => cal.id === calendarId);
          
          if (calendarExiste) {
              console.log(`El usuario tiene acceso al calendario: ${calendarId}`);
              return true;
          } else if (calendarId === 'primary') {
              console.log("Usando el calendario principal del usuario");
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