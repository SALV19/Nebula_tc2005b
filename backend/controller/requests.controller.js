const Requests = require('../models/requests.model')

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