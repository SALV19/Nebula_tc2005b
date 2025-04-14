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
  //console.log(request.body)
  const [rows, fieldData] = await Empresa.fetchAllEmp();
  const empresas = rows.map(r => r.nombre_empresa)

  let [empresas_validaciones, _] = await Reports.fetchCompany(empresas, '2025-01-01', '2025-05-01')
  
  empresas_validaciones = empresas_validaciones.reduce((a, v) => {
    console.log(v)
    return {...a, [v.nombre_empresa]: {...a[v.nombre_empresa], [v.indicador]: v.average}}
  }, {})
  console.log(empresas_validaciones);


  response.status(200).json(empresas_validaciones)
}

