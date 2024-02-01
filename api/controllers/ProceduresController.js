module.exports = {
	listProcedure : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
				"procedureType:string",
			];
			
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			if(params.procedureType != "ASOCIADOS")
			{
				let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
				let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
				if(!admin && !revisor)
					return res.status(401).send(ResponseService.res(401, 30001, true));
			}
			
			let query = {
				procedureType : params.procedureType
			}
			
			let result = await ModelService.find('Procedures',query)
			return res.json(ResponseService.res(200, 10001, false, result));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	infoProcedure : async function(req,res)
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

			let area = await ModelService.findOne('Procedures',{_id : ComunService.toObjectId(params.id)})
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
	createProcedure: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"procedureDesc:string",
				"procedureLink:string",
				"procedureType:string",
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let paramsData = {
				procedureDesc : params.procedureDesc,
				procedureLink : params.procedureLink,
				procedureType : params.procedureType 
			};

			let result = await ModelService.create("Procedures", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},	
	updateProcedure: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",				
				"procedureDesc:string",
				"procedureLink:string",
				"procedureType:string",				
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let procedure = await ModelService.findOne("Procedures", {_id:ComunService.toObjectId(params.id)});
			if (!procedure)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let paramsData = {
				procedureDesc : params.procedureDesc,
				procedureLink : params.procedureLink,
				procedureType : params.procedureType
			};

			let result = await ModelService.update("Procedures", paramsData, {_id : procedure._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	deleteProcedure: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId"			
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let admin = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			let revisor = await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail)
			if(!admin && !revisor)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let procedure = await ModelService.findOne("Procedures", {_id:ComunService.toObjectId(params.id)});
			if (!procedure)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			
			let result = await ModelService.delete("Procedures",{_id : procedure._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},	
}