/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /'                             : { view: 'api', locals: { layout: false }},
  'GET /apidoc'                       : { view: 'pages/documentacion' },
  'POST /login/user'                  : 'AuthController.loginUser',

  'POST /licenses'                    : 'LicensesController.createLicense',


/*
  //'GET /google/login'                 : 'AuthController.loginGoogle',
  //'GET /google/callback'              : 'AuthController.googleCallback',
  'POST /auth/get/token'              : 'AuthController.getAccessToken',


  'GET  /usuarios/listar'             : 'UsuariosController.listarUsuarios',
  'GET  /usuarios/myinfo'             : 'UsuariosController.myInfo',
  'GET  /usuarios/info'               : 'UsuariosController.infoUser',
  'POST /usuarios/permisos'           : 'UsuariosController.setPermissions',
  'PUT  /usuarios'                    : 'UsuariosController.updateUser',
  'POST /usuarios'                    : 'UsuariosController.createUser',
  'GET  /usuarios/print'              : 'UsuariosController.printUsuario',
  'PUT  /usuarios/status'             : 'UsuariosController.statusUser',
  'POST /usuarios/metricas'           : 'UsuariosController.metricas',
  //'POST /usuarios/import'             : 'UsuariosController.importUsuarios',
  'POST /usuarios/atencion'           : 'UsuariosController.llamadosAtencion',
  'GET /usuarios/atencion'            : 'UsuariosController.listarLlamdosAtencion',
  'GET /usuarios/redhumana'           : 'UsuariosController.checkRedHumana',

  'GET  /equipos/listar'              : 'EquiposController.listarEquipos',
  'POST /equipos'                     : 'EquiposController.createEquipo',
  'PUT  /equipos'                     : 'EquiposController.updateEquipo',
  'GET  /equipos/info'                : 'EquiposController.infoEquipo',
  'DELETE /equipos'                   : 'EquiposController.deleteEquipo',
 
  'GET  /marcas/listar'               : 'MarcasController.listarMarcas',
  'POST /marcas'                      : 'MarcasController.createMarca',
  'PUT  /marcas'                      : 'MarcasController.updateMarca',
  'PUT  /marcas/status'               : 'MarcasController.statusMarca',
  'GET  /marcas/info'                 : 'MarcasController.infoMarca',
  //'DELETE /marcas'                    : 'MarcasController.deleteMarca',

  'GET  /organizacion/listar'         : 'OrganizacionesController.listarOrganizaciones',
  'POST /organizacion'                : 'OrganizacionesController.createOrganizacion',
  'PUT  /organizacion'                : 'OrganizacionesController.updateOrganizacion',
  'PUT  /organizacion/status'         : 'OrganizacionesController.statusOrganizacion',  
  'GET  /organizacion/info'           : 'OrganizacionesController.infoOrganizacion',
  'POST /organizacion/import'         : 'OrganizacionesController.importOrganizacion',

  'GET  /proyecto/listar'             : 'ProyectosController.listarProyectos',
  'POST /proyecto'                    : 'ProyectosController.createProyecto',
  'PUT  /proyecto'                    : 'ProyectosController.updateProyecto',
  'PUT  /proyecto/status'             : 'ProyectosController.statusProyecto',  
  'GET  /proyecto/info'               : 'ProyectosController.infoProyecto',
  'POST /proyecto/import'             : 'ProyectosController.importProyectos',

  'GET  /relacion/proyecto'           : 'AsoProyectosController.listarByProyectos',
  'GET  /relacion/asociado'           : 'AsoProyectosController.listarByAsociado',
  'POST /relacion'                    : 'AsoProyectosController.addAsociado',
  'PUT  /relacion'                    : 'AsoProyectosController.removeAsociado',

  'GET  /area/listar'                 : 'AreasController.listarAreas',
  'GET  /area'                        : 'AreasController.infoArea',
  'POST /area'                        : 'AreasController.createArea',
  'PUT  /area'                        : 'AreasController.updateArea',
  'POST /area/status'                 : 'AreasController.statusArea',

  'POST /filecsv'                     : 'UsuariosController.loadCsv',

  'GET  /points/listar/propios'       : 'PointsController.listarMisPoints',
  'GET  /points/listar/asignados'     : 'PointsController.listarPointsAsignados',
  'GET  /points/listar/admin'         : 'PointsController.listarPointsTotales',
  'GET  /points/listar/revisores'     : 'PointsController.listarRevisores',
  'GET  /points'                      : 'PointsController.infoPoint',
  'POST /points'                      : 'PointsController.createPoint',
  'POST /points/comment'              : 'PointsController.commentPoint',
  'PUT  /points/close'                : 'PointsController.closePoint',
  'PUT  /points/resolve'              : 'PointsController.resolvePoint',
  'PUT  /points/asign'                : 'PointsController.asignPoint',
  //'PUT  /points'                      : 'PointsController.updateArea',
  //'POST /points/status'               : 'PointsController.statusArea',

  'GET  /skills/listar'               : 'SkillsController.listarSkills',
  'POST /skills'                      : 'SkillsController.createSkill',
  'PUT  /skills'                      : 'SkillsController.updateSkill',
  'PUT  /skills/status'               : 'SkillsController.statusSkill',
  'GET  /skills/info'                 : 'SkillsController.infoSkill', 

  'GET  /courses/listar'               : 'CoursesController.listarCourses',
  'POST /courses'                      : 'CoursesController.createCourses',
  'PUT  /courses'                      : 'CoursesController.updateCourses',
  'PUT  /courses/status'               : 'CoursesController.statusCourses',
  'GET  /courses/info'                 : 'CoursesController.infoCourses',

  'GET  /pension/listar'               : 'PensionController.listarPension',
  'POST /pension'                      : 'PensionController.createPension',
  'PUT  /pension'                      : 'PensionController.updatePension',
  'PUT  /pension/status'               : 'PensionController.statusPension',
  'GET  /pension/info'                 : 'PensionController.infoPension',

  'GET  /arl/listar'                   : 'ArlController.listarArl',
  'POST /arl'                          : 'ArlController.createArl',
  'PUT  /arl'                          : 'ArlController.updateArl',
  'PUT  /arl/status'                   : 'ArlController.statusArl',
  'GET  /arl/info'                     : 'ArlController.infoArl',

  'GET  /cesantias/listar'             : 'CesantiasController.listarCesantias',
  'POST /cesantias'                    : 'CesantiasController.createCesantias',
  'PUT  /cesantias'                    : 'CesantiasController.updateCesantias',
  'PUT  /cesantias/status'             : 'CesantiasController.statusCesantias',
  'GET  /cesantias/info'               : 'CesantiasController.infoCesantias',

  'GET  /compensacion/listar'          : 'CompensacionController.listarCompensacion',
  'POST /compensacion'                 : 'CompensacionController.createCompensacion',
  'PUT  /compensacion'                 : 'CompensacionController.updateCompensacion',
  'PUT  /compensacion/status'          : 'CompensacionController.statusCompensacion',
  'GET  /compensacion/info'            : 'CompensacionController.infoCompensacion',

  'GET  /kits/listar'                   : 'KitsController.listarKits',
  'POST /kits'                          : 'KitsController.createKits',
  'PUT  /kits'                          : 'KitsController.updateKits',
  'PUT  /kits/status'                   : 'KitsController.statusKits',
  'GET  /kits/info'                     : 'KitsController.infoKits',

  'GET  /adicional/listar'              : 'AdicionalController.listarAdicional',
  'POST /adicional'                     : 'AdicionalController.createAdicional',
  'PUT  /adicional'                     : 'AdicionalController.updateAdicional',
  'PUT  /adicional/status'              : 'AdicionalController.statusAdicional',
  'GET  /adicional/info'                : 'AdicionalController.infoAdicional',

  'GET  /eps/listar'                    : 'EpsController.listarEps',
  'POST /eps'                           : 'EpsController.createEps',
  'PUT  /eps'                           : 'EpsController.updateEps',
  'PUT  /eps/status'                    : 'EpsController.statusEps',
  'GET  /eps/info'                      : 'EpsController.infoEps',

  'POST /novedades/gea'                 : 'NovedadesController.crearNovedadGea',
  'POST /novedades/git'                 : 'NovedadesController.crearNovedadGit',
  'GET /novedades/git'                  : 'NovedadesController.listarNovedadesGit',
  'GET /novedades/gea'                  : 'NovedadesController.listarNovedadesGea',

  'GET  /procedures/listar'             : 'ProceduresController.listProcedure',
  'GET  /procedures'                    : 'ProceduresController.infoProcedure',
  'POST /procedures'                    : 'ProceduresController.createProcedure',
  'PUT  /procedures'                    : 'ProceduresController.updateProcedure',
  'DELETE /procedures'                  : 'ProceduresController.deleteProcedure', 
*/ 
};
