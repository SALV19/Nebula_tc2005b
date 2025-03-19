const Collab = require('../models/collabs.model')
const QuestionsFollow = require('../models/follow_ups_questions.models')
const Requests = require('../models/requests.model')

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

let settings = {
  selectedOption: 'vacations',
}

exports.get_requests = (request, response) => {
  response.render("requests_page", {
    ...settings,
    permissions: request.session.permissions,
    csrfToken: request.csrfToken(),
  });
};

exports.get_collabs_requests = async (request, response) => {  
  settings.selectedOption = 'requests'
  const offset = request.body.offset * 10;
  const filter = request.body.filter;
  const requests = await Requests.fetchRequests(request.session.email, offset, filter)
    .then(data =>  data)
    .catch(e => console.log(e))
  // console.log(requests)
  response.json({
    selectedOption: 'requests',
    requests: requests,
  });
}

exports.get_vacations = (request, response) => {  
  settings.selectedOption = 'vacations'
  response.json({
    selectedOption: settings.selectedOption,
  });
}
exports.get_abscences = (request, response) => {  
  settings.selectedOption = 'vacations'
  
  response.json({
    selectedOption: settings.selectedOption,
  });
}
