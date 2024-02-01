var moment = require('moment')
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

			params.expirationDate = moment(params.expirationDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD")
			if(params.licenseType.toLowerCase() == "trial"){
				params.expirationDate = moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD");
				params.expirationDate = moment(params.expirationDate,"YYYY-MM-DD").add(30, 'days').format("YYYY-MM-DD");
				params.usersNumber = 1
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
				expirationDate : params.expirationDate,
				purchaseDate : moment(params.purchaseDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
				usersNumber : parseInt(params.usersNumber),
				licenseType : params.licenseType.toLowerCase(),
				licenseCode : newCode,
				status : true,
			};

			let result = await ModelService.create("Licenses", paramsData);
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
				"id:ObjectId",
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

			let license = await ModelService.findOne("Licenses", {_id:ComunService.toObjectId(params.id)});
			if (!license)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			params.expirationDate = moment(params.expirationDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD")
			if(params.licenseType.toLowerCase() == "trial"){
				params.expirationDate = moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD");
				params.expirationDate = moment(params.expirationDate,"YYYY-MM-DD").add(30, 'days').format("YYYY-MM-DD");
				params.usersNumber = 1
			}

			paramsData = {
				customerMail : params.customerMail.toLowerCase(),
				customerName : ComunService.capitalize(params.customerName),
				initialDate : moment(params.initialDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
				expirationDate : params.expirationDate,
				purchaseDate : moment(params.purchaseDate,"DD/MM/YYYY").utc().format("YYYY-MM-DD"),
				usersNumber : parseInt(params.usersNumber),
				licenseType : params.licenseType.toLowerCase(),
				status : license.status,
			};

			let result = await ModelService.update("Licenses", paramsData, {_id:license._id});
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
				"id:ObjectId"			
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let license = await ModelService.findOne("Licenses", {_id:ComunService.toObjectId(params.id)});
			if (!license)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			let result = await ModelService.update("Licenses", {status : !license.status},{_id:license._id});
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
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let license = await ModelService.findOne('Licenses',{_id:ComunService.toObjectId(params.id)})
			if (!license)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			return res.json(ResponseService.res(200, 10001, false, license));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	validateLicense : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"id:ObjectId",
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let license = await ModelService.findOne('Licenses',{_id:ComunService.toObjectId(params.id)})
			if (!license)
				return res.status(401).send(ResponseService.res(401, 30009, true));

			if (!license.status)
				return res.status(401).send(ResponseService.res(401, 30020, true));
			console.log(license)

			let today = moment().utc().format("YYYY-MM-DD");
			console.log(today)
			console.log(moment(today).isSameOrBefore(license.initialDate))
			console.log(moment(today).isSameOrAfter(license.expirationDate))
			if(moment(today).isBefore(license.initialDate) || moment(today).isAfter(license.expirationDate))
				return res.status(401).send(ResponseService.res(401, 30020, true));

			let result = {
				expirationDate : license.expirationDate,
				initialDate : license.initialDate,
				status : license.status
			}
			return res.json(ResponseService.res(200, 10001, false, result));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	associateLicense: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"email:email",
				"licenseCode:string"
			];
			let paramsData = {}

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let user = await ModelService.findOne("user", {_id:params.email.toLowerCase()});
			if (!user)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let license = await ModelService.findOne("Licenses", {licenseCode:params.licenseCode});
			if (!license)
				return res.status(401).send(ResponseService.res(401, 30020, true));
			
			if (!license.status)
				return res.status(401).send(ResponseService.res(401, 30020, true));

			let numLicenses = await ModelService.count("user",{idLicense:license._id,_id:{'$ne':user._id}});
			if ((numLicenses+1) > license.usersNumber)
				return res.status(401).send(ResponseService.res(401, 30020, true));

			let result = await ModelService.update("user", {idLicense : license._id},{_id : user._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},

}