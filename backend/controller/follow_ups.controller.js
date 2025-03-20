const Collab = require('../models/collabs.model');
const QuestionsFollow = require('../models/follow_ups_questions.model');
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
