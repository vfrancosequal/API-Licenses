module.exports = {
	find : function(filter){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection('Points')
		    var cursor;
		    cursor = collection.aggregate([
		    {
		    	$match: filter
		    },
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "creadoPor",
	                    foreignField: "email",
	                    as:"creadoPor"
	                   } 
	        },
	        { $unwind: {path:"$creadoPor",preserveNullAndEmptyArrays: true}},
	        { $lookup: {
	                    from: "usuarios",
	                    localField: "responsable",
	                    foreignField: "email",
	                    as:"responsable"
	                   } 
	        },
	        { $unwind: {path:"$responsable",preserveNullAndEmptyArrays: true}}]);	        
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},
	sendMailAdmin : async function(data)
	{
		try
		{
			var date = new Date();
			var year = date.getFullYear();
			data.year = year
			let admins = await ModelService.find("Usuarios",{"permisos.point":"ADMIN"})
			//console.log(admins.length)
			//console.log("data: ",data)
			if(admins.length>0)
			{
				//admins = [{email:"victorfranco19@gmail.com"}]
				for(var i=0;i<admins.length;i++)
				{
					//console.log(admins[i].email)
					await Mailer.sendMail('newPointAdmin',admins[i].email,'Nuevo Point Creado',data)
				}
			}
		}catch(err)
		{
			console.log(err)
			console.log("error al procesar la data")
			return {resp : false, msg :"error al procesar la data"}			
		}		
	}
}