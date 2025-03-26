const Collab = require('../models/collabs.model');
const QuestionsFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');
const Meeting = require('../models/meeting.model');
const { response } = require('express');

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
  Collab.fetchAllCompleteName()
    .then(collabs => {
      const [rows, fieldData] = collabs;
      response.render('meetings_follow_up', {
        permissions: request.session.permissions,
        selectedOption: 'meetings',
        colaboradores: rows, 
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
  
  // const fechaHora = new Date

  const meeting = new Meeting(request.body.id_colaborador, request.body.fechaAgendada, request.body.horaAgendada, request.user.accessToken);

  console.log("meeting", meeting);

  console.log("AccessToken de google ",request.user.accessToken);
  
  
  response.redirect('/follow_ups');
}
