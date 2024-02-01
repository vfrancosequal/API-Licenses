module.exports = {
	listarEquipos : async function(req, res)
	{
		try
		{
			params = req.allParams();
			let valid = [
				"app:string"
			];

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);
			/*
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			*/
			//let equipos = await ModelService.find('Equipos',{estado:'Habilitado'})
			//let equipos = await ModelService.find('Equipos')
			let equipos = await EquiposService.listEquipos()
			if(!equipos)
				return res.status(401).send(ResponseService.res(401, 30002, true));
			return res.json(ResponseService.res(200, 10001, false, equipos));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	createEquipo: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"idProveedor:string",			
				"idEquipo:string",			
				"idProducto:string",			
				"fechaEntrega:string",			
				"marca:ObjectId",			
				"modelo:string",			
				"procesador:string",			
				"ram:string",			
				"disco:string",			
				"sistema:string",			
				"estado:string",
				"tipoEquipo:string",
				"valorComercial:string",			
				"proveedor:string",
				"contactoProveedor:string",
			];
			let paramsData = {}

			if(params.hasOwnProperty('notas'))
				valid.push('notas:string')
			if(params.hasOwnProperty('otros'))
				valid.push('otros:string')
			if(params.hasOwnProperty('kit'))
				valid.push('kit:string')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let idProveedor = await ModelService.findOne("Equipos", {idProveedor:params.idProveedor});
			if (idProveedor)
				return res.status(401).send(ResponseService.res(401, 30014, true,"id de proveedor"));
			
			let idEquipo = await ModelService.findOne("Equipos", {idEquipo:params.idEquipo});
			if (idEquipo)
				return res.status(401).send(ResponseService.res(401, 30014, true,"id de equipo"));
			
			let idProducto = await ModelService.findOne("Equipos", {idProducto:params.idProducto});
			if (idProducto)
				return res.status(401).send(ResponseService.res(401, 30014, true,"id de producto"));
			
			let user = await ModelService.findOne("Usuarios", {email:params.asociado.toLowerCase()});
			if (!user)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let marca = await ModelService.findOne("Marcas", {_id:ComunService.toObjectId(params.marca)});
			if (!marca)
				return res.status(401).send(ResponseService.res(401, 30010, true, 'Marca'));

			paramsData = {
				idProveedor : params.idProveedor,
				idEquipo : params.idEquipo,
				idProducto : params.idProducto,
				fechaEntrega : params.fechaEntrega,
				marca : marca._id,
				modelo : params.modelo,
				procesador : params.procesador,
				ram : params.ram,
				disco : params.disco,
				sistema : params.sistema,
				estado : params.estado,
				tipoEquipo: params.tipoEquipo,
				valorComercial: params.valorComercial,
				proveedor: params.proveedor,
				contactoProveedor: params.contactoProveedor,
			};

			if(params.hasOwnProperty('notas'))
				paramsData.notas=params.notas
			if(params.hasOwnProperty('otros'))
				paramsData.otros=params.otros
			if(params.hasOwnProperty('kit'))
				paramsData.kit=params.kit

			let result = await ModelService.create("Equipos", paramsData);
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	updateEquipo: async function (req, res)
	{
		try
		{
			var params = req.allParams();
			let valid = [
				"app:string",
				"id:ObjectId",
				"idProveedor:string",			
				"idEquipo:string",			
				"idProducto:string",			
				"fechaEntrega:string",			
				"marca:ObjectId",			
				"modelo:string",			
				"procesador:string",			
				"ram:string",			
				"disco:string",			
				"sistema:string",						
				"estado:string",
				"tipoEquipo:string",
				"valorComercial:string",			
				"proveedor:string",
				"contactoProveedor:string",			
			];
			let paramsData = {}

			if(params.hasOwnProperty('notas'))
				valid.push('notas:string')
			if(params.hasOwnProperty('otros'))
				valid.push('otros:string')
			if(params.hasOwnProperty('kit'))
				valid.push('kit:string')

			//validaciones de entrada
			let val = ComunService.validate(params, valid);
			if (val.error) return res.status(401).send(val);

			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));

			let equipo = await ModelService.findOne("Equipos", {_id:ComunService.toObjectId(params.id)});
			if (!equipo)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let idProveedor = await ModelService.findOne("Equipos", {_id : {'$ne':ComunService.toObjectId(params.id)},idProveedor:params.idProveedor});
			if (idProveedor)
				return res.status(401).send(ResponseService.res(401, 30014, true,"id de proveedor"));
			
			let idEquipo = await ModelService.findOne("Equipos", {_id : {'$ne':ComunService.toObjectId(params.id)},idEquipo:params.idEquipo});
			if (idEquipo)
				return res.status(401).send(ResponseService.res(401, 30014, true,"id de equipo"));
			
			let idProducto = await ModelService.findOne("Equipos", {_id : {'$ne':ComunService.toObjectId(params.id)},idProducto:params.idProducto});
			if (idProducto)
				return res.status(401).send(ResponseService.res(401, 30014, true,"id de producto"));			

			let user = await ModelService.findOne("Usuarios", {email:params.asociado.toLowerCase()});
			if (!user)
				return res.status(401).send(ResponseService.res(401, 30002, true));

			let marca = await ModelService.findOne("Marcas", {_id:ComunService.toObjectId(params.marca)});
			if (!marca)
				return res.status(401).send(ResponseService.res(401, 30010, true, 'Marca'));

			paramsData = {
				idProveedor : params.idProveedor,
				idEquipo : params.idEquipo,
				idProducto : params.idProducto,
				fechaEntrega : params.fechaEntrega,
				marca : marca._id,
				modelo : params.modelo,
				procesador : params.procesador,
				ram : params.ram,
				disco : params.disco,
				sistema : params.sistema,
				estado : params.estado,
				tipoEquipo: params.tipoEquipo,
				valorComercial: params.valorComercial,
				proveedor: params.proveedor,
				contactoProveedor: params.contactoProveedor,
			};

			if(params.hasOwnProperty('notas'))
				paramsData.notas=params.notas
			if(params.hasOwnProperty('otros'))
				paramsData.otros=params.otros
			if(params.hasOwnProperty('kit'))
				paramsData.kit=params.kit

			let result = await ModelService.update("Equipos", paramsData,{_id:equipo._id});
			return res.json(ResponseService.res(200, 10001, false, result));
	    } catch (err) {
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
	    }
	},
	infoEquipo : async function(req,res)
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
			/*
			let permiso = await ComunService.validApp(params.app.toLowerCase(),'admin',req.userEmail)
			if(!permiso)
				return res.status(401).send(ResponseService.res(401, 30001, true));
			*/
			let equipo = await EquiposService.infoEquipos({_id:ComunService.toObjectId(params.id)})
			if (equipo.length == 0)
				return res.status(401).send(ResponseService.res(401, 30008, true));
			
			equipo = equipo[0]
			return res.json(ResponseService.res(200, 10001, false, equipo));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},
	deleteEquipo : async function(req,res)
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

			let equipo = await ModelService.findOne('Equipos',{_id:ComunService.toObjectId(params.id)})
			if (!equipo)
				return res.status(401).send(ResponseService.res(401, 30008, true));
			
			if(equipo.estado=='Habilitado')
				return res.status(401).send(ResponseService.res(401, 30011, true));

			await ModelService.delete('Equipos',{_id:equipo._id})
			return res.json(ResponseService.res(200, 10001, false, {}));
		}
		catch(err)
		{
			console.log(err)
			return res.status(500).send(ResponseService.res(500, 40001, true, err));
		}
	},			
}