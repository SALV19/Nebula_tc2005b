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
        acc = {[val.nombre_empresa]: [{nombre: val.nombre_departamento, id: val.id_departamento}]}
      }
      else {
        acc = {[val.nombre_empresa]: [...acc[val.nombre_empresa], {
          nombre: val.nombre_departamento, 
          id: val.id_departamento
        }]}
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
  
    response.render("reports",{
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      collabs,
      depa,
      empresa,
    });
  };

async function general_report(periodicity) {
  const [rows, fieldData] = await Empresa.fetchAllEmp();
  const empresas = rows.map(r => r.nombre_empresa)

  let [empresas_validaciones, _] = await Reports.fetchCompany(empresas, 
                                                  `${periodicity.target_month}-01`, `${periodicity.curr_date}-31`)
  empresas_validaciones = empresas_validaciones.reduce((a, v) => {
    return {...a, [v.nombre_empresa]: {...a[v.nombre_empresa], [v.indicador]: v.average}}
  }, {})
  
  return empresas_validaciones
}

async function company_reports(companies, periodicity) {
  let [empresas_validaciones, _] = await Reports.fetchCompany(companies, 
                                                  `${periodicity.target_month}-01`, `${periodicity.curr_date}-31`)
    empresas_validaciones = empresas_validaciones.reduce((a, v) => {
      return {...a, [v.nombre_empresa]: {...a[v.nombre_empresa], [v.indicador]: v.average}}
    }, {})
  
  return empresas_validaciones
}

async function department_reports(companies, departments, periodicity) {
  let [departamento_validaciones, _] = await Reports.fetchDepartments(companies, departments, 
                                                  `${periodicity.target_month}-01`, `${periodicity.curr_date}-31`)
  departamento_validaciones = departamento_validaciones.reduce((a, v) => {
    if (!Object.keys(a).includes(v.nombre_empresa)) {
      return {...a, [v.nombre_empresa]: {
        [v.nombre_departamento]: {
          [v.indicador]: v.average
          }
        }
      }
    }
    else if (!Object.keys(a[v.nombre_empresa]).includes(v.nombre_departamento)) {
      return {...a, [v.nombre_empresa]: {
                ...a[v.nombre_empresa], 
                [v.nombre_departamento]: {
                    [v.indicador]: v.average
                  }
                }
              }
    }

    return {...a, [v.nombre_empresa]: {
                ...a[v.nombre_empresa], 
                [v.nombre_departamento]: {
                  ...a[v.nombre_empresa][v.nombre_departamento], 
                  [v.indicador]: v.average
                }
              }
            }
  }, {})

  return departamento_validaciones
  
}

async function collabs_reports(collabs, periodicity) {
  let [colaboradores_validaciones, _] = await Reports.fetchCollaborators(collabs,
                                                  `${periodicity.target_month}-01`, `${periodicity.curr_date}-31`)
  colaboradores_validaciones = colaboradores_validaciones.reduce((a, v) => {
    if (!Object.keys(a).includes(v.nombre_empresa)) {
      return {...a, [v.nombre_empresa]: {
        [v.nombre_departamento]: {
          [v.nombre+" "+v.apellidos]: {
              [v.indicador]: v.average
            }
          }
        }
      }
    }
    else if (!Object.keys(a[v.nombre_empresa]).includes(v.nombre_departamento)) {
      return {...a, [v.nombre_empresa]: {
                ...a[v.nombre_empresa], 
                [v.nombre_departamento]: {
                  [v.nombre+" "+v.apellidos]: {
                      [v.indicador]: v.average
                    }
                  }
                }
              }
    }
    else if (!Object.keys(a[v.nombre_empresa][v.nombre_departamento]).includes(v.nombre+" "+v.apellidos)) {
      return {...a, [v.nombre_empresa]: {
                ...a[v.nombre_empresa], 
                [v.nombre_departamento]: {
                  ...a[v.nombre_empresa][v.nombre_departamento], 
                  [v.nombre+" "+v.apellidos]: {
                      [v.indicador]: v.average
                    }
                  }
                }
              }
    }

    return {...a, [v.nombre_empresa]: {
                ...a[v.nombre_empresa], 
                [v.nombre_departamento]: {
                  ...a[v.nombre_empresa][v.nombre_departamento], 
                  [v.nombre+" "+v.apellidos]: {
                    [v.indicador]: v.average
                  }
                }
              }
            }
  }, {})

  return colaboradores_validaciones
  
}


function getStartEnd(periodicity) {
  const curr_date = new Date()
  const target_month = new Date(curr_date.getFullYear(), curr_date.getMonth() - periodicity + 1, 0)
  
  return {
    curr_date : String(curr_date.getFullYear()) + "-" + (curr_date.getMonth()+1 > 10 
        ? curr_date.getMonth()+1 : "0" + String(curr_date.getMonth()+1)), 
    target_month: String(target_month.getFullYear()) + "-" + (target_month.getMonth()+1 > 10 
        ? target_month.getMonth()+1 : "0" + String(target_month.getMonth()+1))
  }
}

exports.get_general_report = async (request, response) => {
  const periodicity = getStartEnd(request.body.periodicity ?? 1)
  if (request.body.company_values.length == 0) {
    const empresas_validaciones = await general_report(periodicity)

    response.status(200).json({
      type: "general",
      empresas_validaciones
    })
  }
  else if (request.body.department_values.length == 0) {
    const empresas_validaciones = await company_reports(request.body.company_values, periodicity)

    response.status(200).json({
      type: "general",
      empresas_validaciones})
  }
  else if (request.body.collabs_values.length == 0) {
    const departamentos_validaciones = await department_reports(request.body.company_values, 
                                                      request.body.department_values, periodicity)
    // console.log(departamentos_validaciones)
    
    response.status(200).json({
      type: "department",
      departamentos_validaciones
    })
  }
  else {
    const collabs_validaciones = await collabs_reports(request.body.collabs_values, periodicity)

    response.status(200).json({
      type: "collabs",
      collabs_validaciones
    })
  }
}


exports.get_collabs = async (request, response) => {
  const [collabs] = await Colaborador.fetchDepartmentCollabs(request.body.selected);

  response.json({message: "all good"})
}