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
  

    response.render("reports",{
      permissions: request.session.permissions,
      csrfToken: request.csrfToken(),
      collabs,
      depa,
      empresa,
    });
  };

async function general_report() {
  const [rows, fieldData] = await Empresa.fetchAllEmp();
  const empresas = rows.map(r => r.nombre_empresa)

  let [empresas_validaciones, _] = await Reports.fetchCompany(empresas, '2025-01-01', '2025-05-01')
  
  empresas_validaciones = empresas_validaciones.reduce((a, v) => {
    return {...a, [v.nombre_empresa]: {...a[v.nombre_empresa], [v.indicador]: v.average}}
  }, {})
  
  return empresas_validaciones
}

async function company_reports(companies) {
  let [empresas_validaciones, _] = await Reports.fetchCompany(companies, '2025-01-01', '2025-05-01')
    empresas_validaciones = empresas_validaciones.reduce((a, v) => {
      return {...a, [v.nombre_empresa]: {...a[v.nombre_empresa], [v.indicador]: v.average}}
    }, {})
  return empresas_validaciones
}

// Returns an object in form 
// { Companies: 
//    { Department: 
//        { Indicator: value }
//    }
// }
async function department_reports(companies, departments) {
  let [departamento_validaciones, _] = await Reports.fetchDepartments(companies, departments, '2025-01-01', '2025-05-01')
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

exports.get_general_report = async (request, response) => {
  if (request.body.company_values.length == 0) {
    const empresas_validaciones = await general_report()
    
    response.status(200).json(empresas_validaciones)
  }
  else if (request.body.department_values.length == 0) {
    const empresas_validaciones = await company_reports(request.body.company_values)

    response.status(200).json(empresas_validaciones)
  }
  else if (request.body.collabs_values.length == 0) {
    const departamentos_validaciones = await department_reports(request.body.company_values, request.body.department_values)
    console.log(departamentos_validaciones)
    
    response.status(200).json({empresas_validaciones: departamentos_validaciones})
  }


}

