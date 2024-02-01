module.exports = {
	listarNovedadesGit : function(filtro){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('NovedadesGit')
		    var cursor;
		    cursor = collection.aggregate([
            {
                $match : filtro
            },
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "email",
	                    foreignField: "email",
	                    as:"email"
	                   } 
	        },
	        { $unwind: {path:"$email",preserveNullAndEmptyArrays: true} },
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "creadoPor",
	                    foreignField: "email",
	                    as:"creadoPor"
	                   } 
	        },
	        { $unwind: {path:"$creadoPor",preserveNullAndEmptyArrays: true}}]);	
		    cursor.toArray(function(err, result) {
				if(err)
					return reject(err);
    
		       	return resolve( result );

		    });
	   	});
	},
	checkAvailability : function(params, idBooking = null){
		return new Promise(async function(resolve, reject) {
          	let collection = ModelService.getCollection('NovedadesGEA')
			var cursor;
			console.log(params)
			let match = {novedad: params.novedad,'$or':[{fechaInicio:{'$gte':params.fechaInicio,'$lte':params.fechaFinal}},{fechaFinal:{'$gte':params.fechaInicio,'$lte':params.fechaFinal}}]}
			if(idBooking)
				match._id = { '$ne': idBooking };
			cursor=collection.aggregate([
										{
										  "$match":match
										},
				                        {
				                           $sort:{createdAt:-1} 
				                        },					                        					                        					                  											  																			   										    			                        		
										]);	
			cursor.toArray(async function(err, result) {					
		        if(err){
		        	console.log(err)
					return reject(err);
		        }			  
				return resolve( result );
		    });			
		});		
	},	
	/* listarNovedadesGea : function(filtro){
		console.log(filtro)
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('NovedadesGea')
		    var cursor;
		    cursor = collection.aggregate([
            {
                $match : filtro
            },
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "email",
	                    foreignField: "email",
	                    as:"email"
	                   } 
	        },
	        { $unwind: {path:"$email",preserveNullAndEmptyArrays: true} }]);       
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);

				console.log(result)  
		       	return resolve( result );
		    });
	   	});
	},	 */
}