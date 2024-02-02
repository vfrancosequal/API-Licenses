module.exports = {
	listarOrganizaciones : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string"
			];

			if(params.hasOwnProperty('status'))
				valid.push('status:boolean')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let query = {}
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)

			let resp = await ModelService.find('Organizaciones',query)
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
	createOrganizacion: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"name:string",
				"dependentName:string",
				"dependentPhone:string",
				"dependentEmail:email",				
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			paramsData = {
				name : params.name.toUpperCase(),
				dependentName : ComunService.capitalize(params.dependentName),
				dependentPhone : params.dependentPhone,
				dependentEmail : params.dependentEmail.toLowerCase(),
				status : true,
			};

			let result = await ModelService.create("Organizaciones", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	updateOrganizacion: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",
				"name:string",
				"dependentName:string",
				"dependentPhone:string",
				"dependentEmail:email",					
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let organizacion = await ModelService.findOne("Organizaciones", {_id:ComunService.toObjectId(params.id)});
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			paramsData = {
				name : params.name.toUpperCase(),
				dependentName : ComunService.capitalize(params.dependentName),
				dependentPhone : params.dependentPhone,
				dependentEmail : params.dependentEmail.toLowerCase(),
				status : organizacion.status,
			};

			let result = await ModelService.update("Organizaciones", paramsData, {_id:organizacion._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	statusOrganizacion: async function (req, res)
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

			let organizacion = await ModelService.findOne("Organizaciones", {_id:ComunService.toObjectId(params.id)});
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			let result = await ModelService.update("Organizaciones", {status : !organizacion.status},{_id:organizacion._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	infoOrganizacion : async function(req,res)
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

			let organizacion = await ModelService.findOne('Organizaciones',{_id:ComunService.toObjectId(params.id)})
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			return res.json(ResponseService.res(200, 10001, false, organizacion));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	importOrganizacion : async function(req,res)
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
			for (const orga of data) {
				exists = await ModelService.findOne('Organizaciones',{idPSP : ComunService.toObjectId(orga._id.$oid)})
				if(!exists)
					await ModelService.create('Organizaciones',{name : orga.nombre.toUpperCase(),idPSP : ComunService.toObjectId(orga._id.$oid),status : true})
				else
					await ModelService.update('Organizaciones',{_id : exists._id},{name : orga.nombre.toUpperCase()})
			}
			return res.json(ResponseService.res(200, 10001, false, true));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}		
	},
}