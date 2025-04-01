const Collaborator = require('../models/collabs.model');
const QuestionsFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');
const Evaluation = require('../models/periodic_eval.model');
const Answers = require('../models/questions_answers.model');

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
    const [collabsData, questionsData, indicatorsData, lastEvalutation] = await Promise.all([
      Collaborator.fetchAllCompleteName(),
      QuestionsFollow.fetchAllQuestions(),
      Indicator.fetchAllindicators(),
    ]);

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

exports.post_follow_ups = async (req, res) => {
  try {
    console.log('Body colab: ', req.body.id_colaborador);
    console.log('Body date: ', req.body.fechaAgendada);
    console.log('Body pregunta: ', req.body.id_pregunta);
    console.log('Body respuesta: ', req.body.respuesta);    
    console.log('Body pregunta: ', req.body.id_indicador);
    console.log('Body pregunta: ', req.body.valor_metrica);


    // Crear la evaluación y esperar su guardado
    const evaluation = new QuestionsFollow(req.body.id_colaborador, req.body.fechaAgendada);

    // Ahora podemos acceder al ID generado
    const id_evaluation = await evaluation.save(); // Esperamos el resultado de la promesa

    // Crear y guardar respuestas

    const answer_questions = new Questions(req.body.id_pregunta, id_evaluation, req.body.respuesta);
    await answer_questions.save(); 

    const metrics_answer = new Indicators_metrics(id_evaluation, req.body.id_indicador, req.body.valor_metrica);
    await metrics_answer.save();
    

    // Redirigir después de completar las operaciones
    res.redirect('/follow_ups');
  } catch (error) {
    console.error(error);
    return res.status(400).render("register_follow_up_logic.ejs", {
      error: "There was a problem saving the evaluation",
      // validation : true,
      csrfToken : req.csrfToken,
    });
  };
}

exports.get_followUps_info = (request, response, next) => {
  
  settings.selectedOption = 'Collaborators';

  const idColaborador = request.session.id_colaborador;

  Evaluation.fetchAllInfo([idColaborador])
    .then(([evalInfo]) => {
      const id_evaluacion = evalInfo.map(id => id.id_evaluacion);
      const fechasAgendadas = evalInfo.map(evaluacion => {
        const fecha = new Date(evaluacion.fechaAgendada);
        const year = fecha.getFullYear().toString().slice(2); 
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        return {
          id_evaluacion: evaluacion.id_evaluacion, 
          fechaAgendada: `${year}-${month}-${day}` 
        };
      });
      // console.log("Fechas formateadas: ", fechasAgendadas);

      return Promise.all([
        Evaluation.fetchAllQuestions(),
        Indicators_metrics.fetchAll(id_evaluacion),
        Indicator.fetchAllindicators()
      ]).then(async ([questions, metrics, indicators]) => {
        const pregunta = questions;
        const metricas = metrics;
        const indicadores = indicators;

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
      .catch(
        response.status(501).json({
          selectedOption: 'Collaborators',
          fechasAgendadas: null,
          pregunta: null,
          respuestas: null,  
          indicadores: null,
          metricas: null,
        }));
    })
    .catch(error => {
      response.status(500).send("Error al obtener información");
    });
};

