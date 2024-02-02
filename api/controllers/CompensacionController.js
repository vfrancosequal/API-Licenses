module.exports = {
	listarCompensacion : async function(req, res)
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
			/*
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			*/
			let compensacion = await ModelService.find('Compensacion',query)
			if(!compensacion)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, compensacion));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	createCompensacion : async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"compensacion:string"			
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			paramsData = {
				compensacion : params.compensacion.charAt(0).toUpperCase() + params.compensacion.slice(1),
				status : true,
			};

			let result = await ModelService.create("Compensacion", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	updateCompensacion : async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",
				"compensacion:string"			
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let compensacion = await ModelService.findOne("Compensacion", {_id:ComunService.toObjectId(params.id)});
			if (!compensacion)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			paramsData = {
				compensacion : params.compensacion.charAt(0).toUpperCase() + params.compensacion.slice(1),
				status : compensacion.status
			};

			let result = await ModelService.update("Compensacion", paramsData,{_id : compensacion._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	statusCompensacion : async function (req, res)
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

			let compensacion = await ModelService.findOne("Compensacion", {_id:ComunService.toObjectId(params.id)});
			if (!compensacion)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let result = await ModelService.update("Compensacion", {status : !compensacion.status},{_id : compensacion._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	infoCompensacion : async function(req,res)
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

			let compensacion = await ModelService.findOne('Compensacion',{_id:ComunService.toObjectId(params.id)})
			if (!compensacion)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, compensacion));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	}	
}