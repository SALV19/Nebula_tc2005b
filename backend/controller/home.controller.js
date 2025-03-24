const Requests = require("../models/home.model");

exports.get_home = async (request, response) => {
  const absences = await Requests.fetchDaysApproved(request.session.email)
    .then(data => data[0])
    .catch(e => {
      console.error("Error fetching approved absences:", e);
      return [];
    });

  //console.log("Absences fetched for", request.session.email, ":", absences);

  response.render("home_page", {
    total_absences: absences.length,
    csrfToken: request.csrfToken(),
  });
};
