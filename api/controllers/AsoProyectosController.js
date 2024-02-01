module.exports = {
	listarByProyectos : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"idProyecto:ObjectId"
			];

			if(params.hasOwnProperty('status'))
				valid.push('status:boolean')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let proyecto = await ProyectosService.info({_id : ComunService.toObjectId(params.idProyecto)});
			if (!proyecto)
				return res.status(401).send(ResponseService.res(401, 30005, true));	
			proyecto = proyecto[0]
			let query = {
				idProyecto : proyecto._id
			}
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)
			//console.log(query)
			let resp = await AsoProyectosService.listByProyecto(query)
			if(!resp)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			proyecto.asociados = resp
			return res.json(ResponseService.res(200, 10001, false, proyecto));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	listarByAsociado : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"asociado:email"
			];

			if(params.hasOwnProperty('status'))
				valid.push('status:boolean')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			if(params.asociado != req.userEmail)
			{
				let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
				let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
				if(!admin && !revisor)
					return res.status(401).send(ResponseService.res(401, 30001, true));
			}

			let asociado = await ModelService.findOne("Usuarios", {email : params.asociado.toLowerCase()});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let query = {
				asociado : asociado.email
			}
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)

			let resp = await AsoProyectosService.listByAsociado(query)
			if(!resp)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			
			for (const proyecto of resp) {
				proyecto.nombreLider = '';
				proyecto.emailLider = '';
			    liderQA = await ModelService.findOne('AsoProyectos',{idProyecto:proyecto.idProyecto._id,rol:'LIDERSERVICIO',status:true})
                if(!liderQA)
                    liderQA = await ModelService.findOne('AsoProyectos',{idProyecto:proyecto.idProyecto._id,rol:'LIDERSERVICIO'})
                if(liderQA)
                {
                    liderQA = await ModelService.findOne('Usuarios',{email : liderQA.asociado})
                    proyecto.nombreLider = liderQA.nombres+' '+liderQA.apellidos
                    proyecto.emailLider = liderQA.email
                }                    
			}

			asociado.proyectos = resp
			return res.json(ResponseService.res(200, 10001, false, asociado));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},	
	addAsociado : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"idProyecto:ObjectId",
				"asociado:email",
				"fechaInicio:string",
				"rol:string",
				"porcentajeAsignacion:string",
				"app:string"
			];
			
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let proyecto = await ModelService.findOne("Proyectos", {_id : ComunService.toObjectId(params.idProyecto), status : {'$in':['INICIADO','EN CURSO']}});
			if (!proyecto)
				return res.status(401).send(ResponseService.res(401, 30005, true));	

			let asociado = await ModelService.findOne("Usuarios", {email : params.asociado.toLowerCase(), activo : true});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30004, true));

			let asignado = await ModelService.findOne("AsoProyectos",{asociado : asociado.email, idProyecto : proyecto._id, status : true})
			if (asignado)
				return res.status(401).send(ResponseService.res(401, 50000, true, "Este asociado ya se encuentra asignado a este proyecto"));

			if(!asociado.horasSemana)
				return res.status(401).send(ResponseService.res(401, 50000, true, "Este asociado no tiene horas semanales registradas"));
			
			if(!proyecto.horas)
				return res.status(401).send(ResponseService.res(401, 50000, true, "Este proyecto no tiene horas semanales registradas"));

			let disponible = await AsoProyectosService.availability({email : asociado.email, horasAsociado : asociado.horasSemana, horasProyecto : proyecto.horas, porcentajeAsignacion : params.porcentajeAsignacion})
			if(!disponible.resp)
				return res.status(401).send(ResponseService.res(401, 50000, true, disponible.msg));
			//console.log(disponible)
			//return res.json(ResponseService.res(200, 10001, false,disponible));			

			paramsData = {
				idProyecto : proyecto._id,
				asociado : asociado.email.toLowerCase(),
				rol : params.rol.toUpperCase(),
				fechaInicio : params.fechaInicio,
				porcentajeAsignacion : params.porcentajeAsignacion,
				horas : disponible.nuevasHoras,
				status : true,
			};
			let result = await ModelService.create("AsoProyectos", paramsData);
			/*
			if(params.rol=='LIDERSERVICIO')
				await ModelService.update('Proyectos',{liderQA:asociado.nombres+' '+asociado.apellidos,emailLiderQA:asociado.email}.{_id : proyecto._id})
			*/
			return res.json(ResponseService.res(200, 10001, false, result));			
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},	
	removeAsociado : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"id:ObjectId",
				"fechaFin:string",
				"app:string"
			];

			if(params.hasOwnProperty('notas'))
				valid.push('notas:string')			

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let relacion = await ModelService.findOne("AsoProyectos", {_id : ComunService.toObjectId(params.id)});
			if (!relacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));	

			paramsData = {
				fechaFin : params.fechaFin,
				status : false,
			};

			if(params.hasOwnProperty('notas'))
				paramsData.notas = params.notas

			let result = await ModelService.update("AsoProyectos", paramsData,{_id : relacion._id});
			return res.json(ResponseService.res(200, 10001, false, result));			
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},
}