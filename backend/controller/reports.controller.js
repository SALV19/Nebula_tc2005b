const Colaborador = require("../models/collabs.model");
const Departamento = require("../models/departamento.model");
const Empresa = require("../models/empresa.model");

exports.get_reports = async(request, response) => {

  const [collabs] = await Colaborador.fetchAllCompleteName()

  const [empresa] = await Empresa.fetchAllE(id_empresa)
  
  const departamentosNested = await Promise.all(
    empresa.map(async (e) => {
      return await Departamento.fetch(e.id_empresa);
    })
  );
  
  const departamento = departamentosNested;

  console.log("DP: ", departamentosNested)
    response.render("reports",{
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      collabs,
      departamento,
      empresa,
    });
  };
