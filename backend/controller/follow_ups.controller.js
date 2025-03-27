const Collab = require('../models/collabs.model');
const QuestionsFollow = require('../models/periodic_eval.model');
const Indicator = require('../models/indicators.model');
const Questions = require('../models/questions_answers.model');
const Indicators_metrics = require('../models/metric_indicators.model');

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
  console.log("Hola")
  
    const [collabsData, questionsData, indicatorsData, lastEvalutation] = await Promise.all([
      Collab.fetchAllCompleteName(),
      QuestionsFollow.fetchAllQuestions(),
      Indicator.fetchAllindicators(),
    ]);

    const [rows, fieldData] = collabsData;
    const [rows_ques, fieldData_ques] = questionsData;
    const [rows_indi, fieldData_indi] = indicatorsData;

    console.log(rows);
    console.log(rows_ques);
    console.log(rows_indi);

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
  console.log(req.body);
  console.log("entro al post");
  try {
    console.log("Entro al try");
    // Crear la evaluación y esperar su guardado
    console.log(req.body.id_colaborador);
    const evaluation = new QuestionsFollow(req.body.id_colaborador, req.body.fechaAgendada);
    console.log("Eval: ", evaluation);

    // Ahora podemos acceder al ID generado
    const id_evaluation = await evaluation.save(); // Esperamos el resultado de la promesa
    console.log("id:", id_evaluation);

    // Crear y guardar respuestas
    const answer_questions = new Questions(req.body.id_pregunta, id_evaluation, req.body.respuesta);
    console.log("Answer: ", answer_questions);
    await answer_questions.save(); 

    const metrics_answer = new Indicators_metrics(id_evaluation, req.body.id_indicador, req.body.valor_metrica);
    console.log("Metrica", metrics_answer);
    await metrics_answer.save();
    

    // Redirigir después de completar las operaciones
    res.redirect('/follow_ups');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al guardar la evaluación");
  };
}
