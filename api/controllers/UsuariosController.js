const fs = require('fs');
var csv = require("csvtojson");
const moment = require('moment');
const { Sign } = require('crypto');
const path = require('path');

module.exports = {
	listarUsuarios : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string"
			];

			if(params.hasOwnProperty('activo'))
				valid.push('activo:boolean')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);
			/*
			let user = await ModelService.findOne('Usuarios',{email:req.userEmail})
			if(!user.permisos.admin)
			{
				let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
				if(!permiso)
					return res.status(401).send(ResponseService.res(401, 30001, true));
			}
			*/
			let query = {activo:{"$in":[true,false]}}
			if(params.hasOwnProperty('activo'))
				query.activo = ComunService.toBoolean(params.activo)
			
			let users = await ModelService.find('Usuarios',query,{"nombres":1})
			//console.log(user)
			//if(!user)
				//return res.status(401).send(ResponseService.res(401, 30002, true));
			return res.json(ResponseService.res(200, 10001, false, users));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	myInfo : async function(req, res)
	{
		try
		{
			let user = await ModelService.findOne('Usuarios',{email:req.userEmail})
			if(!user)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, user));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},	
	setPermissions : async function(req,res)
	{
		try
		{	
			let permiso = await ComunService.validAdmin(req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			params = req.allParams();
			let valid = [
				"email:email",
				"gea:string",
				"git:string",
				"gefi:string",
				"gecp:string",
				"point:string",
				"psp:string",
				"admin:boolean",
			];

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			if(params.gea.toUpperCase()!='USER' && params.gea.toUpperCase()!='REVISOR' && params.gea.toUpperCase()!='ADMIN')
				return res.status(401).send(ResponseService.res(401, 40010, true, "GEA"));
			if(params.git.toUpperCase()!='USER' && params.git.toUpperCase()!='REVISOR' && params.git.toUpperCase()!='ADMIN')
				return res.status(401).send(ResponseService.res(401, 40010, true, "GIT"));
			if(params.gefi.toUpperCase()!='USER' && params.gefi.toUpperCase()!='REVISOR' && params.gefi.toUpperCase()!='ADMIN')
				return res.status(401).send(ResponseService.res(401, 40010, true, "GEFI"));
			if(params.gecp.toUpperCase()!='USER' && params.gecp.toUpperCase()!='REVISOR' && params.gecp.toUpperCase()!='ADMIN')
				return res.status(401).send(ResponseService.res(401, 40010, true, "GECP"));
			if(params.point.toUpperCase()!='USER' && params.point.toUpperCase()!='REVISOR' && params.point.toUpperCase()!='ADMIN')
				return res.status(401).send(ResponseService.res(401, 40010, true, "POINT"));
			if(params.psp.toUpperCase()!='USER' && params.psp.toUpperCase()!='REVISOR' && params.psp.toUpperCase()!='ADMIN')
				return res.status(401).send(ResponseService.res(401, 40010, true, "PSP"));

			let usuario = await ModelService.findOne('Usuarios',{email:params.email.toLowerCase()})
			if (!usuario)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let paramsData = {
				gea : params.gea.toUpperCase(),
				git : params.git.toUpperCase(),
				gefi : params.gefi.toUpperCase(),
				gecp : params.gecp.toUpperCase(),
				point : params.point.toUpperCase(),
				psp : params.psp.toUpperCase(),
				admin : ComunService.toBoolean(params.admin)
			}
			let result = await ModelService.update("Usuarios", {permisos : paramsData},{email: params.email.toLowerCase()})
			return res.json(ResponseService.res(200, 10001, false));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},
	infoUser : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"email:email",
				"app:string"
			];

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);
			/*
			let user = await ModelService.findOne('Usuarios',{email:req.userEmail})
			if(!user.permisos.admin)
			{
				let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
				if(!permiso)
					return res.status(401).send(ResponseService.res(401, 30001, true));
			}
			*/
			let usuario = await ModelService.findOne('Usuarios',{email:params.email.toLowerCase()})
			if (!usuario)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, usuario));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	updateUser: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"nombres:string",
				"apellidos:string",
				"tipoDocumento:string",
				"numeroDocumento:string",
				"estadoCivil:string",
				"email:email",
				"emailPersonal:email",
				"celular:string",
				"genero:string",
				"cumpleaños:",
				"departamento:string",
				"ciudad:string",
				"barrio:string",
				"direccion:string",
				"hijos:string",
				"perfil:string",
				"perfilProfesional:string",
				"tipoContrato:string",
				"redHumana:string",
			];
			let paramsData = {}
			if(params.hasOwnProperty('sueldo'))
				valid.push("sueldo:string")
			if(params.hasOwnProperty('seniority'))
				valid.push("seniority:string")
			if(params.hasOwnProperty('arl'))
				valid.push("arl:string")
			if(params.hasOwnProperty('eps'))
				valid.push("eps:string")
			if(params.hasOwnProperty('pension'))
				valid.push("pension:string")
			if(params.hasOwnProperty('cesantias'))
				valid.push("cesantias:string")
			if(params.hasOwnProperty('compensacion'))
				valid.push("compensacion:string")
			if(params.hasOwnProperty('horasSemana'))
				valid.push("horasSemana:string")
			if(params.hasOwnProperty('horasPotenciales'))
				valid.push("horasPotenciales:string")
			if(params.hasOwnProperty('tarifaHora'))
				valid.push("tarifaHora:string")
			if(params.hasOwnProperty('fecha_ingreso'))
				valid.push("fecha_ingreso:"	)	
			if(params.hasOwnProperty('salarioBase'))
				valid.push("salarioBase:string")
			if(params.hasOwnProperty('salarioFlexible'))
				valid.push("salarioFlexible:string")
			if(params.hasOwnProperty('valorAuxilio'))
				valid.push("valorAuxilio:string")
			if(params.hasOwnProperty('tipoAuxilio'))
				valid.push("tipoAuxilio:string")
			if(params.hasOwnProperty('fechaUltimoIncremento'))
				valid.push("fechaUltimoIncremento:")
			if(params.hasOwnProperty('numeroCuenta'))
				valid.push("numeroCuenta:string")
			if(params.hasOwnProperty('tipoCuenta'))
				valid.push("tipoCuenta:string")
			if(params.hasOwnProperty('banco'))
				valid.push("banco:string")
			if(params.hasOwnProperty('tipoSangre'))
				valid.push("tipoSangre:string")
			if(params.hasOwnProperty('tallaCamisa'))
				valid.push("tallaCamisa:string")
			if(params.hasOwnProperty('tallaPantalon'))
				valid.push("tallaPantalon:string")
			if(params.hasOwnProperty('usuarioRed'))
				valid.push("usuarioRed:string")
			if(params.hasOwnProperty('fechaIngresoRed'))
				valid.push("fechaIngresoRed:")
			if(params.hasOwnProperty('fechaRetiroRed'))
				valid.push("fechaRetiroRed:")
			if(params.hasOwnProperty('fechaProrrogaRed'))
				valid.push("fechaProrrogaRed:")
			if(params.hasOwnProperty('eneatipo'))
				valid.push('eneatipo:string')
			if(params.hasOwnProperty('contactoEmerg'))
				valid.push('contactoEmerg:string')
			if(params.hasOwnProperty('numEmergencia'))
				valid.push('numEmergencia:string')
			if(params.hasOwnProperty('cursos'))
				valid.push('cursos:string')
			if(params.hasOwnProperty('softSkill'))
				valid.push('softSkill:string')
			if(params.hasOwnProperty('hardSkill'))
				valid.push('hardSkill:string')
			if(params.hasOwnProperty('localPhone'))
				valid.push('localPhone:string')
			if(params.hasOwnProperty('photo'))
				valid.push('photo:')
			if(params.hasOwnProperty('numeroHijos'))
				valid.push('numeroHijos:string')
			if(params.hasOwnProperty('epp'))
				valid.push('epp:')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);
			
			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			
			//params.celular = ComunService.formatPhone(params.celular);
			let user = await ModelService.findOne("Usuarios", {email:params.email.toLowerCase()});
			if (!user)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			//console.log(ComunService.formatMoney(params.sueldo))
		
			paramsData = {
				nombres : ComunService.capitalize(params.nombres),
				apellidos : ComunService.capitalize(params.apellidos),
				tipoDocumento : params.tipoDocumento.toUpperCase(),
				numeroDocumento : params.numeroDocumento.split('.').join(''),
				estadoCivil : params.estadoCivil.toLowerCase(),
				emailPersonal : params.emailPersonal.toLowerCase(),
				celular : params.celular,
				genero : ComunService.capitalize(params.genero),
				cumpleaños : params.cumpleaños,
				departamento : params.departamento,
				ciudad : params.ciudad,
				barrio : params.barrio.toUpperCase(),
				direccion: params.direccion.toLowerCase(),					
				hijos : params.hijos.toUpperCase(),
				perfil : params.perfil.toUpperCase(),
				perfilProfesional : params.perfilProfesional.toUpperCase(),
				tipoContrato : ComunService.capitalize(params.tipoContrato),
				redHumana : params.redHumana.toUpperCase()
			};
		
			if(params.hasOwnProperty('sueldo'))
				paramsData.sueldo = params.sueldo.split('.').join('')
			if(params.hasOwnProperty('arl'))
				paramsData.arl = ComunService.toObjectId(params.arl)
			if(params.hasOwnProperty('eps'))
				paramsData.eps = ComunService.toObjectId(params.eps)
			if(params.hasOwnProperty('pension'))
				paramsData.pension = ComunService.toObjectId(params.pension)
			if(params.hasOwnProperty('cesantias'))
				paramsData.cesantias = ComunService.toObjectId(params.cesantias)
			if(params.hasOwnProperty('compensacion'))
				paramsData.compensacion = ComunService.toObjectId(params.compensacion)
			if(params.hasOwnProperty('fecha_ingreso'))
				paramsData.fecha_ingreso = params.fecha_ingreso
			if(params.hasOwnProperty('horasSemana'))
				paramsData.horasSemana = params.horasSemana
			if(params.hasOwnProperty('horasPotenciales'))
				paramsData.horasPotenciales = params.horasPotenciales
			if(params.hasOwnProperty('tarifaHora'))
				paramsData.tarifaHora = params.tarifaHora
			if(params.hasOwnProperty('seniority'))
				paramsData.seniority = params.seniority.toLowerCase()
			if(params.hasOwnProperty('salarioBase'))
				paramsData.salarioBase = params.salarioBase.split('.').join('')
			if(params.hasOwnProperty('salarioFlexible'))
				paramsData.salarioFlexible = params.salarioFlexible.split('.').join('')
			if(params.hasOwnProperty('valorAuxilio'))
				paramsData.valorAuxilio = params.valorAuxilio.split('.').join('')
			if(params.hasOwnProperty('tipoAuxilio'))
				paramsData.tipoAuxilio = params.tipoAuxilio.toUpperCase()
			if(params.hasOwnProperty('fechaUltimoIncremento'))
				paramsData.fechaUltimoIncremento = params.fechaUltimoIncremento
			if(params.hasOwnProperty('numeroCuenta'))
				paramsData.numeroCuenta = params.numeroCuenta
			if(params.hasOwnProperty('tipoCuenta'))
				paramsData.tipoCuenta = params.tipoCuenta.toUpperCase()
			if(params.hasOwnProperty('banco'))
				paramsData.banco = params.banco.toUpperCase()
			if(params.hasOwnProperty('tipoSangre'))
				paramsData.tipoSangre = params.tipoSangre.toUpperCase()
			if(params.hasOwnProperty('tallaCamisa'))
				paramsData.tallaCamisa = params.tallaCamisa.toUpperCase()
			if(params.hasOwnProperty('tallaPantalon'))
				paramsData.tallaPantalon = params.tallaPantalon.toUpperCase()
			if(params.redHumana == "SI")
			{
				if(params.hasOwnProperty('usuarioRed'))
					paramsData.usuarioRed = params.usuarioRed.toLowerCase()
				if(params.hasOwnProperty('fechaIngresoRed'))
					paramsData.fechaIngresoRed = params.fechaIngresoRed
				if(params.hasOwnProperty('fechaRetiroRed'))
					paramsData.fechaRetiroRed = params.fechaRetiroRed
				if(params.hasOwnProperty('fechaProrrogaRed'))
					paramsData.fechaProrrogaRed = params.fechaProrrogaRed
			}

			if(params.hasOwnProperty('eneatipo'))
				paramsData.eneatipo = params.eneatipo
			if(params.hasOwnProperty('contactoEmerg'))
				paramsData.contactoEmerg = params.contactoEmerg
			if(params.hasOwnProperty('numEmergencia'))
				paramsData.numEmergencia = params.numEmergencia
			if(params.hasOwnProperty('cursos'))
				paramsData.cursos = params.cursos
			if(params.hasOwnProperty('softSkill'))
				paramsData.softSkill = params.softSkill
			if(params.hasOwnProperty('hardSkill'))
				paramsData.hardSkill = params.hardSkill
			if(params.hasOwnProperty('localPhone'))
				paramsData.localPhone = params.localPhone
			if(params.hasOwnProperty('photo'))
				paramsData.photo = params.photo
				//Validacion de hijos = no numero de hijos = 0
			if(params.hijos === "SI" && params.numeroHijos !== "0"){
				paramsData.numeroHijos = params.numeroHijos
			}else{
				paramsData.numeroHijos = 0
			}

			//Campos de los EPP 
			if(params.hasOwnProperty('epp'))
				paramsData.epp = params.epp
			
			let result = await ModelService.update("Usuarios", paramsData, {email : user.email});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	createUser: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"nombres:string",
				"apellidos:string",
				"tipoDocumento:string",
				"numeroDocumento:string",
				"estadoCivil:string",
				"email:email",
				"emailPersonal:email",
				"celular:string",
				"genero:string",
				"cumpleaños:",
				"departamento:string",
				"ciudad:string",
				"barrio:string",
				"direccion:string",
				"hijos:string",
				"perfil:string",
				"perfilProfesional:string",
				"tipoContrato:string",
				"redHumana:string",
			];
			let paramsData = {}

			if(params.hasOwnProperty('sueldo'))
				valid.push("sueldo:string")
			if(params.hasOwnProperty('seniority'))
				valid.push("seniority:string")
			if(params.hasOwnProperty('arl'))
				valid.push("arl:string")
			if(params.hasOwnProperty('eps'))
				valid.push("eps:string")
			if(params.hasOwnProperty('pension'))
				valid.push("pension:string")
			if(params.hasOwnProperty('cesantias'))
				valid.push("cesantias:string")
			if(params.hasOwnProperty('compensacion'))
				valid.push("compensacion:string")
			if(params.hasOwnProperty('horasSemana'))
				valid.push("horasSemana:string")
			if(params.hasOwnProperty('horasPotenciales'))
				valid.push("horasPotenciales:string")
			if(params.hasOwnProperty('tarifaHora'))
				valid.push("tarifaHora:string")
			if(params.hasOwnProperty('fecha_ingreso'))
				valid.push("fecha_ingreso:"	)	
			if(params.hasOwnProperty('salarioBase'))
				valid.push("salarioBase:string")
			if(params.hasOwnProperty('salarioFlexible'))
				valid.push("salarioFlexible:string")
			if(params.hasOwnProperty('valorAuxilio'))
				valid.push("valorAuxilio:string")
			if(params.hasOwnProperty('tipoAuxilio'))
				valid.push("tipoAuxilio:string")
			if(params.hasOwnProperty('fechaUltimoIncremento'))
				valid.push("fechaUltimoIncremento:")
			if(params.hasOwnProperty('numeroCuenta'))
				valid.push("numeroCuenta:string")
			if(params.hasOwnProperty('tipoCuenta'))
				valid.push("tipoCuenta:string")
			if(params.hasOwnProperty('banco'))
				valid.push("banco:string")
			if(params.hasOwnProperty('tipoSangre'))
				valid.push("tipoSangre:string")
			if(params.hasOwnProperty('tallaCamisa'))
				valid.push("tallaCamisa:string")
			if(params.hasOwnProperty('tallaPantalon'))
				valid.push("tallaPantalon:string")
			if(params.hasOwnProperty('usuarioRed'))
				valid.push("usuarioRed:string")
			if(params.hasOwnProperty('fechaIngresoRed'))
				valid.push("fechaIngresoRed:")
			if(params.hasOwnProperty('fechaRetiroRed'))
				valid.push("fechaRetiroRed:")
			if(params.hasOwnProperty('fechaProrrogaRed'))
				valid.push("fechaProrrogaRed:")			

			if(params.hasOwnProperty('eneatipo'))
				valid.push('eneatipo:string')
			if(params.hasOwnProperty('contactoEmerg'))
				valid.push('contactoEmerg:string')			
			if(params.hasOwnProperty('numEmergencia'))
				valid.push('numEmergencia:string')
			if(params.hasOwnProperty('cursos'))
				valid.push('cursos:string')
			if(params.hasOwnProperty('softSkill'))
				valid.push('softSkill:string')
			if(params.hasOwnProperty('hardSkill'))
				valid.push('hardSkill:string')
			if(params.hasOwnProperty('localPhone'))
				valid.push('localPhone:string')
			if(params.hasOwnProperty('photo'))
				valid.push('photo:')
			if(params.hasOwnProperty("numeroHijos"))
				valid.push("numeroHijos:string")
			if(params.hasOwnProperty('epp'))
				valid.push('epp:string')

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			
			let user = await ModelService.findOne("Usuarios", {email:params.email.toLowerCase()});
			if (user)
				return res.status(401).send(ResponseService.res(401, 20040, true));
			//validacion correo
			let domain = params.email.split('@')[1]
			if(domain.toLowerCase() != "sequal.com.co")
				return res.status(401).send(ResponseService.res(401, 20001, true));

			let newId = params.nombres+' '+params.apellidos
			newId = newId.split(' ')
			cadena = ''
			for(var i=0;i<newId.length;i++)
				cadena = cadena+newId[i].charAt(0)
			cadena = cadena.toUpperCase()

			let userId = await ModelService.findOne("Usuarios", {_id:cadena});
			if (userId)
				return res.status(401).send(ResponseService.res(401, 30018, true));

			paramsData = {
				_id : cadena,				
				email: params.email.toLowerCase(),
				nombres : ComunService.capitalize(params.nombres),
				apellidos : ComunService.capitalize(params.apellidos),
				tipoDocumento : params.tipoDocumento.toUpperCase(),
				numeroDocumento : params.numeroDocumento.split('.').join(''),
				estadoCivil : params.estadoCivil.toLowerCase(),
				emailPersonal : params.emailPersonal.toLowerCase(),
				celular : params.celular,
				genero : ComunService.capitalize(params.genero),
				cumpleaños: params.cumpleaños,
				departamento : params.departamento,
				ciudad : params.ciudad,
				barrio : params.barrio.toUpperCase(),
				direccion: params.direccion.toLowerCase(),					
				hijos : params.hijos.toUpperCase(),
				perfil : params.perfil.toUpperCase(),
				perfilProfesional : params.perfilProfesional.toUpperCase(),
				tipoContrato : ComunService.capitalize(params.tipoContrato),
				redHumana : params.redHumana.toUpperCase(),				
				mac:'',
				pass:'',
				activo : true,
				admin : false,
				revisor : false,
				superAdmin : false,
				permisos : {
					gea : 'USER',
					git : 'USER',
					gecp : 'USER',
					point : 'USER',
					psp : 'USER',
					admin : false
				},
			};

			if(params.hasOwnProperty('sueldo'))
				paramsData.sueldo = params.sueldo.split('.').join('')
			if(params.hasOwnProperty('arl'))
				paramsData.arl = ComunService.toObjectId(params.arl)
			if(params.hasOwnProperty('eps'))
				paramsData.eps = ComunService.toObjectId(params.eps)
			if(params.hasOwnProperty('pension'))
				paramsData.pension = ComunService.toObjectId(params.pension)
			if(params.hasOwnProperty('cesantias'))
				paramsData.cesantias = ComunService.toObjectId(params.cesantias)
			if(params.hasOwnProperty('compensacion'))
				paramsData.compensacion = ComunService.toObjectId(params.compensacion)
			if(params.hasOwnProperty('fecha_ingreso'))
				paramsData.fecha_ingreso = params.fecha_ingreso
			if(params.hasOwnProperty('horasSemana'))
				paramsData.horasSemana = params.horasSemana
			if(params.hasOwnProperty('horasPotenciales'))
				paramsData.horasPotenciales = params.horasPotenciales
			if(params.hasOwnProperty('tarifaHora'))
				paramsData.tarifaHora = params.tarifaHora
			if(params.hasOwnProperty('seniority'))
				paramsData.seniority = params.seniority.toLowerCase()
			if(params.hasOwnProperty('salarioBase'))
				paramsData.salarioBase = params.salarioBase.split('.').join('')
			if(params.hasOwnProperty('salarioFlexible'))
				paramsData.salarioFlexible = params.salarioFlexible.split('.').join('')
			if(params.hasOwnProperty('valorAuxilio'))
				paramsData.valorAuxilio = params.valorAuxilio.split('.').join('')
			if(params.hasOwnProperty('tipoAuxilio'))
				paramsData.tipoAuxilio = params.tipoAuxilio.toUpperCase()
			if(params.hasOwnProperty('fechaUltimoIncremento'))
				paramsData.fechaUltimoIncremento = params.fechaUltimoIncremento
			if(params.hasOwnProperty('numeroCuenta'))
				paramsData.numeroCuenta = params.numeroCuenta
			if(params.hasOwnProperty('tipoCuenta'))
				paramsData.tipoCuenta = params.tipoCuenta.toUpperCase()
			if(params.hasOwnProperty('banco'))
				paramsData.banco = params.banco.toUpperCase()
			if(params.hasOwnProperty('tipoSangre'))
				paramsData.tipoSangre = params.tipoSangre.toUpperCase()
			if(params.hasOwnProperty('tallaCamisa'))
				paramsData.tallaCamisa = params.tallaCamisa.toUpperCase()
			if(params.hasOwnProperty('tallaPantalon'))
				paramsData.tallaPantalon = params.tallaPantalon.toUpperCase()
			if(params.redHumana == "SI")
			{
				if(params.hasOwnProperty('usuarioRed'))
					paramsData.usuarioRed = params.usuarioRed.toLowerCase()
				if(params.hasOwnProperty('fechaIngresoRed'))
					paramsData.fechaIngresoRed = params.fechaIngresoRed
				if(params.hasOwnProperty('fechaRetiroRed'))
					paramsData.fechaRetiroRed = params.fechaRetiroRed
				if(params.hasOwnProperty('fechaProrrogaRed'))
					paramsData.fechaProrrogaRed = params.fechaProrrogaRed
			}
			
			if(params.hasOwnProperty('eneatipo'))
				paramsData.eneatipo = params.eneatipo
			if(params.hasOwnProperty('contactoEmerg'))
				paramsData.contactoEmerg = params.contactoEmerg			
			if(params.hasOwnProperty('numEmergencia'))
				paramsData.numEmergencia = params.numEmergencia
			if(params.hasOwnProperty('cursos'))
				paramsData.cursos = params.cursos
			if(params.hasOwnProperty('softSkill'))
				paramsData.softSkill = params.softSkill
			if(params.hasOwnProperty('hardSkill'))
				paramsData.hardSkill = params.hardSkill
			if(params.hasOwnProperty('localPhone'))
				paramsData.localPhone = params.localPhone
			if(params.hasOwnProperty('photo'))
				paramsData.photo = params.photo

			//Validacion de hijos
			if(params.hijos === "SI" && params.numeroHijos !== "0"){
				paramsData.numeroHijos = params.numeroHijos
			}else{
				paramsData.numeroHijos = 0
			}

			//Campos de los EPP 
			if(params.hasOwnProperty('epp'))
				valid.push('epp:string')

			let result = await ModelService.create("Usuarios", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},	
	printUsuario : async function (req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"email:email",
				"app:string"
			];

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);
			/*
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			*/
			let usuario = await UsuariosService.info({email:params.email.toLowerCase()})
			//let usuario = await ModelService.findOne('Usuarios',{email:params.email.toLowerCase()})
			if (!usuario)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			usuario = usuario[0]

		    usuario.txtcursos='';
			if(usuario.cursos){
				usuario.cursos = await ModelService.find('Courses',{_id : {'$in':ComunService.arraytoObjectId(usuario.cursos)}})
			    if(usuario.cursos.length>0)
			    {
			        for(var i=0;i < usuario.cursos.length;i++)
			        {
			            usuario.txtcursos = usuario.txtcursos+usuario.cursos[i].course
			            if(i < usuario.cursos.length-1)
			                usuario.txtcursos = usuario.txtcursos+', '
			        }
			    }			
			}
		    usuario.txtsoft="";
			if(usuario.softSkill){
				usuario.softSkill = await ModelService.find('Skills',{_id : {'$in':ComunService.arraytoObjectId(usuario.softSkill)}})
			    if(usuario.softSkill.length>0)
			    {
			        for(var i=0;i < usuario.softSkill.length;i++)
			        {
			            usuario.txtsoft = usuario.txtsoft+usuario.softSkill[i].skill
			            if(i < usuario.softSkill.length-1)
			                usuario.txtsoft = usuario.txtsoft+', '
			        }
			    }			
			}
	    	usuario.txthard="";
			if(usuario.hardSkill){
				usuario.hardSkill = await ModelService.find('Skills',{_id : {'$in':ComunService.arraytoObjectId(usuario.hardSkill)}})
			    if(usuario.hardSkill.length>0)
			    {
			        for(var i=0;i < usuario.hardSkill.length;i++)
			        {
			            usuario.txthard = usuario.txthard+usuario.hardSkill[i].skill
			            if(i < usuario.hardSkill.length-1)
			                usuario.txthard = usuario.txthard+', '
			        }
			    }
			}
			let proyectos = await AsoProyectosService.listByAsociado({asociado : usuario.email})
			usuario.proyectos = proyectos
			//let plus = Date.now()
			let dirTmp = '.tmp/public/';
			if (!fs.existsSync(dirTmp))
    			fs.mkdirSync(dirTmp);
			/*
			let dir = 'assets/pdfs/';
			    if (!fs.existsSync(dir))
			    	fs.mkdirSync(dir);    		
    		//console.log(path.join(__dirname, '../../'))
    		*/
    		fs.chmodSync(dirTmp, 0777, function(err){
    			if(err)
    				console.log(err);
    				return reje+ct(false);
			});
            await sails.hooks.pdf.make('usuarios', { data: usuario },  
                {
                    // Page options
                    "border": "cm",             // default is 0, units: mm, cm, in, px
                    "border": {
                    	"top": "1cm",            // default is 0, units: mm, cm, in, px
                    	"right": "1cm",
                    	"bottom": "1cm",
                    	"left": "1cm"
                    },
                    "format": "Letter",                 
                    //output: '.tmp/public/pdf/'+usuario.nombres.toLowerCase().split(' ').join('')+usuario.apellidos.toLowerCase().split(' ').join('')+'.pdf'
                    output: dirTmp+usuario.nombres.toLowerCase().split(' ').join('')+usuario.apellidos.toLowerCase().split(' ').join('')+'.pdf'
                },
                async function(err) 
                {	
                	try
					{
                        console.log(err || "ok PDF!!");
                        console.log(usuario.nombres.toLowerCase().split(' ').join('')+usuario.apellidos.toLowerCase().split(' ').join('')+'.pdf')
            			return res.json(ResponseService.res(200, 10001, false, usuario.nombres.toLowerCase().split(' ').join('')+usuario.apellidos.toLowerCase().split(' ').join('')+'.pdf'));			
					}
					catch(err)
					{
						console.log(err)
						return res.status(500).send(ResponseService.res(500, 30012, true, err));
					}
                }
            );
		    
			//return res.json(ResponseService.res(200, 10001, false, usuario));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},
	statusUser: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"email:email"			
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let user = await ModelService.findOne("Usuarios", {email:params.email.toLowerCase()});
			if (!user)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			
			let result = await ModelService.update("Usuarios", {activo : !user.activo},{email : user.email});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	loadCsv : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"file:"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);			

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			jsonArray = await csv({delimiter:'auto'}).fromString(params.file);
			settings = await ModelService.findOne('Settings')
			//console.log("Existe: ",!settings)
			if(!settings)
				settings = await ModelService.create('Settings',{guardando : false})
			//console.log("Guardando: ",settings.guardando)
			if(settings.guardando)
				return res.status(401).send(ResponseService.res(401, 30015, true));

			if(!settings.guardando)
				UsuariosService.registrarCSV(jsonArray)
			
			//console.log("Afuera: ",await ModelService.findOne('Settings'))
			return res.json(ResponseService.res(200, 10001, false,{}));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	metricas : async function(req,res)//UTILIZAR LA RELACIÓN ASOPROYECTOS
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"fechaIni:",
				"fechaFin:"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			params.fechaIni = moment(params.fechaIni,"DD/MM/YYYY").utc().format("YYYY-MM-DD")
			params.fechaFin = moment(params.fechaFin,"DD/MM/YYYY").utc().format("YYYY-MM-DD")

			if(!params.hasOwnProperty('asociados'))
				params.asociados = []
			if(params.asociados.length == 0)
			{
				let asociados = await ModelService.find('Usuarios',{})
				for(var i = 0; i<asociados.length; i++)
				{
					params.asociados.push(asociados[i].email)
				}
			}

			if(!params.hasOwnProperty('proyectos'))
				params.proyectos = []
			if(params.proyectos.length > 0){
				params.proyectos = ComunService.arraytoObjectId(params.proyectos)
			}
			else
			{
				let proyectos = await ModelService.find('Proyectos',{})
				for(var i = 0; i<proyectos.length; i++)
				{
					params.proyectos.push(proyectos[i]._id)
				}
			}
			let vinculacion = await AsoProyectosService.metricas({asociado :{'$in':params.asociados}, idProyecto : {'$in':params.proyectos}})
				
			let query = {
				fecha:{'$gte':params.fechaIni,'$lte':params.fechaFin}
			}			
			for(var i=0;i<vinculacion.length;i++)
			{
				//console.log(vinculacion[i].asociado.email,vinculacion[i].idProyecto.nombreProyecto)
				query.emailAsociado = vinculacion[i].asociado.email
				query.idProyecto = vinculacion[i].idProyecto._id
				vinculacion[i].registros = await ModelService.find('Registros',query)
			}
			let aux = [];
			for(var i=0;i<vinculacion.length;i++)
			{
				//console.log(vinculacion[i].asociado.email,vinculacion[i].registros.length)
				if(vinculacion[i].registros.length>0)
					aux.push(vinculacion[i])
			}
			let result = [];			
			for(var i=0;i<aux.length;i++)
			{
				if(aux[i].registros.length!=0)
				{
					data = {
						asociado : aux[i].asociado.nombres+' '+aux[i].asociado.apellidos,
						email : aux[i].asociado.email,
						planeado : aux[i].idProyecto.horas,
						prooyecto : aux[i].idProyecto.nombreProyecto,
						registradas : 0,
						facturables : 0,
						no_facturables : 0,
					}
					registros = aux[i].registros
					for(var j=0;j<registros.length;j++)
					{
						data.registradas = data.registradas + parseInt(registros[j].minutos)
						if(registros[j].facturable == 'SI')
							data.facturables = data.facturables + parseInt(registros[j].minutos)
						else
							data.no_facturables = data.no_facturables + parseInt(registros[j].minutos)
					}
					data.registradas = (data.registradas/60).toFixed(2)
					data.facturables = (data.facturables/60).toFixed(2)
					data.no_facturables = (data.no_facturables/60).toFixed(2)
					result.push(data)
				}
			}
			return res.json(ResponseService.res(200, 10001, false, result));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},

	/*
	importUsuarios : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"data:"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let data = params.data;
			for (const usuario of data) {
				exists = await ModelService.findOne('Usuarios',{email : usuario.email})
				if(!exists)
				{
					create = {
						_id:usuario._id,
						nombres:usuario.nombres,
						apellidos:usuario.apellidos,
						email:usuario.email,
						activo:usuario.activo,
						admin:usuario.admin,
						mac:usuario.mac!=null?usuario.mac:'',
						pass:usuario.pass!=null?usuario.pass:'',
						revisor:usuario.revisor,
						superAdmin:usuario.superAdmin,
						perfil:usuario.perfil,
						celular : '',
						genero : '',
						direccion: '',					
						sueldo: '',
						tipoDocumento : '',
						numeroDocumento : '',
						estadoCivil : '',
						arl : '',
						eps : '',
						pension: '',					
						cumpleaños: '',
						fecha_ingreso: '',
						horasSemana : '',
						horasPotenciales : '',
						tarifaHora : '',
						seniority : '',
						eneatipo : '',
						numEmergencia : '',
						cursos : '',
						softSkill : '',
						hasOwnProperty : '',
						hardSkill : '',
						localPhone : '',
						photo : '',
						premisos : {
							gea : 'USER',
							git : 'USER',
							gecp : 'USER',
							point : 'USER',
							psp : 'USER',
							admin : false
						}												
					}
					await ModelService.create('Usuarios',create)
				}
			}

			return res.json(ResponseService.res(200, 10001, false, true));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},
	importUsuarios2 : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"data:"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let data = params.data;
			for (const usuario of data) {
				exists = await ModelService.findOne('Usuarios',{email : usuario.email})
				if(exists)
				{
					create = {
						admin:usuario.hasOwnProperty('admin')?usuario.admin:false,
						mac:usuario.hasOwnProperty('mac')?usuario.mac:'',
						pass:usuario.hasOwnProperty('pass')?usuario.pass:'',
						revisor:usuario.hasOwnProperty('revisor')?usuario.revisor:false,
						superAdmin:usuario.hasOwnProperty('superAdmin')?usuario.superAdmin:false,
						celular : usuario.hasOwnProperty('celular')?usuario.celular:'',
						genero : usuario.hasOwnProperty('genero')?usuario.genero:'',
						direccion: usuario.hasOwnProperty('direccion')?usuario.direccion:'',
						sueldo: usuario.hasOwnProperty('sueldo')?usuario.sueldo:'',
						tipoDocumento : usuario.hasOwnProperty('tipoDocumento')?usuario.tipoDocumento:'',
						numeroDocumento : usuario.hasOwnProperty('numeroDocumento')?usuario.numeroDocumento:'',
						estadoCivil : usuario.hasOwnProperty('estadoCivil')?usuario.estadoCivil:'',
						arl : usuario.hasOwnProperty('arl')?usuario.arl:'',
						eps : usuario.hasOwnProperty('eps')?usuario.eps:'',
						pension: usuario.hasOwnProperty('pension')?usuario.pension:'',
						cumpleaños: usuario.hasOwnProperty('cumpleaños')?usuario.cumpleaños:'',
						fecha_ingreso: usuario.hasOwnProperty('fecha_ingreso')?usuario.fecha_ingreso:'',
						horasSemana : usuario.hasOwnProperty('horasSemana')?usuario.horasSemana:'',
						horasPotenciales : usuario.hasOwnProperty('horasPotenciales')?usuario.horasPotenciales:'',
						tarifaHora : usuario.hasOwnProperty('tarifaHora')?usuario.tarifaHora:'',
						seniority : usuario.hasOwnProperty('seniority')?usuario.seniority:'',
						eneatipo : usuario.hasOwnProperty('eneatipo')?usuario.eneatipo:'',
						numEmergencia : usuario.hasOwnProperty('numEmergencia')?usuario.numEmergencia:'',
						cursos : usuario.hasOwnProperty('cursos')?usuario.cursos:'',
						softSkill : usuario.hasOwnProperty('softSkill')?usuario.softSkill:'',
						hardSkill : usuario.hasOwnProperty('hardSkill')?usuario.hardSkill:'',
						localPhone : usuario.hasOwnProperty('localPhone')?usuario.localPhone:'',
						photo : usuario.hasOwnProperty('photo')?usuario.photo:'',
						permisos : {
							gea : 'USER',
							git : 'USER',
							gecp : 'USER',
							point : 'USER',
							psp : 'USER',
						}												
					}
					if(usuario.hasOwnProperty('permisos'))
						create.permiso = usuario.permisos

					await ModelService.update('Usuarios',create,{email:usuario.email})
					console.log(usuario.email)
				}
			}

			return res.json(ResponseService.res(200, 10001, false, true));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},
	*/
	llamadosAtencion : async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"fechaAtencion:",			
				"enlace:string",
				"email:email"		
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let user = await ModelService.findOne("Usuarios", {email:params.email.toLowerCase()});
			if (!user)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			paramsData = {
				fechaAtencion: params.fechaAtencion,
				enlace:params.enlace,
				email: params.email.toLowerCase()
			};

			let result = await ModelService.create("LlamadosAtencion", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	listarLlamdosAtencion : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
                "email:email"
			];

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));
	
			let llamadoAtencion = await ModelService.find('llamadosAtencion',{email: params.email})
			if(!llamadoAtencion)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, llamadoAtencion));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	checkRedHumana : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
			];
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			let hoy = moment().format("YYYY-MM-DD")
			let result = await ModelService.find('Usuarios',{activo:true,redHumana:"SI",fechaProrrogaRed:{"$lte":hoy}})
			return res.json(ResponseService.res(200, 10001, false, result));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));			
		}
	},
}