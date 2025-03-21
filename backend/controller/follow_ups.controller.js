const Collab = require('../models/collabs.model');
const QuestionsFollow = require('../models/followUp.model');
const Indicator = require('../models/indicators.model');

let settings = {
  selectedOption: 'active',
};

exports.get_requests = async (request, response) => {
  try {
    // Ejecuta ambas consultas en paralelo y espera sus resultados
    const [collabsData, questionsData, indicatorsData] = await Promise.all([
      Collab.fetchAllCompleteName(),
      QuestionsFollow.fetchAllQuestions(),
      Indicator.fetchAllindicators(),
    ]);

    // Extrae las filas de cada consulta
    const [rows, fieldData] = collabsData;
    const [rows_ques, fieldData_ques] = questionsData;
    const [rows_indi, fieldData_indi] = indicatorsData;

    // console.log("Datos de la tabla de colaboradores:", fieldData);
    console.log("Colaboradores:", rows);
    // console.log("Datos de la tabla de preguntas:", fieldData_ques);
    console.log("Preguntas:", rows_ques);
    console.log("indicadores:", rows_indi);


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

exports.post_follow_ups = (req, res) => {
  console.log(req.body);

  const collabID = req.body["selected-collab"];
  const date = req.body["date-selected"];

  const answers = Object.keys(req.body).filter(key => key.startsWith("answer-questions-")).map(key => ({
    preguntaId: key.replace("answer-questions-", ""),
    respuesta: req.body[key]
  }));

  const indicadores = Object.keys(req.body).filter(key => key.startsWith("value-radar-")).map(key => ({
      indicadorId: key.replace("value-radar-", ""),
      valor: req.body[key]
  }));

  console.log("Colaborador:", colaboradorId);
  console.log("Fecha:", fecha);
  console.log("Respuestas:", respuestas);
  console.log("Indicadores:", indicadores);


}