const Colaborador = require("../models/collabs.model");
const Departamento = require("../models/departamento.model");
const Empresa = require("../models/empresa.model");
const Reports = require("../models/reports.model");


exports.get_reports = async(request, response) => {

  const [collabs] = await Colaborador.fetchAllCompleteName()

  const [empresa] = await Empresa.fetchAllEmp()
  
  const departamento = await Promise.all(
    empresa.map(async (e) => {
      return await Departamento.fetch(e.id_empresa);
    })
  ); 

  let departamentos_empresas = departamento.map((d) => {
    return d[0].reduce((acc, val) => {
      if (!Object.keys(acc).length) {
        acc = {[val.nombre_empresa]: [val.nombre_departamento]}
      }
      else {
        acc = {[val.nombre_empresa]: [...acc[val.nombre_empresa], val.nombre_departamento]}
      }
      return acc
    }, {})
  })

  const depa = departamentos_empresas.reduce((a, v) => {
    if (!a[Object.keys(v)[0]]) {
      return {...a, [Object.keys(v)[0]]: Object.values(v)[0]}
    }
    return {...a, [Object.keys(v)[0]]: [...a[Object.keys(v)[0]], Object.values(v)[0]]}
  }, {})
  
  console.log(depa)

    response.render("reports",{
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
    });
  };
  