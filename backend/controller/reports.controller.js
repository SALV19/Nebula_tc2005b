const Colaborador = require("../models/collabs.model");

exports.get_reports = async (request, response) => {

  const collabs = await Colaborador.fetchAllCompleteName()
    response.render("reports",{
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
    });

  };
  