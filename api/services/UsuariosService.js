const moment = require('moment');
module.exports = {
	registrarCSV : async function(jsonArray)
	{
		try
		{
			settings = await ModelService.findOne('Settings')
			settings = await ModelService.update('Settings',{guardando : true},{_id : settings._id})
			//console.log("Antes: ",settings)
			for (const registro of jsonArray){
				//console.log(registro)
				exists = await ModelService.findOne('Registros',{idRegistro : registro['ID-REGISTRO']})
				org = await ModelService.findOne('Organizaciones',{name:registro.UO})
				proye = null
				//console.log('idOrganizacion', org._id, 'nombreProyecto', new RegExp(registro.PROYECTO, 'i'))
				if(org!=null)
					proye = await ModelService.findOne('Proyectos',{idOrganizacion : org._id, nombreProyecto : new RegExp(registro.PROYECTO, 'i')})
				user = await ModelService.findOne('Usuarios',{_id:registro['PR.']})
				data = {
					emailAsociado : (user!=null)?user.email:'No Encontrado',
					idOrganizacion : (org!=null)?org._id:'No Encontrado',
					idProyecto : (proye!=null)?proye._id:'No Encontrado',
					idAsociado : (user!=null)?user._id:registro['PR.'],
					asociado : (user!=null)?(user.nombres+' '+user.apellidos):registro.USUARIO,
					rol : (user!=null)?user.perfil:registro.ROL,
					dia : registro.DIA,
					semana : registro.SEM,
					fecha : moment(registro.FECHA,"DD/MM/YYYY").format("YYYY-MM-DD"),
					horaIni : registro.INICIO,
					horaFin : registro.FIN,
					minutos : registro.MINUTOS,
					horas : registro.HRS,
					organizacion : registro.UO,
					proyecto : registro.PROYECTO,
					componente : registro.COMPONENTE,
					proceso : registro.PROCESO,
					tarea : registro.TAREA,
					nota : registro.NOTA,
					facturable : registro.FACTURAR,
					comentario : registro['TEXTO ANEXO'],
					hu : registro.HU,
					cp_bug : registro['CP-BUG'],
					idRegistro : registro['ID-REGISTRO']
				}
				//console.log(data)
				if(!exists)
					await ModelService.create('Registros',data)//CREATE//console.log('create')
				else
					await ModelService.update('Registros',data,{_id : exists._id})//UPDATE//console.log('update')
			}
			//console.log(jsonArray.length)
			
			settings = await ModelService.update('Settings',{guardando : false},{_id : settings._id})
			//console.log("Despues: ",settings)

			return true
		}catch(err)
		{
			console.log(err)
			console.log("error al procesar la data")
			return {resp : false, msg :"error al procesar la data"}			
		}
	},
	info : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('Usuarios')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },
	        { $lookup: {
	                    from: "pension",
	                    localField: "pension",
	                    foreignField: "_id",
	                    as:"pension"
	                   } 
	        },
	        { $unwind: {path:"$pension",preserveNullAndEmptyArrays: true}},
	        { $lookup: {
	                    from: "arl",
	                    localField: "arl",
	                    foreignField: "_id",
	                    as:"arl"
	                   } 
	        },
	        { $unwind: {path:"$arl",preserveNullAndEmptyArrays: true}},
	        { $lookup: {
	                    from: "eps",
	                    localField: "eps",
	                    foreignField: "_id",
	                    as:"eps"
	                   } 
	        },
	        { $unwind: {path:"$eps",preserveNullAndEmptyArrays: true}},
	        { $lookup: {
	                    from: "cesantias",
	                    localField: "cesantias",
	                    foreignField: "_id",
	                    as:"cesantias"
	                   } 
	        },
	        { $unwind: {path:"$cesantias",preserveNullAndEmptyArrays: true}},
	        { $lookup: {
	                    from: "compensacion",
	                    localField: "compensacion",
	                    foreignField: "_id",
	                    as:"compensacion"
	                   } 
	        },
	        { $unwind: {path:"$compensacion",preserveNullAndEmptyArrays: true}}]);	        		        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	}	
}