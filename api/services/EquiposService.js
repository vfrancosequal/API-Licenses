module.exports = {
	listEquipos : function(){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('Equipos')
		    var cursor;
		    cursor = collection.aggregate([
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "asociado",
	                    foreignField: "email",
	                    as:"asociado"
	                   } 
	        },
	        { $unwind: {path:"$asociado",preserveNullAndEmptyArrays: true} },
	        { $lookup: {
	                    from: "marcas",
	                    localField: "marca",
	                    foreignField: "_id",
	                    as:"marca"
	                   } 
	        },
	        { $unwind: {path:"$marca",preserveNullAndEmptyArrays: true}}]);	        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},
	infoEquipos : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('Equipos')
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
	        { $unwind: {path:"$asociado",preserveNullAndEmptyArrays: true} },
	        { $lookup: {
	                    from: "marcas",
	                    localField: "marca",
	                    foreignField: "_id",
	                    as:"marca"
	                   } 
	        },
	        { $unwind: {path:"$marca",preserveNullAndEmptyArrays: true} }]);	        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},	
}