const moment = require('moment');

module.exports = {
    crearNovedadGea : async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"novedad:string",			
				"diasLaborales:",			
				"fechaInicio:",	
				"fechaFinal:",	
				"email:email"	
			];
			if(params.novedad.toUpperCase() === "PERMISOLICENCIA")
                valid.push('tipoPermiso:string')

			let paramsData = {}
			params.novedad = params.novedad.toLowerCase()
			params.fechaInicio = moment(params.fechaInicio,"DD/MM/YYYY").utc().format("YYYY-MM-DD")
			params.fechaFinal = moment(params.fechaFinal,"DD/MM/YYYY").utc().format("YYYY-MM-DD")

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

			let available = await NovedadesService.checkAvailability({novedad: params.novedad,fechaInicio : params.fechaInicio, fechaFinal : params.fechaFinal})
			//console.log("available: ",available)
			if(available.length>0)
				return res.status(401).send(ResponseService.res(401, 30013, true));

			paramsData = {
				novedad: params.novedad,
				diasLaborales:params.diasLaborales,
				fechaInicio:params.fechaInicio,
				fechaFinal:params.fechaFinal,
				email:params.email.toLowerCase()
			};

			if(params.novedad.toUpperCase() === "PERMISOLICENCIA"){
                paramsData.tipoPermiso = params.tipoPermiso
			}

			let result = await ModelService.create("NovedadesGEA", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	listarNovedadesGea : async function(req, res)
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

            /* let usuario = await ModelService.findOne("Usuarios", {email : req.userEmail});
            if (!usuario)
                return res.status(401).send(ResponseService.res(401, 30002, true)); */
	
			let novedades = await ModelService.find('NovedadesGEA',{email: params.email})
			if(!novedades)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, novedades));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
    crearNovedadGit : async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"tipoNovedad:string",						
				"fechaNovedad:",	
				"descripcion:string",	
                "id:objectId"	
			];
            //"email:email",
			let paramsData = {}

            if(params.hasOwnProperty('email'))
				valid.push('email:email')
			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));

            let equipo = await ModelService.findOne("Equipos", {_id:ComunService.toObjectId(params.id)});
            if (!equipo)
                return res.status(401).send(ResponseService.res(401, 30002, true));

            if(params.tipoNovedad.toUpperCase() !='RECEPCION' && params.tipoNovedad.toUpperCase()!='ASIGNAR' && params.tipoNovedad.toUpperCase()!='MANTENIMIENTO' && params.tipoNovedad.toUpperCase()!='MEJORA' && params.tipoNovedad.toUpperCase()!='RECOGIDA' && params.tipoNovedad.toUpperCase()!='DEVOLUCION')
				return res.status(401).send(ResponseService.res(401, 40011, true, params.tipoNovedad));

            let user;    
            if(params.tipoNovedad.toUpperCase() === "ASIGNAR"){
                user = await ModelService.findOne("Usuarios", {email:params.email.toLowerCase()});
                if (!user)
                    return res.status(401).send(ResponseService.res(401, 30002, true));
            }

			paramsData = {
				tipoNovedad: params.tipoNovedad.toUpperCase(),
				fechaNovedad:params.fechaNovedad,
				descripcion:params.descripcion,
                creadoPor: req.userEmail,
                equipo: equipo._id
			};

            if(params.tipoNovedad.toUpperCase() === "ASIGNAR"){
                paramsData.email = user.email
                await ModelService.update("Equipos", {asociado:user.email},{_id:equipo._id});
            }

			let result = await ModelService.create("NovedadesGIT", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
    listarNovedadesGit : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
                "id:objectId"
			];

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));

            let equipo = await ModelService.findOne("Equipos", {_id:ComunService.toObjectId(params.id)});
            if (!equipo)
                return res.status(401).send(ResponseService.res(401, 30002, true));

			let novedades = await NovedadesService.listarNovedadesGit({equipo: equipo._id})
			if(!novedades)
				return res.status(401).send(ResponseService.res(401, 30002, true));
            
			return res.json(ResponseService.res(200, 10001, false, novedades));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
}