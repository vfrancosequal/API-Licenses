const moment = require('moment');
module.exports = {
	run : async function(){
		console.log('cron Synchronize AirBnB Booking UTC Time '+moment().utc().format("HH:mm")+'....');
		let project = await ProjectService.findProject({propKey:{'$exists':true}})
		let settings = await ModelService.findOne("Settings")
		let querys = [];
		//let segundos = 0;
		let info = {};
		if(settings.startCron)
		{
			if(project.length>0 && settings.hasOwnProperty('tokenAirBnb'))
			{
				tokenAirBnb = Crypto.decryptString(settings.tokenAirBnb,sails.config.globals.pass)
				for(var i=0;i<project.length;i++)
				{
					//console.log("----------------------------")
					//console.log(project[i]._id)
					//console.log(project[i].propKey)
					//console.log(project[i].suite.length)
					if(project[i].suite.length>0)
					{
						//console.log(project[i].suite)
						let data = {
							authentication : {
								apiKey : tokenAirBnb,
								propKey : project[i].propKey
							}
						}
						for(var j=0;j<project[i].suite.length;j++)
						{
							//console.log(project[i].suite[j].name)
							//console.log(project[i].suite[j].roomId)
							data.roomId = project[i].suite[j].roomId
							//console.log(data)
							info = {
								data : data,
								project : project[i]._id,
								suite : project[i].suite[j]._id,
							}
							querys.push(info)
							/*
							let booking = await AirbnbService.findBooking(data)
							//console.log(booking)
							if(booking.length>0)
							{
								for(var y=0;y<booking.length;y++)
								{
									bookingData = {
										bookId : booking[y].bookId,
										checkIn : booking[y].firstNight,
										checkOut : booking[y].lastNight,
										guest : parseInt(booking[y].numAdult)+parseInt(booking[y].numChild),
										idSuite : project[i].suite[j]._id,
										idProject : project[i]._id,
										pet : 0,
										houseKeeping : 0,
										booking : 0,
										cleaningFee : 0,
										petFee : 0,
										houseKeepingFee : 0,
										tax : parseFloat(booking[y].tax),
										total : parseFloat(booking[y].price),
										user : 
										{
							                phone: booking[y].guestMobile,
							                email: booking[y].guestEmail,
							                fullName: booking[y].guestFirstName+' '+booking[y].guestName,
							                profile: "USER",								
										},
										host : 
										{
							                phone: booking[y].guestMobile,
							                email: booking[y].guestEmail,
							                fullName: booking[y].guestFirstName+' '+booking[y].guestName,
							                profile: "USER",								
										},									
										status : "pending",
										channel : "AIRBNB",
									};
									if(booking[y].statusCode == "2" || booking[y].statusCode == "3")
										bookingData.status = "pending"
									else if(booking[y].statusCode == "1")
										bookingData.status = "active"
									else
										bookingData.status = "cancelled"

									let exists = await ModelService.findOne('Airbooking',{bookId : booking[y].bookId})
									if(exists)
									{	console.log("update")
										await ModelService.update('Airbooking',bookingData,{_id:exists._id})
									}
									else
									{	console.log("create")
										await ModelService.create('Airbooking',bookingData)
									}

								}
							}
							*/
						}
					}
				}
			}
			//console.log(querys)
			if(querys.length>0)
			{
				await ModelService.update("Settings",{startCron : false},{_id : settings._id})
				let i=0;
				//console.log(querys.length)
				//segundos = moment(new Date())
				var interval = setInterval(async function(){
				    //console.log(i);
				    //console.log(segundos);
			        //console.log(moment(new Date()));
			        //console.log(moment(new Date()).diff(segundos,'s'))
			        //console.log(querys[i])
					let booking = await AirbnbService.findBooking(querys[i].data)
					//console.log(booking)
					if(booking.length>0)
					{
						//console.log("entra")
						for(var y=0;y<booking.length;y++)
						{
							bookingData = {
								bookId : booking[y].bookId,
								checkIn : booking[y].firstNight,
								checkOut : booking[y].lastNight,
								guest : parseInt(booking[y].numAdult)+parseInt(booking[y].numChild),
								idSuite : querys[i].suite,
								idProject : querys[i].project,
								pet : 0,
								houseKeeping : 0,
								booking : 0,
								cleaningFee : 0,
								petFee : 0,
								houseKeepingFee : 0,
								tax : parseFloat(booking[y].tax),
								total : parseFloat(booking[y].price),
								user : 
								{
					                phone: booking[y].guestMobile,
					                email: booking[y].guestEmail,
					                fullName: booking[y].guestFirstName+' '+booking[y].guestName,
					                profile: "USER",								
								},
								host : 
								{
					                phone: booking[y].guestMobile,
					                email: booking[y].guestEmail,
					                fullName: booking[y].guestFirstName+' '+booking[y].guestName,
					                profile: "USER",								
								},									
								status : "pending",
								channel : "AIRBNB",
							};
							if(booking[y].statusCode == "2" || booking[y].statusCode == "3")
								bookingData.status = "pending"
							else if(booking[y].statusCode == "1")
								bookingData.status = "active"
							else
								bookingData.status = "cancelled"

							let exists = await ModelService.findOne('Airbooking',{bookId : booking[y].bookId})
							if(exists)
							{	console.log("update")
								await ModelService.update('Airbooking',bookingData,{_id:exists._id})
							}
							else
							{	console.log("create")
								await ModelService.create('Airbooking',bookingData)
							}
						}
					}		        
			        i++
			        if(i==querys.length)
			        {
			        	await ModelService.update("Settings",{startCron : true},{_id : settings._id})
			        	clearInterval(interval);
			        }
				},5000);
			}
		}
	}
}