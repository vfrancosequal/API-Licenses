module.exports = {
	listByProyecto : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('AsoProyectos')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "asociado",
	                    foreignField: "email",
	                    as:"asociado"
	                   } 
	        },
	        { $unwind: {path:"$asociado",preserveNullAndEmptyArrays: true}}]);	        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},
	listByAsociado : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('AsoProyectos')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },
	        { $lookup: {
	                    from: "proyectos",
	                    localField: "idProyecto",
	                    foreignField: "_id",
	                    as:"idProyecto"
	                   } 
	        },
	        { $unwind: {path:"$idProyecto",preserveNullAndEmptyArrays: true} },
	        { $lookup: {
	                    from: "areas",
	                    localField: "idProyecto.idArea",
	                    foreignField: "_id",
	                    as:"idProyecto.idArea"
	                   } 
	        },
	        { $unwind: {path:"$idProyecto.idArea",preserveNullAndEmptyArrays: true} },	        
	        /*{ $lookup: {
	                    from: "usuarios",
	                    localField: "idProyecto.liderQA",
	                    foreignField: "email",
	                    as:"idProyecto.liderQA"
	                   } 
	        },
	        { $unwind: {path:"$idProyecto.liderQA",preserveNullAndEmptyArrays: true} },*/
	        { $lookup: {
	                    from: "organizaciones",
	                    localField: "idProyecto.idOrganizacion",
	                    foreignField: "_id",
	                    as:"idProyecto.idOrganizacion"
	                   } 
	        },
	        { $unwind: {path:"$idProyecto.idOrganizacion",preserveNullAndEmptyArrays: true}}]);        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},
	availability : async function(params)
	{
		try{
			let asignados = await ModelService.find('AsoProyectos',{asociado : params.email, status : true})
			let actual = 0
			let maxHoras = parseFloat(params.horasAsociado * 1.125)
			let nuevasHoras = parseFloat(parseInt(params.horasProyecto) * (parseInt(params.porcentajeAsignacion)/100))
			if(asignados.length>0)
			{
			  	asignados.forEach(async proyecto => {
			    	actual = actual + parseFloat(proyecto.horas)
			  	})	  	
			}
  			let newTime = parseFloat(actual+nuevasHoras)
			if(newTime>maxHoras)
			{
				return {resp : false, msg :"Se superan las horas maximas del asociado"}
			}
			return {resp : true, newTime : Math.round(newTime),nuevasHoras : Math.round(nuevasHoras)}
		}catch(err)
		{
			console.log(err)
			console.log("error al procesar la data")
			return {resp : false, msg :"error al procesar la data"}			
		}
	},
	metricas : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('AsoProyectos')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "asociado",
	                    foreignField: "email",
	                    as:"asociado"
	                   } 
	        },
	        { $unwind: {path:"$asociado",preserveNullAndEmptyArrays: true}},	        
	        { $lookup: {
	                    from: "proyectos",
	                    localField: "idProyecto",
	                    foreignField: "_id",
	                    as:"idProyecto"
	                   } 
	        },
	        { $unwind: {path:"$idProyecto",preserveNullAndEmptyArrays: true}}]);
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},
	/*
	info : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('Proyectos')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },		    	
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "liderQA",
	                    foreignField: "email",
	                    as:"liderQA"
	                   } 
	        },
	        { $unwind: {path:"$liderQA",preserveNullAndEmptyArrays: true} },
	        { $lookup: {
	                    from: "organizaciones",
	                    localField: "idOrganizacion",
	                    foreignField: "_id",
	                    as:"idOrganizacion"
	                   } 
	        },
	        { $unwind: {path:"$idOrganizacion",preserveNullAndEmptyArrays: true}}]);		        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},*/	
}