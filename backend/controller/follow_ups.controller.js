exports.get_follow_ups = (request, response) => {
  response.render("home_page", {
    total_absences: absences.length,
    csrfToken: request.csrfToken(),
  });
};
