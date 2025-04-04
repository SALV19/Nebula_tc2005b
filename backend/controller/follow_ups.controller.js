const Collaborator = require('../models/collabs.model');
const RegisterFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');
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
    })
    .catch(error => {
      response.status(500).send("Error al obtener información");
    });
};

