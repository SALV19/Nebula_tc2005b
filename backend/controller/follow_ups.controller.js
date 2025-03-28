const Collab = require('../models/collabs.model');
const QuestionsFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');
const {contVac} = require("../util/contVacations")

let settings = {
  selectedOption: 'active',
};

exports.get_FollowUp = (request, response) => {
  response.render("followUp", {
    ...settings,
    permissions: request.session.permissions,
    csrfToken : request.csrfToken(),
  })
} 

exports.get_register = async (request, response) => {
    const [collabsData, questionsData, indicatorsData, lastEvalutation] = await Promise.all([
      Collab.fetchAllCompleteName(),
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
    res.status(500).send("Error al guardar la evaluación");
  };
}

exports.get_follow_ups = (request, response) => {
    contVac(request)
    .then(({diasDisponibles,diasTotales}) => {
        response.render("home_page", {diasDisponibles,diasTotales})
    })
    .catch(error => {console.error(error)})
  };
  
