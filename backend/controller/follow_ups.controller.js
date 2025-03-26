const Collaborator = require('../models/collabs.model');
const QuestionsFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');

let settings = {
  selectedOption: 'active',
};

exports.get_requests = async (request, response) => {
  try {
    // Ejecuta ambas consultas en paralelo y espera sus resultados
    const [collabsData, questionsData, indicatorsData, lastEvalutation] = await Promise.all([
      Collaborator.fetchAllCompleteName(),
      QuestionsFollow.fetchAllQuestions(),
      Indicator.fetchAllindicators(),
    ]);

    const [rows, fieldData] = collabsData;
    const [rows_ques, fieldData_ques] = questionsData;
    const [rows_indi, fieldData_indi] = indicatorsData;


    response.render("register_followUp", {
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

exports.get_infoFollowUps