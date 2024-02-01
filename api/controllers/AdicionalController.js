module.exports = {
	listarAdicional : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string"
			];

			if(params.hasOwnProperty('status'))
				valid.push('status:string')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let query = {}
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)
			
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			
			let adicional = await ModelService.find('Adicional',query)
			if(!adicional)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, adicional));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	createAdicional : async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"adicional:string"			
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			paramsData = {
				adicional : params.adicional.charAt(0).toUpperCase() + params.adicional.slice(1),
				status : true,
			};

			let result = await ModelService.create("Adicional", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	updateAdicional : async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",
				"adicional:string"			
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let adicional = await ModelService.findOne("Adicional", {_id:ComunService.toObjectId(params.id)});
			if (!adicional)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			paramsData = {
				adicional : params.adicional.charAt(0).toUpperCase() + params.adicional.slice(1),
				status : adicional.status
			};

			let result = await ModelService.update("Adicional", paramsData,{_id : adicional._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	statusAdicional : async function (req, res)
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

			let adicional = await ModelService.findOne("Adicional", {_id:ComunService.toObjectId(params.id)});
			if (!adicional)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let result = await ModelService.update("Adicional", {status : !adicional.status},{_id : adicional._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	infoAdicional : async function(req,res)
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

			let adicional = await ModelService.findOne('Adicional',{_id:ComunService.toObjectId(params.id)})
			if (!adicional)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, adicional));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	}	
}