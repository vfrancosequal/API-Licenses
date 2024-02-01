//const moment = require('moment');
const moment = require('moment-timezone');
module.exports = {
	listarMisPoints : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
			];
			
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));			
				
			let points = await PointsService.find({creadoPor : asociado.email})
			return res.json(ResponseService.res(200, 10001, false, points));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	listarPointsAsignados : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
			];
			
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));			
			
			let permiso = true
			if(!await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail) && !await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail))
				permiso = false

			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let points = await PointsService.find({responsable : asociado.email})
			return res.json(ResponseService.res(200, 10001, false, points));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	listarPointsTotales : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string",
			];
			
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);		
			
			let permiso = true
			if(!await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail))
				permiso = false

			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let points = await PointsService.find({})
			return res.json(ResponseService.res(200, 10001, false, points));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},			
	createPoint: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"asunto:string",
				"descripcion:string",				
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));	

			let paramsData = {
				asunto : ComunService.capitalize(params.asunto),
				descripcion : params.descripcion,
				creadoPor : asociado.email,			
				status : 'NUEVO'
			};

			let result = await ModelService.create("Points", paramsData);
			await PointsService.sendMailAdmin(result)
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},	
	infoPoint : async function(req,res)
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

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));	

			let point = await PointsService.find({_id : ComunService.toObjectId(params.id)})
			if (!point)
				return res.status(401).send(ResponseService.res(401, 30008, true));

			let permiso = true
			if(point[0].creadoPor.email!=asociado.email)
				if(!await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail) && !await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail))
					permiso = false

			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			return res.json(ResponseService.res(200, 10001, false, point[0]));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	commentPoint : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"id:ObjectId",
				"message:string",
				"app:string"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));	

			let point = await ModelService.findOne('Points',{_id : ComunService.toObjectId(params.id)})
			if (!point)
				return res.status(401).send(ResponseService.res(401, 30008, true));

			if(point.status === 'CERRADO')
				return res.status(401).send(ResponseService.res(401, 30011, true));
			comment = {
				sendBy : asociado.email,
				message : params.message,
				fecha : moment().tz("America/Bogota").format("DD/MM/YYYY"),
				hora : moment().tz("America/Bogota").format("hh:mm:ss a")
			}
			if(!point.comments)
				point.comments = []
			point.comments.push(comment)
			let result = await ModelService.update("Points", point, {_id:point._id});
			if(result.creadoPor!=asociado.email)
			{
				if(result.responsable!=null)
					await NotificationService.sendNotification(result.responsable,asociado.email,result.asunto)
			}
			else
			{
				await NotificationService.sendNotification(asociado.email,result.responsable,result.asunto)
			}
			return res.json(ResponseService.res(200, 10001, false, result.comments));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	closePoint : async function(req,res)
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

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));	

			let point = await ModelService.findOne('Points',{_id : ComunService.toObjectId(params.id)})
			if (!point)
				return res.status(401).send(ResponseService.res(401, 30008, true));

			if(point.status!='RESUELTO')
				return res.status(401).send(ResponseService.res(401, 30016, true, point.status));

			let permiso = true
			if(!await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail))
				permiso = false

			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			point.status = 'CERRADO'
			comment = {
				sendBy : asociado.email,
				message : "El Point ha sido cerrado",
				fecha : moment(new Date(),"DD/MM/YYYY").format("DD/MM/YYYY"),
				hora : moment(new Date(),"DD/MM/YYYY hh:mm:ss").format("hh:mm:ss a")
			}
			if(!point.comments)
				point.comments = []
			point.comments.push(comment)

			let result = await ModelService.update("Points", point, {_id:point._id});
			result.cerradoPor = asociado.email
			await Mailer.sendMail('closePoint',result.creadoPor,'Point Cerrado',result)
			return res.json(ResponseService.res(200, 10001, false, result));			
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	resolvePoint : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"id:ObjectId",
				"status:string",
				"app:string"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));	

			let point = await ModelService.findOne('Points',{_id : ComunService.toObjectId(params.id), responsable : asociado.email})
			if (!point)
				return res.status(401).send(ResponseService.res(401, 30008, true));

			if(point.status.toUpperCase()=='NUEVO' || point.status.toUpperCase()=='RESUELTO' || point.status.toUpperCase()=='CERRADO')
				return res.status(401).send(ResponseService.res(401, 30019, true, point.status));

			let permiso = true
			if(!await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail) && !await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail))
				permiso = false
			
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			point.status = params.status.toUpperCase()
			comment = {
				sendBy : asociado.email,
				message : "El Point ha sido actualizado a estado "+point.status.toLowerCase(),
				fecha : moment(new Date(),"DD/MM/YYYY").format("DD/MM/YYYY"),
				hora : moment(new Date(),"DD/MM/YYYY hh:mm:ss").format("hh:mm:ss a")
			}
			if(!point.comments)
				point.comments = []
			point.comments.push(comment)

			let result = await ModelService.update("Points", point, {_id:point._id});
			
			if(params.status.toUpperCase()=='EN PROCESO')
				await Mailer.sendMail('processPoint',result.creadoPor,'Point En Proceso',result)
			if(params.status.toUpperCase()=='RESUELTO')
				await Mailer.sendMail('resolvePoint',result.creadoPor,'Point Resuelto',result)

			return res.json(ResponseService.res(200, 10001, false, result));			
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},	
	asignPoint : async function(req,res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"id:ObjectId",
				"app:string",
				"email:email"
			];

			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let asociado = await ModelService.findOne("Usuarios", {email : req.userEmail});
			if (!asociado)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let asignado = await ModelService.findOne("Usuarios", {email : params.email});
			if (!asignado)
				return res.status(401).send(ResponseService.res(401, 30002, true));				

			let point = await ModelService.findOne('Points',{_id : ComunService.toObjectId(params.id)})
			if (!point)
				return res.status(401).send(ResponseService.res(401, 30008, true));

			if(point.status=='CERRADO')
				return res.status(401).send(ResponseService.res(401, 30017, true, point.status));

			let permiso = true
			if(!await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail) && !await ComunService.validApp(params.app.toLowerCase(),'revisor',req.userEmail))
				permiso = false

			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			point.status = 'ASIGNADO'
			point.responsable = asignado.email
			comment = {
				sendBy : asociado.email,
				message : "El Point ha sido asignado a "+asignado.email,
				fecha : moment(new Date(),"DD/MM/YYYY").format("DD/MM/YYYY"),
				hora : moment(new Date(),"DD/MM/YYYY hh:mm:ss").format("hh:mm:ss a")
			}
			if(!point.comments)
				point.comments = []
			point.comments.push(comment)
			let result = await ModelService.update("Points", point, {_id:point._id});
			await Mailer.sendMail('newPointRevisor',result.responsable,'Nuevo Point Asignado',result)
			//await Mailer.sendAsingMail('asingPoint',asignado.email,{name : asignado.nombres.split(' ')[0]});
			//await Mailer.sendEmail();
			return res.json(ResponseService.res(200, 10001, false, result));			
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	listarRevisores : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string"
			];

			if(params.hasOwnProperty('activo'))
				valid.push('activo:boolean')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			
			let user = await ModelService.findOne('Usuarios',{email:req.userEmail})
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			
			let query = {activo:true,"permisos.point":{"$in":['REVISOR','ADMIN']}}
			let users = await ModelService.find('Usuarios',query)
			//console.log(user)
			//if(!user)
				//return res.status(401).send(ResponseService.res(401, 30002, true));
			return res.json(ResponseService.res(200, 10001, false, users));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},	
}