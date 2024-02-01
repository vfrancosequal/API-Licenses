const ObjectId = require('mongodb').ObjectID;
//var db = User.getDatastore().manager;
module.exports = {

	findById : function(model,id){
		return new Promise(function(resolve, reject) {
		    let collection = ModelService.getCollection(model)
				collection.findOne({
					_id : ObjectId(id.toString())
				},function(err, result){
					if(err)
						return reject(err);
					return resolve( result );
				});
		});
	},
	update : function(model,params,filter,cache=false){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
				var query = { $set :params };

				query.$set.updatedAt = new Date()

				//var filter = { _id : ObjectId(id.toString()) }

				var options = { returnOriginal: false }


				collection.findOneAndUpdate(filter,query,options,function(err,result){
					if(err)
						return reject(err);
					if(result && result.value){
						if(cache)
						   RedisService.deleteKeys(model)
						return resolve(result.value);
					}
					return resolve(false);
				});
		});
	},
	updateMany : function(model,params,filter,cache=false){
		return new Promise(function(resolve, reject) {
			    let collection = ModelService.getCollection(model)
				var query = { $set :params };

				query.$set.updatedAt = new Date()

				//var filter = { _id : ObjectId(id.toString()) }

				var options = { returnOriginal: false, multi:true }

				collection.updateMany(filter,query,options,function(err,result){
					if(err)
						return reject(err);
					if(result && result.value){
						if(cache)
						   RedisService.deleteKeys(model)
						return resolve(result.value);
					}
					return resolve(false);
				});
		});
	},
	count : function(model,params){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
				collection.countDocuments(params,function(err, result){
					if(err)
						return reject(err);
					return resolve( result );
				});
		});
	},
	//
	create: function(model,query,cache=false){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
				query.createdAt=new Date();
				query.updatedAt=new Date();

				collection.insertOne(query,function done(err,result){
					if(err){
						console.log("error create",err)
						return reject(false);
					}
					if(cache)
					   RedisService.deleteKeys(model)
					return resolve(result.ops[0]);
				});

		})
	},
	findOne : function(model,params){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
			    collection.findOne(params,function(err, result){
					if(err)
						return reject(err);
					return resolve( result );
				});
		});
	},
	find : function(model,params,order=null){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
			let cursor=collection.find(params);
				if(order)
					cursor.sort(order)
				cursor.toArray(function(err, result) {
			        if(err)
						return reject(err);
					return resolve( result );
			    });
		});
	},
	deleteOne: function(model,query,cache=false){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
				collection.deleteOne(query,function done(err,result){
					if(err)
						return reject(false);
					if(cache)
						RedisService.deleteKeys(model)
					return resolve(true);
				});
		})
	},
	delete: function(model,query,cache=false){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
				collection.deleteMany(query,function done(err,result){
					if(err)
						return reject(false);
					if(cache)
						RedisService.deleteKeys(model)
					return resolve(true);
				});
		})
	},
	list : function(model){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
			let cursor=collection.find({});
				cursor.toArray(function(err, result) {
			        if(err)
						return reject(err);
					return resolve( result );
			    });
		});
	},
	distinct:function(model,filter,params){
		return new Promise(function(resolve, reject) {
			let collection = ModelService.getCollection(model)
				var options = {};
				collection.distinct(filter,params,options,function(err,result){
					if(err)
						return reject(err);
					if(result && result.value)
						return resolve(result.value);
					return resolve(false);
				});
		});
	},
	getCollection:function(model){
		try{
		    let db = User.getDatastore().manager;
		    return db.collection(model.toLowerCase())
	    }catch(err){
	        return false
	    }
	},
	listAggregate : function(model, filter, populate = null,localField){
	    return new Promise(function(resolve, reject) {
        	const collection = ModelService.getCollection(model)
	        let cursor
	        if (populate == null)
	        {
	          	cursor=collection.find(filter);
	        }
	        else
	        {
	          	let query = []
	          	for (var i = 0; i < populate.length; i++){
		            	query = query.concat([
						{
						  "$match":filter
						}, 
		            	{
		                  	$lookup: {
		                    	from: populate[i].toLowerCase(),
		                        localField: localField,
		                        foreignField: '_id',
		                        as: localField
		                    }
		                },
		                ])
		        }
		        cursor=collection.aggregate(query);
		    }
		    cursor.toArray(function(err, result) {
		        if(err)
		         	return reject(err);
		       	return resolve( result );
		    });
	   	});
	},
	listFilter:function(model, match){
		return new Promise(async function(resolve, reject) {				        	
          	let collection = ModelService.getCollection(model)							
			var cursor;				
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
}
