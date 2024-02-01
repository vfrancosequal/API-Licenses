/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  //'*': true,
  AuthController:
  {
    "*":true,
  },
  LicensesController:
  {
    createLicense: "isLogin",
    updateLicense: "isLogin",
    statusLicense: "isLogin",
    listLicenses: "isLogin",
    infoLicense: "isLogin",
    validateLicense: true,
    associateLicense: true,
  }
/*  
  UsuariosController:
  {
    //"*":true,
    listarUsuarios: "isLogin",
    myInfo: "isLogin",
    infoUser: "isLogin",
    setPermissions: "isLogin",
    updateUser: "isLogin",
    createUser: "isLogin",
    statusUser: "isLogin",
    printUsuario: "isLogin",
    loadCsv: "isLogin",
    importUsuarios:"isLogin",
    metricas:true,
    llamadosAtencion:"isLogin",
    listarLlamdosAtencion: "isLogin",
    checkRedHumana: "isLogin"
  },
  MarcasController:
  {
    //"*":true,
    listarMarcas: "isLogin",
    createMarca: "isLogin",
    updateMarca: "isLogin",
    statusMarca: "isLogin",
    infoMarca: "isLogin",
    deleteMarca: "isLogin",
  }, 
  EquiposController:
  {
    //"*":true,
    listarEquipos: "isLogin",
    createEquipo: "isLogin",
    updateEquipo: "isLogin",
    infoEquipo: "isLogin",
    deleteEquipo: "isLogin",
  },
  OrganizacionesController:
  {
    //"*":true,
    listarOrganizaciones: "isLogin",
    createOrganizacion: "isLogin",
    updateOrganizacion: "isLogin",
    statusOrganizacion: "isLogin",
    infoOrganizacion: "isLogin",
    importOrganizacion: "isLogin",
  }, 
  ProyectosController:
  {
    //"*":true,
    listarProyectos: "isLogin",
    createProyecto: "isLogin",
    updateProyecto: "isLogin",
    statusProyecto: "isLogin",
    infoProyecto: "isLogin",
    importProyectos : 'isLogin',
  },  
  AsoProyectosController:
  {
    //"*":true,
    listarByProyectos: "isLogin",
    listarByAsociado: "isLogin",
    addAsociado: "isLogin",
    removeAsociado: "isLogin",
  },  
  AreasController:
  {
    //"*":true,
    listarAreas: "isLogin",
    infoArea: "isLogin",
    createArea: "isLogin",
    updateArea: "isLogin",
    statusArea: "isLogin",
  },
  PointsController:
  {
    //"*":true,
    listarMisPoints: "isLogin",
    createPoint: "isLogin",
    infoPoint: "isLogin",
    listarRevisores: "isLogin",
    commentPoint: "isLogin",
    closePoint: "isLogin",
    resolvePoint: "isLogin",
    asignPoint: "isLogin",
    listarPointsAsignados: "isLogin",
    listarPointsTotales: "isLogin",
  },
  MarcasController:
  {
    //"*":true,
    listarMarcas: "isLogin",
    createMarca: "isLogin",
    updateMarca: "isLogin",
    statusMarca: "isLogin",
    infoMarca: "isLogin",
    deleteMarca: "isLogin",
  },   
  SkillsController:
  {
    //"*":true,
    listarSkills: "isLogin",
    createSkill: "isLogin",
    updateSkill: "isLogin",
    statusSkill: "isLogin",
    infoSkill: "isLogin",
  },
  CoursesController:  
  {
    //"*":true,
    listarCourses: "isLogin",
    createCourses: "isLogin",
    updateCourses: "isLogin",
    statusCourses: "isLogin",
    infoCourses: "isLogin",
  },
  PensionController:   
  {
    //"*":true,
    listarPension: "isLogin",
    createPension: "isLogin",
    updatePension: "isLogin",
    statusPension: "isLogin",
    infoPension: "isLogin",
  },
  ArlController:   
  {
    //"*":true,
    listarArl: "isLogin",
    createArl: "isLogin",
    updateArl: "isLogin",
    statusArl: "isLogin",
    infoArl: "isLogin",
  },
  CesantiasController:   
  {
    //"*":true,
    listarCesantias: "isLogin",
    createCesantias: "isLogin",
    updateCesantias: "isLogin",
    statusCesantias: "isLogin",
    infoCesantias: "isLogin",
  },
  CompensacionController:   
  {
    //"*":true,
    listarCompensacion: "isLogin",
    createCompensacion: "isLogin",
    updateCompensacion: "isLogin",
    statusCompensacion: "isLogin",
    infoCompensacion: "isLogin",
  },
  KitsController:   
  {
    //"*":true,
    listarKits: "isLogin",
    createKits: "isLogin",
    updateKits: "isLogin",
    statusKits: "isLogin",
    infoKits: "isLogin",
  },
  AdicionalController:   
  {
    //"*":true,
    listarAdicional: "isLogin",
    createAdicional: "isLogin",
    updateAdicional: "isLogin",
    statusAdicional: "isLogin",
    infoAdicional: "isLogin",
  },
  EpsController:   
  {
    //"*":true,
    listarEps: "isLogin",
    createEps: "isLogin",
    updateEps: "isLogin",
    statusEps: "isLogin",
    infoEps: "isLogin",
  },
  NovedadesController:   
  {
    //"*":true,
    crearNovedadGea: "isLogin",
    crearNovedadGit: "isLogin",
    listarNovedadesGea: "isLogin",
    listarNovedadesGit: "isLogin",
  },
  ProceduresController:   
  {
    listProcedure: "isLogin",
    infoProcedure: "isLogin",
    createProcedure: "isLogin",
    updateProcedure: "isLogin",
    deleteProcedure: "isLogin",
  },  
*/
};
