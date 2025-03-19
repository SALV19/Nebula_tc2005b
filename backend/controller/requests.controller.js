const Collab = require('../models/collabs.model')
const QuestionsFollow = require('../models/follow_ups_questions.models')

exports.get_requests = (request, response) => {
  Collab.fetchAll()
  .then(([rows, fieldData]) => {
    console.log("Datos de la tabla:", fieldData);
    console.log("Colaboradores:", rows);
    response.render('approve_requests', {colaboradores: rows});
  })
  .catch((error) => {
    console.log(error);
    response.status(500).send("Error al obtener colaboradores");
  })
};
