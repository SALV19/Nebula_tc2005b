const Colaborador = require("../models/collabs.model");
const Departamento = require("../models/departamento.model");
const Empresa = require("../models/empresa.model");
const Reports = require("../models/reports.model");


exports.get_reports = async(request, response) => {

  const [collabs] = await Colaborador.fetchAllCompleteName()

  const [empresa] = await Empresa.fetchAllEmp()
  
  const departamentosNested = await Promise.all(
    empresa.map(async (e) => {
      return await Departamento.fetch(e.id_empresa);
    })
  );
  
  const departamento = departamentosNested;

  // console.log("DP: ", departamentosNested)
    response.render("reports",{
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      collabs,
      departamento,
      empresa,
    });
  };

exports.get_general_report = async (request, response) => {
  

  const [rows, fieldData] = await Empresa.fetchAllEmp();
  const empresas = rows.map(r => r.nombre_empresa)

  const [empresas_validaciones] = Reports.fetchCompany(empresas, '2025-01-01', '2025-05-01')
  console.log(empresas_validaciones)

  response.send(empresas_validaciones)
}

