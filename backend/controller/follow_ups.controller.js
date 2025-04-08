const Collaborator = require('../models/collabs.model');
const RegisterFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');
const Meeting = require('../models/meeting.model');
const { response } = require('express');
const {google} = require('googleapis');
const sendWhatsapp = require('../util/sendWhatsapp'); // ajusta la ruta si es necesario
const Evaluation = require('../models/periodic_eval.model');
const Answers = require('../models/questions_answers.model');
const Eval_Questions = require('../models/eval_questions.model');



let settings = {
  selectedOption: 'collab',
};

exports.get_FollowUp = (request, response) => {
  response.render("followUp", {
    selectedOption: 'collab',
    permissions: request.session.permissions,
    csrfToken : request.csrfToken(),
  })
}

exports.get_register = async (request, response) => {
  
    const collabsData =  await Collaborator.fetchAllCompleteName();
    const questionsData = await Eval_Questions.fetchAllQuestions();
    const indicatorsData = await Indicator.fetchAllindicators();

    const [rows, fieldData] = collabsData;
    const [rows_ques, fieldData_ques] = questionsData;
    const [rows_indi, fieldData_indi] = indicatorsData;

    response.json({
      ...settings,
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      colaboradores: rows,
      questions: rows_ques,
      indicator: rows_indi,
    });
};

exports.post_follow_ups = (req, res) => {
  // Crear la evaluación y guardarla
  const evaluation = new RegisterFollow(req.body.id_colaborador, req.body.fechaAgendada);

  evaluation.save()
    .then((id_evaluation) => {
      // Guardar respuestas una vez que tenemos el ID de la evaluación
      const answer_questions = new Questions(req.body.id_pregunta, id_evaluation, req.body.respuesta);
      return answer_questions.save().then(() => id_evaluation); // Pasamos el id_evaluation adelante
    })
    .then((id_evaluation) => {
      // Guardar métricas con el mismo ID
      const metrics_answer = new Indicators_metrics(id_evaluation, req.body.id_indicador, req.body.valor_metrica);
      return metrics_answer.save();
    })
    .then(() => {
      // Redirigir solo cuando todo esté guardado
      res.redirect('/follow_ups');
    })
    .catch((error) => {
      console.error(error);
      res.status(400).render("register_follow_up_logic.ejs", {
        error: "There was a problem saving the evaluation",
        csrfToken: req.csrfToken(),
      });
    });
};

exports.get_meeting = (request, response, next) => {  
  settings.selectedOption = 'Meetings';
  const googleLogin = request.user?.accessToken ? 1 : 0;

  const validationErrors = request.session.validationErrors || {};
  const formData = request.session.formData || {};
  const errorMessage = request.session.errorMessage || null;
  const successMessage = request.session.successMessage || null;

  delete request.session.validationErrors;
  delete request.session.formData;
  delete request.session.errorMessage;
  delete request.session.successMessage;

  Collaborator.fetchAllCompleteName()
    .then(collabs => {
      const [rows, fieldData] = collabs;

      response.locals.errors = validationErrors;
      response.locals.formData = formData;
      response.locals.errorMessage = errorMessage;
      response.locals.successMessage = successMessage;
      
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
};

exports.post_meeting = (request, response, next) => {
  console.log(request.body);

  let validationErrors = {};
  let hasErrors = false;
  
  // Validate required fields
  if (!request.body.id_colaborador || request.body.id_colaborador === 'default') {
    validationErrors.collaborator = 'Please select a collaborator';
    hasErrors = true;
  }

  if (!request.body.fechaAgendada) {
    validationErrors.date = 'Please select a date';
    hasErrors = true;
  } else {
    const today = new Date();
                    
    const todayFormatted = today.toISOString().split('T')[0];

    
    if (request.body.fechaAgendada < todayFormatted) {
      validationErrors.date = 'Please select today or a future date';
      hasErrors = true;
    }
  }
  
  if (!request.body.startTime) {
    validationErrors.startTime = 'Please select a start time';
    hasErrors = true;
  }
  
  if (!request.body.endTime) {
    validationErrors.endTime = 'Please select an end time';
    hasErrors = true;
  } else if (request.body.startTime && request.body.startTime >= request.body.endTime) {
    validationErrors.endTime = 'End time must be after start time';
    hasErrors = true;
  }

  const repeating = request.body.repeating;
  if (repeating && repeating !== 'no') {
    const occurrencesField = `${repeating}Occurrences`;
    const occurrences = request.body[occurrencesField];
    
    if (!occurrences || isNaN(occurrences) || occurrences < 1) {
      validationErrors[occurrencesField] = 'Please enter a valid number of occurrences';
      hasErrors = true;
    }
  }
  
  
  if (hasErrors) {
    console.error('Validation errors:', validationErrors);
    
    request.session.validationErrors = validationErrors;
    request.session.formData = request.body;
    request.session.errorMessage = "The form couldn't be submitted. Please check the highlighted fields.";
    
    
    return response.redirect('/follow_ups');
  }

  const id_colaborador = request.body.id_colaborador;
  const fecha = request.body.fechaAgendada;
  const startTime = request.body.startTime;
  const endTime = request.body.endTime;
  const summary = "Follow up Nebula";
  let occurrences = 0;
  console.log("id_colaborador: ", id_colaborador)
  

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

  Collaborator.fetchEmail(id_colaborador)
    .then(emailCollab => {
      const [rowsE, fieldData] = emailCollab;
      console.log(rowsE);
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
            rowsE, 
            repeating,
            occurrences,
            summary,
          );
        });
  })
    .then(() => {
      Collaborator.fetchBasicInfoNoti(id_colaborador)
        .then(async ([collabData]) => {
          const { nombre, telefono } = collabData[0];

          const [year, month, dayNum] = fecha.split("-");
          const formattedDate = `${dayNum.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
          const formattedTime = `${startTime} - ${endTime}`;

          if (telefono) {
            await sendWhatsapp.sendMeetingNotification(nombre, summary, formattedDate, formattedTime, telefono);
          }
          response.redirect('/follow_ups');
        })
        .catch(err => {
          console.error("Error enviando notificación de reunión:", err);
          response.redirect('/follow_ups');
        });
        
        
    })
    .catch(error => {
        console.error("Error al crear la reunión:", error);
        
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

exports.get_meeting_events = (request, response) => {
  console.log("Solicitando eventos de calendario");
  const googleLogin = request.user?.accessToken ? 1 : 0;
  let eventos = [];

  if (googleLogin == 1) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID, 
      process.env.GOOGLE_CLIENT_SECRET, 
      'http://localhost:3000/log_in/success'
    );
    
    oauth2Client.setCredentials({
      access_token: request.user.accessToken
    });

    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    
    calendar.calendarList.list()
      .then(calendarListResponse => {
        const calendars = calendarListResponse.data.items;
        console.log("Calendarios encontrados:", calendars.length);
        
        const eventPromises = calendars.map(cal => {
          const calendarId = cal.id;
          
          return calendar.events.list({
            calendarId,
            singleEvents: true,
            orderBy: 'startTime'
          })
          .then(eventsResponse => {
            const eventosDelCalendario = eventsResponse.data.items.map(event => {
              return {
                id: event.id,
                title: event.summary || 'No Title',
                start: event.start?.dateTime || event.start?.date,
                end: event.end?.dateTime || event.end?.date,
                backgroundColor: cal.backgroundColor || '#4285F4',
                borderColor: cal.backgroundColor || '#4285F4',
                description: event.description,
                display: 'block',
              };
            });
            
            return eventosDelCalendario;
          })
          .catch(error => {
            console.error(`Error al obtener eventos del calendario ${calendarId}:`, error);
            return [];
          });
        });

        return Promise.all(eventPromises);
      })
      .then(eventArrays => {
        eventos = eventArrays.flat();
        console.log("Total eventos obtenidos:", eventos.length);
        
        response.json(eventos);
      })
      .catch(error => {
        console.error("Error al acceder a Google Calendar:", error);
        response.json([]);
      });
  } else {
    response.json([]);
  }
};


exports.get_followUps_info = (request, response, next) => {
  
  settings.selectedOption = 'Collaborators';

  const idColaborador = request.session.id_colaborador;

  console.log("entro a get follow ups info");

  Evaluation.fetchAllInfo([idColaborador])
    .then(([evalInfo]) => {

      console.log("entro al primer then");
      const id_evaluacion = evalInfo.map(id => id.id_evaluacion);
      const notes = evalInfo.map(n => n.notas)      
      const fechasAgendadas = evalInfo.map(evaluacion => {
        const fecha = new Date(evaluacion.fechaAgendada);
        const year = fecha.getFullYear().toString().slice(2); 
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        return {
          id_evaluacion: evaluacion.id_evaluacion, 
          fechaAgendada: `${year}-${month}-${day}`,
          notes: notes
        };
      });

      return Promise.all([
        Evaluation.fetchAllQuestions(),
        Indicators_metrics.fetchAll(id_evaluacion),
        Indicator.fetchAllindicators()
      ]).then(async ([questions, metrics, indicators]) => {
        const pregunta = questions;
        const metricas = metrics;
        const indicadores = indicators;

        console.log("entro al segundo then");

        const id_pregunta = questions[0].map(q => q.id_pregunta);

        const respuestas = await Answers.fetchAnswers(id_pregunta, id_evaluacion);
        response.json({
          selectedOption: 'Collaborators',
          fechasAgendadas,
          pregunta,
          respuestas,  
          indicadores,
          metricas
        });
      })
    })
    .catch(error => {
      response.status(500).send("Error al obtener información");
    });
};

exports.create_note = async (request, response) => {
  const {content, id} = request.body
  const eval_note = Evaluation.createNote(id, content)

  const {success, error} = await eval_note.save_note()
                                    .then(ok => {return {success: ok, error: null}})
                                    .catch(error => {return {success: null, error: error}})
  if (success) {    
    response.json({
      success,
      message: "Success"
    })
    return 
  }
  else {
    response.status(500).json({
      error,
      message: "Error"
    })
  }



}