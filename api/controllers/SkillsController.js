module.exports = {
	listarSkills : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string"
			];

			if(params.hasOwnProperty('status'))
				valid.push('status:string')
			if(params.hasOwnProperty('type'))
				valid.push('type:string')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let query = {}
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)
			
			if(params.hasOwnProperty('type'))
				query.type = params.type
			/*
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			*/
			let skills = await ModelService.find('Skills',query)
			if(!skills)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, skills));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	createSkill: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"skill:string",			
				"type:string"		
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			paramsData = {
				skill : params.skill.charAt(0).toUpperCase() + params.skill.slice(1),
				type : params.type.toUpperCase(),
				status : true,
			};

			let result = await ModelService.create("Skills", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	updateSkill: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",
				"skill:string",			
				"type:string"			
			];
			let paramsData = {}

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let skill = await ModelService.findOne("Skills", {_id:ComunService.toObjectId(params.id)});
			if (!skill)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			paramsData = {
				skill : params.skill.charAt(0).toUpperCase() + params.skill.slice(1),
				type : params.type.toUpperCase(),
				status : skill.status
			};

			let result = await ModelService.update("Skills", paramsData,{_id:skill._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	statusSkill: async function (req, res)
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

			let skill = await ModelService.findOne("Skills", {_id:ComunService.toObjectId(params.id)});
			if (!skill)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let result = await ModelService.update("Skills", {status : !skill.status},{_id : skill._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	infoSkill : async function(req,res)
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

			let skill = await ModelService.findOne('Skills',{_id:ComunService.toObjectId(params.id)})
			if (!skill)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			return res.json(ResponseService.res(200, 10001, false, skill));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	}	
}