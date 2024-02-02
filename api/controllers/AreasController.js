module.exports = {
	listarAreas : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"idOrganizacion:ObjectId"
			];
			
			if(params.hasOwnProperty('status'))
				valid.push('status:boolean')
			
			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let organizacion = await ModelService.findOne("Organizaciones", {_id:ComunService.toObjectId(params.idOrganizacion)});
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));			
			
			let query = {
				idOrganizacion : organizacion._id
			}
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)
			
			let areas = await ModelService.find('Areas',query)
			//if(!areas)
				//return res.status(401).send(ResponseService.res(401, 30002, true));
			return res.json(ResponseService.res(200, 10001, false, areas));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	infoArea : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"id:ObjectId",
				"app:string"
			];

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let area = await ModelService.findOne('Areas',{_id : ComunService.toObjectId(params.id)})
			if (!area)
				return res.status(401).send(ResponseService.res(401, 30008, true));

			return res.json(ResponseService.res(200, 10001, false, area));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	createArea: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"nombreArea:string",
				"idOrganizacion:ObjectId",				
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let organizacion = await ModelService.findOne("Organizaciones", {_id:ComunService.toObjectId(params.idOrganizacion)});
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			let paramsData = {
				nombreArea : ComunService.capitalize(params.nombreArea),
				idOrganizacion : organizacion._id,			
				status : true
			};

			let result = await ModelService.create("Areas", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},	
	updateArea: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",				
				"nombreArea:string",
				"idOrganizacion:ObjectId",				
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let organizacion = await ModelService.findOne("Organizaciones", {_id:ComunService.toObjectId(params.idOrganizacion)});
			if (!organizacion)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			let area = await ModelService.findOne("Areas", {_id:ComunService.toObjectId(params.id)});
			if (!area)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let paramsData = {
				nombreArea : ComunService.capitalize(params.nombreArea),
				idOrganizacion : organizacion._id,			
				status : area.status
			};

			let result = await ModelService.update("Areas", paramsData, {_id : area._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	statusArea: async function (req, res)
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

			let area = await ModelService.findOne("Areas", {_id:ComunService.toObjectId(params.id)});
			if (!area)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			
			let result = await ModelService.update("Areas", {status : false},{_id : area._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},	
}