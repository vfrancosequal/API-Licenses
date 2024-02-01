module.exports = {
	list : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('Proyectos')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },
	        { $lookup: {
	                    from: "organizaciones",
	                    localField: "idOrganizacion",
	                    foreignField: "_id",
	                    as:"idOrganizacion"
	                   } 
	        },
	        { $unwind: {path:"$idOrganizacion",preserveNullAndEmptyArrays: true}},
	        { $lookup: {
	                    from: "areas",
	                    localField: "idArea",
	                    foreignField: "_id",
	                    as:"idArea"
	                   } 
	        },
	        { $unwind: {path:"$idArea",preserveNullAndEmptyArrays: true}}]);	        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},
	info : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('Proyectos')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },
	        { $lookup: {
	                    from: "organizaciones",
	                    localField: "idOrganizacion",
	                    foreignField: "_id",
	                    as:"idOrganizacion"
	                   } 
	        },
	        { $unwind: {path:"$idOrganizacion",preserveNullAndEmptyArrays: true}},
	        { $lookup: {
	                    from: "areas",
	                    localField: "idArea",
	                    foreignField: "_id",
	                    as:"idArea"
	                   } 
	        },
	        { $unwind: {path:"$idArea",preserveNullAndEmptyArrays: true}}]);	        		        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	}
}