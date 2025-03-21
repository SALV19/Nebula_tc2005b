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

function weekendsOff(startDate, endDate) {
  let start = new Date(startDate);
  const end = new Date(endDate);
  let days = [];

  while (start <= end) {
      let day = start.getDay(); // 0 = Domingo, 6 = Sábado
      if (day !== 0 && day !== 6) {
          days.push(day)
      }
      start.setDate(start.getDate() + 1); // Siguiente día
  }

  return days
}

exports.post_abscence_requests = async (request, response, next) => {
  console.log(request.body)
  console.log('requestType', request.body.requestType)
  console.log('startDate', request.body.startDate)
  console.log('endDate', request.body.endDate)
  console.log('location', request.body.location)
  console.log('description', request.body.description)
  console.log('evidence', request.body.evidence)

  const dates = weekendsOff(request.body.start, request.body.end)
  const request_register = new Requests(request.session.email, request.body.requestType, dates, request.body.location, request.body.description, request.body.evidence)
  await request_register.save().then(e => console.log("Success")).catch(e => console.log(e))

  response.send("hwrogjrfpjwes")
}