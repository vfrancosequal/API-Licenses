module.exports = {
	listLicenses : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [];

			if(params.hasOwnProperty('status'))
				valid.push('status:boolean')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let query = {}
			if(params.hasOwnProperty('status'))
				query.status = ComunService.toBoolean(params.status)

			let resp = await ModelService.find('Licenses',query)
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
	createLicense: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"customerMail:email",
				"customerName:string",
				"initialDate:string",
				"expirationDate:string",
				"purchaseDate:string",
				"usersNumber:number",
				"licenseType:string",				
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			if(params.licenseType.toLowerCase() == "trial"){
				expirationDate = moment(params.initialDate,"DD/MM/YYYY").add(30, 'days').utc().format("YYYY-MM-DD");
				usersNumber = 1
			}

			let exists = false;
			let newCode = "";
			do {
				newCode = ComunService.generateCode();
				exists = await ModelService.findOne("Licenses", {licenseCode:newCode});
				if(!exists)
					exists = true
			} while(!exists);

			paramsData = {
				customerMail : params.customerMail.toLowerCase(),
				customerName : ComunService.capitalize(params.customerName),
				initialDate : moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
				expirationDate : moment(params.expirationDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
				purchaseDate : moment(params.purchaseDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
				usersNumber : parseInt(params.usersNumber),
				licenseType : params.licenseType.toLowerCase(),
				licenseCode : newCode,
				status : true,
			};

			let result = await ModelService.create("Licences", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	updateLicense: async function (req, res)
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
	statusLicense: async function (req, res)
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
	infoLicense : async function(req,res)
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
}