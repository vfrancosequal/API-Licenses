const moment = require('moment');
module.exports = {
	listarProyectos : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string"
			];
			/*
			if(params.hasOwnProperty('status'))
				valid.push('status:boolean')
			*/
			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);
			/*
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			*/
			let query = {}
			/*
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)
			*/
			let resp = await ProyectosService.list(query)
			if(!resp)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			return res.json(ResponseService.res(200, 10001, false, resp));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	createProyecto: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"idOrganizacion:ObjectId",				
				"idArea:ObjectId",				
				"nombreProyecto:string",
				"dependentName:string",
				"dependentEmail:email",
				"dependentPhone:string",			
				"objetivo:string",			
				"caracteristicas:string",			
				"horas:string",			
				"fechaInicio:string",
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			
			let organizacion = await ModelService.findOne("Organizaciones", {_id : ComunService.toObjectId(params.idOrganizacion),status : true});
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));			
			
			let area = await ModelService.findOne("Areas", {_id:ComunService.toObjectId(params.idArea)});
			if (!area)
				return res.status(401).send(ResponseService.res(401, 30010, true, 'idArea'));

			paramsData = {
				idOrganizacion : organizacion._id,
				idArea : area._id,
				nombreProyecto : params.nombreProyecto.toUpperCase(),
				objetivo : params.objetivo,
				caracteristicas : params.caracteristicas,
				dependentName : ComunService.capitalize(params.dependentName),
				dependentPhone : params.dependentPhone,
				dependentEmail : params.dependentEmail.toLowerCase(),
				fechaInicio : params.fechaInicio,
				horas : params.horas,
				status : 'INICIADO',
				condicion : 'REGULAR'
			};
			//console.log(moment(new Date(),"DD/MM/YYYY").format("DD-MM-YYYY"))
			let log = {
				status : 'INICIADO',
				condicion : 'REGULAR',
				creadoPor : req.userEmail,
				fecha : moment(new Date(),"DD/MM/YYYY").format("DD/MM/YYYY"),
				hora : moment(new Date(),"DD/MM/YYYY hh:mm:ss").format("hh:mm:ss a")				
			}
			paramsData.logStatus = []
			paramsData.logStatus.push(log)
			
			let result = await ModelService.create("Proyectos", paramsData);
			return res.json(ResponseService.res(200, 10001, false, paramsData));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	updateProyecto: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",			
				"idOrganizacion:ObjectId",
				"idArea:ObjectId",
				"objetivo:string",			
				"caracteristicas:string",				
				"nombreProyecto:string",
				"dependentName:string",
				"dependentEmail:email",
				"dependentPhone:string",				
				"horas:string",
				"fechaInicio:string",
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			
			let proyecto = await ModelService.findOne("Proyectos", {_id : ComunService.toObjectId(params.id)});
			if (!proyecto)
				return res.status(401).send(ResponseService.res(401, 30009, true));	

			let organizacion = await ModelService.findOne("Organizaciones", {_id:ComunService.toObjectId(params.idOrganizacion), status : true});
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			let area = await ModelService.findOne("Areas", {_id:ComunService.toObjectId(params.idArea)});
			if (!area)
				return res.status(401).send(ResponseService.res(401, 30010, true, 'idArea'));			

			paramsData = {
				idOrganizacion : organizacion._id,
				idArea : area._id,
				objetivo : params.objetivo,
				caracteristicas : params.caracteristicas,				
				nombreProyecto : params.nombreProyecto.toUpperCase(),
				dependentName : ComunService.capitalize(params.dependentName),
				dependentPhone : params.dependentPhone,
				dependentEmail : params.dependentEmail.toLowerCase(),
				horas : params.horas,
				fechaInicio : params.fechaInicio
			};

			let result = await ModelService.update("Proyectos", paramsData, {_id:proyecto._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	statusProyectoOld: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId"			
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let proyecto = await ModelService.findOne("Proyectos", {_id : ComunService.toObjectId(params.id)});
			if (!proyecto)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			let result = await ModelService.update("Proyectos", {status : !proyecto.status},{_id:proyecto._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	statusProyecto: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",
				"status:string",			
				"condicion:string"
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			params.status = params.status.toUpperCase()
			params.condicion = params.condicion.toUpperCase()

			if(params.status!='INICIADO' && params.status!='EN CURSO' && params.status!='SUSPENDIDO' && params.status!='FINALIZADO')
				return res.status(401).send(ResponseService.res(401, 40007, true, 'status'));
			
			if(params.condicion!='REGULAR' && params.condicion!='IRREGULAR')
				return res.status(401).send(ResponseService.res(401, 40007, true, 'condicion'));

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let proyecto = await ModelService.findOne("Proyectos", {_id : ComunService.toObjectId(params.id)});
			if (!proyecto)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			let log = {
				status : params.status,
				condicion : params.condicion,
				actualizadoPor : req.userEmail,
				fecha : moment(new Date(),"DD/MM/YYYY").format("DD/MM/YYYY"),
				hora : moment(new Date(),"DD/MM/YYYY hh:mm:ss").format("hh:mm:ss a")
			}
			proyecto.logStatus.push(log)

			let result = await ModelService.update("Proyectos", {status : params.status, condicion : params.condicion, logStatus : proyecto.logStatus},{_id:proyecto._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},	
	infoProyecto : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"id:ObjectId",
				"app:string"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let proyecto = await ProyectosService.info({_id : ComunService.toObjectId(params.id)})
			if (!proyecto)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			return res.json(ResponseService.res(200, 10001, false, proyecto));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	importProyectos : async function(req,res)
	{
		let result = []
		try
		{
			console.log("Migración Iniciada")
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
			let exists;
			for (let orga of data)
			{
				org = await ModelService.findOne('Organizaciones',{idPSP : ComunService.toObjectId(orga._id.$oid)})
				if(org != null)
				{
					for (let proyect of orga.listProyectos)
					{
						if(proyect.listComponentes.length > 1)
						{
							for (let component of proyect.listComponentes)
							{	
								newProyect = {
									idOrganizacion : org._id,
									status : 'INICIADO',
									condicion : 'REGULAR',
									log : {
										status : 'INICIADO',
										condicion : 'REGULAR',
										creadoPor : req.userEmail,
										fecha : moment(new Date(),"DD/MM/YYYY").format("DD/MM/YYYY"),
										hora : moment(new Date(),"DD/MM/YYYY hh:mm:ss").format("hh:mm:ss a")				
									}						
								}
								newProyect.nombreProyecto = proyect.nombre.toUpperCase()
								if(proyect.nombre.toUpperCase().split(/[ ,]+/).join('') != component.nombre.toUpperCase().split(/[ ,]+/).join(''))
									newProyect.nombreProyecto = proyect.nombre.toUpperCase()+' - '+component.nombre.toUpperCase()
								result.push(newProyect)
								//console.log(newProyect.nombreProyecto)
							}
						}
						else
						{
							newProyect = {
								idOrganizacion : org._id,
								status : 'INICIADO',
								condicion : 'REGULAR',
								log : {
									status : 'INICIADO',
									condicion : 'REGULAR',
									creadoPor : req.userEmail,
									fecha : moment(new Date(),"DD/MM/YYYY").format("DD/MM/YYYY"),
									hora : moment(new Date(),"DD/MM/YYYY hh:mm:ss").format("hh:mm:ss a")				
								}						
							}							
							newProyect.nombreProyecto = proyect.nombre.toUpperCase()
							result.push(newProyect)							
							//console.log(newProyect.nombreProyecto)
						}
					}
				}
			}
			for (let data of result)
			{
				exists = await ModelService.findOne('Proyectos',{nombreProyecto : data.nombreProyecto})
				if(!exists)
					await ModelService.create("Proyectos",data)			
			}
			console.log("Migración Completa")
			return res.json(ResponseService.res(200, 10001, false, result));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},			
}